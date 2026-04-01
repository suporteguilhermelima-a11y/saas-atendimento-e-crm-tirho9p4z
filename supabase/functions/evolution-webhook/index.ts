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
      const msgData = body.data
      const remoteJid = msgData.key.remoteJid
      const text = msgData.message?.conversation || msgData.message?.extendedTextMessage?.text || ''
      const fromMe = msgData.key.fromMe
      const senderName = msgData.pushName || 'Desconhecido'
      const phone = remoteJid.split('@')[0]

      if (!fromMe && text) {
        let { data: deal } = await supabase.from('deals').select('id').eq('phone', phone).single()

        if (!deal) {
          const { data: newDeal } = await supabase
            .from('deals')
            .insert({
              name: senderName,
              phone: phone,
              stage: 'lead',
            })
            .select('id')
            .single()
          deal = newDeal
        }

        if (deal) {
          await supabase.from('messages').insert({
            deal_id: deal.id,
            sender_type: 'user',
            text: text,
            is_read: false,
          })
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (error: any) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})
