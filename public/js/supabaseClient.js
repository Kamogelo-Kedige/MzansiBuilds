// Read values from app-config.js.
var config = window.APP_CONFIG || {};
var supabaseUrl = config.SUPABASE_URL;
var supabasePublishableKey = config.SUPABASE_PUBLISHABLE_KEY;

// Fail when setup is missing.
if (!window.supabase) {
  throw new Error("Load Supabase dependencies first.");
}

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY.");
}

// Create one shared Supabase client for all other files.
window.supabaseClient = window.supabase.createClient(
  supabaseUrl,
  supabasePublishableKey,
);
