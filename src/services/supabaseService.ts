
import { createClient } from '@supabase/supabase-js';

// Supabase connection details
// Replace these with your actual Supabase URL and anon key
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-anon-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data?.user;
};

// Database functions
export const fetchData = async <T>(
  tableName: string,
  options?: {
    columns?: string;
    filters?: Record<string, any>;
  }
) => {
  let query = supabase.from(tableName).select(options?.columns || '*');
  
  // Apply filters if provided
  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as T[];
};

export const insertData = async <T>(
  tableName: string,
  data: Omit<T, 'id'>
) => {
  const { data: result, error } = await supabase
    .from(tableName)
    .insert(data)
    .select();
  
  if (error) throw error;
  return result as T[];
};

export const updateData = async <T>(
  tableName: string,
  id: string | number,
  data: Partial<T>
) => {
  const { data: result, error } = await supabase
    .from(tableName)
    .update(data)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return result as T[];
};

export const deleteData = async (
  tableName: string,
  id: string | number
) => {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};
