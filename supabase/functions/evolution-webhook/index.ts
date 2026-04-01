import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const body = await req.json()
    console.log('Webhook payload received:', body.event)

    if (body.event === 'messages.update' && body.data) {
      const updates = Array.isArray(body.data) ? body.data : [body.data]

      for (const update of updates) {
        const waId = update.key?.id
        const statusStr = update.update?.status || update.status

        if (waId && statusStr) {
          let newStatus = 'sent'
          if (['SERVER_ACK'].includes(statusStr)) newStatus = 'sent'
          if (['DELIVERY_ACK'].includes(statusStr)) newStatus = 'delivered'
          if (['READ', 'PLAYED'].includes(statusStr)) newStatus = 'read'
          if (['ERROR'].includes(statusStr)) newStatus = 'error'

          await supabase.from('messages').update({ status: newStatus }).eq('wa_message_id', waId)
        }
      }

      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders })
    }

    if (body.event === 'messages.upsert' && body.data) {
      const msgData = body.data.message || body.data
      const key = msgData?.key || body.data?.key

      if (!key || !key.remoteJid) {
        return new Response(JSON.stringify({ success: true, reason: 'No remoteJid found' }), {
          headers: corsHeaders,
        })
      }

      const remoteJid = key.remoteJid
      const waMessageId = key.id

      if (remoteJid === 'status@broadcast' || remoteJid.includes('@g.us')) {
        return new Response(
          JSON.stringify({ success: true, reason: 'Ignored broadcast or group message' }),
          { headers: corsHeaders },
        )
      }

      const messageContent = msgData?.message || msgData
      const text =
        messageContent?.conversation ||
        messageContent?.extendedTextMessage?.text ||
        messageContent?.imageMessage?.caption ||
        ''
      const fromMe = key.fromMe
      const senderName = msgData?.pushName || body.data?.pushName || 'Desconhecido'

      let phone = remoteJid.split('@')[0].replace(/\D/g, '')

      if (phone.length === 10 || phone.length === 11) {
        phone = `55${phone}`
      }

      if (text && phone) {
        let { data: deal } = await supabase
          .from('deals')
          .select('id, stage')
          .eq('phone', phone)
          .single()

        if (!deal && !fromMe) {
          const { data: newDeal, error: dealError } = await supabase
            .from('deals')
            .insert({
              name: senderName,
              phone: phone,
              stage: 'lead',
            })
            .select('id')
            .single()

          if (dealError) throw dealError
          deal = newDeal
        }

        if (deal) {
          let shouldInsert = true

          if (fromMe) {
            const { data: recent } = await supabase
              .from('messages')
              .select('id, created_at, wa_message_id')
              .eq('deal_id', deal.id)
              .eq('text', text)
              .eq('sender_type', 'attendant')
              .order('created_at', { ascending: false })
              .limit(1)

            if (recent && recent.length > 0) {
              const msgTime = new Date(recent[0].created_at).getTime()
              const now = Date.now()
              if (Math.abs(now - msgTime) < 120000) {
                shouldInsert = false
                console.log('Skipping duplicate fromMe message (already sent via CRM)')

                if (!recent[0].wa_message_id) {
                  await supabase
                    .from('messages')
                    .update({ wa_message_id: waMessageId })
                    .eq('id', recent[0].id)
                }
              }
            }
          }

          if (shouldInsert) {
            await supabase.from('messages').insert({
              deal_id: deal.id,
              sender_type: fromMe ? 'attendant' : 'user',
              text: text,
              is_read: fromMe ? true : false,
              status: fromMe ? 'sent' : 'received',
              wa_message_id: waMessageId,
            })
          }

          await supabase
            .from('deals')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', deal.id)
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
