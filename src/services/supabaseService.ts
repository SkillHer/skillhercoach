import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/sonner';

// Supabase connection details
// Replace these with your actual Supabase URL and anon key
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-anon-key';

// Create a single supabase client for interacting with your database
let supabase;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("Supabase client initialized successfully");
} catch (error) {
  console.error("Error initializing Supabase client:", error);
  toast.error("Failed to connect to Supabase. Check your credentials.");
}

export { supabase };

// Helper function to handle Supabase errors consistently
const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Supabase ${operation} error:`, error);
  
  // Check for common error types
  if (error?.message?.includes('JWT')) {
    toast.error("Authentication error. Please log in again.");
  } else if (error?.message?.includes('network')) {
    toast.error("Network error. Please check your connection.");
  } else if (error?.code === '22P02') {
    toast.error("Invalid parameter format in database query.");
  } else if (error?.code === '23505') {
    toast.error("Duplicate entry error.");
  } else {
    toast.error(`Error during ${operation}. Please try again.`);
  }
  
  throw error;
};

// Auth functions
export const signInWithEmail = async (email: string, password: string) => {
  try {
    console.log("Attempting to sign in with email:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) return handleSupabaseError(error, "sign in");
    console.log("Sign in successful");
    toast.success("Signed in successfully!");
    return data;
  } catch (error) {
    return handleSupabaseError(error, "sign in");
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    console.log("Attempting to sign up with email:", email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) return handleSupabaseError(error, "sign up");
    console.log("Sign up successful");
    toast.success("Account created successfully!");
    return data;
  } catch (error) {
    return handleSupabaseError(error, "sign up");
  }
};

export const signOut = async () => {
  try {
    console.log("Attempting to sign out");
    const { error } = await supabase.auth.signOut();
    if (error) return handleSupabaseError(error, "sign out");
    console.log("Sign out successful");
    toast.success("Signed out successfully!");
  } catch (error) {
    return handleSupabaseError(error, "sign out");
  }
};

export const getCurrentUser = async () => {
  try {
    console.log("Fetching current user");
    const { data, error } = await supabase.auth.getUser();
    if (error) return handleSupabaseError(error, "get current user");
    console.log("Got current user:", data?.user?.id);
    return data?.user;
  } catch (error) {
    return handleSupabaseError(error, "get current user");
  }
};

// Database functions
export const fetchData = async <T>(
  tableName: string,
  options?: {
    columns?: string;
    filters?: Record<string, any>;
  }
) => {
  try {
    console.log(`Fetching data from ${tableName} table`, options);
    let query = supabase.from(tableName).select(options?.columns || '*');
    
    // Apply filters if provided
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    const { data, error } = await query;
    if (error) return handleSupabaseError(error, `fetch from ${tableName}`);
    console.log(`Successfully fetched ${data?.length} records from ${tableName}`);
    return data as T[];
  } catch (error) {
    return handleSupabaseError(error, `fetch from ${tableName}`);
  }
};

export const insertData = async <T>(
  tableName: string,
  data: Omit<T, 'id'>
) => {
  try {
    console.log(`Inserting data into ${tableName} table`, data);
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(data)
      .select();
    
    if (error) return handleSupabaseError(error, `insert into ${tableName}`);
    console.log(`Data inserted successfully into ${tableName}`);
    return result as T[];
  } catch (error) {
    return handleSupabaseError(error, `insert into ${tableName}`);
  }
};

export const updateData = async <T>(
  tableName: string,
  id: string | number,
  data: Partial<T>
) => {
  try {
    console.log(`Updating data in ${tableName} table for id ${id}`, data);
    const { data: result, error } = await supabase
      .from(tableName)
      .update(data)
      .eq('id', id)
      .select();
    
    if (error) return handleSupabaseError(error, `update in ${tableName}`);
    console.log(`Data updated successfully in ${tableName}`);
    return result as T[];
  } catch (error) {
    return handleSupabaseError(error, `update in ${tableName}`);
  }
};

export const deleteData = async (
  tableName: string,
  id: string | number
) => {
  try {
    console.log(`Deleting data from ${tableName} table for id ${id}`);
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    if (error) return handleSupabaseError(error, `delete from ${tableName}`);
    console.log(`Data deleted successfully from ${tableName}`);
    return true;
  } catch (error) {
    return handleSupabaseError(error, `delete from ${tableName}`);
  }
};

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    console.log("Testing Supabase connection...");
    const { data, error } = await supabase.from('_dummy_query').select('*').limit(1);
    
    if (error && !error.message.includes('relation "_dummy_query" does not exist')) {
      // If we get an error that's not about the non-existent table, there's a connection issue
      console.error("Supabase connection test failed:", error);
      toast.error("Failed to connect to Supabase. Please check your credentials and network.");
      return false;
    }
    
    // If we got a "table doesn't exist" error, the connection works!
    console.log("Supabase connection test successful!");
    toast.success("Successfully connected to Supabase!");
    return true;
  } catch (error) {
    console.error("Supabase connection test exception:", error);
    toast.error("Failed to connect to Supabase. Check the console for details.");
    return false;
  }
};
