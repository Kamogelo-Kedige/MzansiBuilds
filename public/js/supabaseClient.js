const SUPABASE_URL = "https://wnzbbkykjbutxyuvoswa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_2U-7mrM_tgQTuK605Iopbg_Qcqzfad8";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);

// Expose the client globally for other scripts to use
window.supabaseClient = supabaseClient;
