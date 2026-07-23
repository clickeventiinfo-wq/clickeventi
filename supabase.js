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
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvaGFlcmN0dXFpaGthaWNsZXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjA3ODQsImV4cCI6MjEwMDM5Njc4NH0.X3m4fDDasb61aK2LukBpBzUoxkxDOwnzTnJZLMXgz5Q";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
