import { createClient } from "@supabase/supabase-js";

/* ============================================================
   COLLEGAMENTO AL DATABASE (Supabase)
   L'URL del progetto è già inserito.
   Resta solo da incollare la CHIAVE PUBBLICA (anon public / publishable)
   tra le virgolette qui sotto. È pubblica: sta nel sito ed è protetta
   dalle regole di sicurezza (RLS) del database.
   NON usare mai la chiave service_role / secret.
   ============================================================ */

const SUPABASE_URL = "https://pohaerctuqihkaiclewa.supabase.co";
const SUPABASE_ANON_KEY = "INCOLLA_QUI_LA_CHIAVE_ANON_PUBLIC";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
