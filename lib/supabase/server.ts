import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente Supabase exclusivo do servidor (usado só em rotas de API).
// Preferência: SUPABASE_SERVICE_ROLE_KEY — sem prefixo NEXT_PUBLIC_, nunca
// enviada ao browser — que permite manter a tabela `leads` com RLS fechado
// para o papel anon. Enquanto ela não estiver configurada, cai na chave anon
// para não interromper o funil atual (nesse caso o RLS precisa permitir o
// que a rota faz — ver o relatório da Etapa 0).
let client: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return client;
}
