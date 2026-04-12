// Read values from app-config.js.
var config = window.APP_CONFIG || {};
var supabaseUrl = config.SUPABASE_URL;
var supabasePublishableKey = config.SUPABASE_PUBLISHABLE_KEY;

// Skip initialization when the Supabase library or credentials are not available.
if (!window.supabase || !supabaseUrl || !supabasePublishableKey) {
  window.supabaseClient = null;
} else {
  // Create one shared Supabase client for all other files.
  window.supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabasePublishableKey,
  );
}
