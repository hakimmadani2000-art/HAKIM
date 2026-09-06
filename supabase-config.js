/**
 * Supabase Configuration — LOCAL STORAGE MODE
 *
 * The database and Supabase API are NOT connected yet. This portal currently
 * runs entirely on browser localStorage so every feature works instantly with
 * no backend, no internet connection, and no loading delays.
 *
 * To connect Supabase later:
 *   1. Uncomment the two constants below with your project URL + anon key.
 *   2. Remove the CDN script tag is already-not-needed advice (see each page).
 *   3. The rest of the app already routes through getSupabaseClient() with
 *      graceful localStorage fallbacks, so it will sync automatically.
 */

// --- WHEN READY TO GO LIVE, uncomment these and comment out the shim below ---
// const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
// const SUPABASE_ANON_KEY = "YOUR-ANON-KEY";

// Local-storage-first shim: returns null so all existing `if (client)`
// guards skip Supabase and the app simply keeps working on localStorage.
window.getSupabaseClient = function () {
  return null;
};
