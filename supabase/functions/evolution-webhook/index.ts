import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const body = await req.json()
    console.log('Webhook payload received')

    if (body.event === 'messages.upsert' && body.data) {
      // Handle nested structures that might differ depending on Evolution API version
      const msgData = body.data.message || body.data
      const key = msgData?.key || body.data?.key
      
      if (!key || !key.remoteJid) {
        return new Response(JSON.stringify({ success: true, reason: 'No remoteJid found' }), { headers: corsHeaders })
      }

      const remoteJid = key.remoteJid
      
      // Ignore broadcast statuses and group messages
      if (remoteJid === 'status@broadcast' || remoteJid.includes('@g.us')) {
        return new Response(JSON.stringify({ success: true, reason: 'Ignored broadcast or group message' }), { headers: corsHeaders })
      }

      const messageContent = msgData?.message || msgData
      const text = messageContent?.conversation || messageContent?.extendedTextMessage?.text || messageContent?.imageMessage?.caption || ''
      const fromMe = key.fromMe
      const senderName = msgData?.pushName || body.data?.pushName || 'Desconhecido'
      
      // Extract numeric phone number from JID (e.g., "5511999999999@s.whatsapp.net" -> "5511999999999")
      const phone = remoteJid.split('@')[0].replace(/\D/g, '')

      if (text && phone) {
        // Try to find the associated deal using the phone number
        let { data: deal } = await supabase.from('deals').select('id, stage').eq('phone', phone).single()
        
        // If no deal exists and it's an incoming message (not from us), create a new lead
        if (!deal && !fromMe) {
          const { data: newDeal, error: dealError } = await supabase.from('deals').insert({
            name: senderName,
            phone: phone,
            stage: 'lead',
          }).select('id').single()
          
          if (dealError) throw dealError
          deal = newDeal
        }

        if (deal) {
          let shouldInsert = true;

          // If the message is "fromMe", it might have been sent by the CRM interface just now.
          // To avoid duplicates, we check if an identical message was logged very recently.
          if (fromMe) {
            const fewSecondsAgo = new Date(Date.now() - 10000).toISOString();
            const { data: recent } = await supabase
              .from('messages')
              .select('id')
              .eq('deal_id', deal.id)
              .eq('text', text)
              .eq('sender_type', 'attendant')
              .gte('created_at', fewSecondsAgo)
              .limit(1)

            if (recent && recent.length > 0) {
              shouldInsert = false;
              console.log('Skipping duplicate fromMe message (already sent via CRM)')
            }
          }

          if (shouldInsert) {
            await supabase.from('messages').insert({
              deal_id: deal.id,
              sender_type: fromMe ? 'attendant' : 'user',
              text: text,
              is_read: fromMe ? true : false
            })
          }

          // Always update the deal's `updated_at` so it bumps to the top of the chat list in Realtime
          await supabase.from('deals').update({ updated_at: new Date().toISOString() }).eq('id', deal.id)
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})
