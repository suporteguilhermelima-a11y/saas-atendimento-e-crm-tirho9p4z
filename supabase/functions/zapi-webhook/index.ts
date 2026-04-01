import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const body = await req.json();

  console.log("Webhook recebido:", body);

  const telefone = body.phone;
  const mensagem = body.text?.message;

  // salvar no banco
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  await fetch(`${SUPABASE_URL}/rest/v1/mensagens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    },
    body: JSON.stringify({
      telefone,
      mensagem
    })
  });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
});