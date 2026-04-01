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

    const { message_id, deal_id, text } = await req.json()

    if (!deal_id || !text) {
      throw new Error('deal_id and text are required')
    }

    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('phone')
      .eq('id', deal_id)
      .single()

    if (dealError) throw dealError

    if (deal && deal.phone) {
      const evoUrl = Deno.env.get('EVOLUTION_API_URL')
      const evoKey = Deno.env.get('EVOLUTION_API_KEY')
      const instanceName = Deno.env.get('EVOLUTION_INSTANCE_NAME') || 'crm'

      if (evoUrl && evoKey) {
        let cleanPhone = deal.phone.replace(/\D/g, '')
        if (cleanPhone.length === 10 || cleanPhone.length === 11) {
          cleanPhone = `55${cleanPhone}`
        }

        const response = await fetch(`${evoUrl}/message/sendText/${instanceName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: evoKey,
          },
          body: JSON.stringify({
            number: cleanPhone,
            options: {
              delay: 0,
              presence: 'composing',
              linkPreview: false,
            },
            textMessage: {
              text: text,
            },
          }),
        })

        if (!response.ok) {
          const errorPayload = await response.text()
          console.error('Evolution API error payload:', errorPayload)
          if (message_id) {
            await supabase.from('messages').update({ status: 'error' }).eq('id', message_id)
          }
          throw new Error('Failed to send message via Evolution API')
        } else {
          const resData = await response.json()
          const waMessageId = resData?.key?.id || resData?.message?.key?.id

          if (message_id) {
            await supabase
              .from('messages')
              .update({
                wa_message_id: waMessageId,
                status: 'sent',
              })
              .eq('id', message_id)
          }
        }
      } else {
        console.warn('EVOLUTION_API variables are not set. Message saved in DB but not sent.')
        if (message_id) {
          await supabase.from('messages').update({ status: 'error' }).eq('id', message_id)
        }
      }
    } else {
      if (message_id) {
        await supabase.from('messages').update({ status: 'error' }).eq('id', message_id)
      }
      throw new Error('Deal not found or does not have a phone number to send to.')
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (error: any) {
    console.error('Send error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})
