import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { deal_id } = await req.json()
    if (!deal_id) throw new Error('deal_id is required')

    const { data: deal } = await supabase.from('deals').select('phone').eq('id', deal_id).single()
    if (!deal || !deal.phone) throw new Error('Deal or phone not found')

    const { data: unreadMsgs } = await supabase
      .from('messages')
      .select('id, wa_message_id')
      .eq('deal_id', deal_id)
      .eq('sender_type', 'user')
      .eq('is_read', false)

    if (!unreadMsgs || unreadMsgs.length === 0) {
      return new Response(JSON.stringify({ success: true, count: 0 }), { headers: corsHeaders })
    }

    const idsToUpdate = unreadMsgs.map((m) => m.id)
    await supabase.from('messages').update({ is_read: true, status: 'read' }).in('id', idsToUpdate)

    let evoUrl = Deno.env.get('EVOLUTION_API_URL')
    let evoKey = Deno.env.get('EVOLUTION_API_KEY')
    let instanceName = Deno.env.get('EVOLUTION_INSTANCE_NAME') || 'crm'

    const { data: integ } = await supabase
      .from('user_integrations')
      .select('evolution_api_url, evolution_api_key, instance_name')
      .not('instance_name', 'is', null)
      .limit(1)
      .maybeSingle()

    if (integ) {
      if (integ.evolution_api_url) evoUrl = integ.evolution_api_url
      if (integ.evolution_api_key) evoKey = integ.evolution_api_key
      if (integ.instance_name) instanceName = integ.instance_name
    }

    const adaptaSkip = Deno.env.get('EVOLUTION-ADAPTASKIP')
    if (adaptaSkip) {
      if (adaptaSkip.startsWith('{')) {
        try {
          const parsed = JSON.parse(adaptaSkip)
          evoUrl = parsed.url || parsed.apiUrl || evoUrl
          evoKey = parsed.apiKey || parsed.apikey || parsed.globalapikey || evoKey
          instanceName = parsed.instanceName || parsed.instance || instanceName
        } catch (e) {}
      } else if (adaptaSkip.includes(',')) {
        const parts = adaptaSkip.split(',')
        if (parts[0].startsWith('http')) {
          evoUrl = parts[0].trim()
          evoKey = parts[1]?.trim() || evoKey
          instanceName = parts[2]?.trim() || instanceName
        } else {
          evoKey = parts[0].trim()
        }
      } else if (adaptaSkip.includes('|')) {
        const parts = adaptaSkip.split('|')
        if (parts[0].startsWith('http')) {
          evoUrl = parts[0].trim()
          evoKey = parts[1]?.trim() || evoKey
          instanceName = parts[2]?.trim() || instanceName
        } else {
          evoKey = parts[0].trim()
        }
      } else if (adaptaSkip.startsWith('http')) {
        evoUrl = adaptaSkip
      } else {
        evoKey = adaptaSkip
      }
    }

    if (evoUrl && evoKey) {
      let cleanPhone = deal.phone.replace(/\D/g, '')
      if (cleanPhone.length === 10 || cleanPhone.length === 11) cleanPhone = `55${cleanPhone}`

      const cleanUrl = evoUrl.replace(/\/$/, '')

      const messagesToRead = unreadMsgs
        .filter((m) => m.wa_message_id)
        .map((m) => ({
          remoteJid: `${cleanPhone}@s.whatsapp.net`,
          fromMe: false,
          id: m.wa_message_id,
        }))

      if (messagesToRead.length > 0) {
        await fetch(`${cleanUrl}/chat/markMessageAsRead/${instanceName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: evoKey as string,
            globalapikey: evoKey as string,
          },
          body: JSON.stringify({ readMessages: messagesToRead }),
        }).catch((err) => console.error('Failed to mark read in Evo API:', err))
      }
    }

    return new Response(JSON.stringify({ success: true, count: idsToUpdate.length }), {
      headers: corsHeaders,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})
