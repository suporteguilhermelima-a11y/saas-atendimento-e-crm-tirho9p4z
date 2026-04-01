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

    const { deal_id, text } = await req.json()

    const { data: deal } = await supabase.from('deals').select('phone').eq('id', deal_id).single()
    
    if (deal && deal.phone) {
      const evoUrl = Deno.env.get('EVOLUTION_API_URL')
      const evoKey = Deno.env.get('EVOLUTION_API_KEY')
      const instanceName = Deno.env.get('EVOLUTION_INSTANCE_NAME') || 'crm'

      if (evoUrl && evoKey) {
        await fetch(`${evoUrl}/message/sendText/${instanceName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': evoKey
          },
          body: JSON.stringify({
            number: deal.phone,
            text: text
          })
        })
      } else {
        console.warn('EVOLUTION_API variables are not set. Message saved but not sent.')
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
