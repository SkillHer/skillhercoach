
import { createClient } from '@supabase/supabase-js';

const getSupabaseClient = () => {
  try {
    // First check for manually stored credentials
    const manualUrl = localStorage.getItem('supabaseUrl');
    const manualKey = localStorage.getItem('supabaseAnonKey');
    
    if (manualUrl && manualKey) {
      console.log("✓ Creating Supabase client with manual credentials");
      return createClient(manualUrl, manualKey);
    }
    
    // Then check for credentials in window._env_ (Lovable Cloud)
    if (window && 
        (window as any)._env_ && 
        (window as any)._env_.SUPABASE_URL && 
        (window as any)._env_.SUPABASE_ANON_KEY) {
      console.log("✓ Creating Supabase client with Lovable Cloud credentials");
      return createClient(
        (window as any)._env_.SUPABASE_URL,
        (window as any)._env_.SUPABASE_ANON_KEY
      );
    }
    
    // No credentials available - return null
    console.warn("⚠️ No Supabase credentials found. Please enable Lovable Cloud or configure manually.");
    return null;
  } catch (error) {
    console.error("❌ Error creating Supabase client:", error);
    return null;
  }
};

export default getSupabaseClient;
