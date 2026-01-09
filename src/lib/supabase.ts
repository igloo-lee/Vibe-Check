
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing. Database features will not work.');
}

// Create a dummy client or handle null safely if keys are missing
// Note: createClient throws if url is empty. 
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: () => ({
            insert: () => ({ select: () => ({ single: () => ({ error: { message: 'Supabase not configured' } }) }) }),
            select: () => ({ single: () => ({ error: { message: 'Supabase not configured' } }) })
        })
    } as any;
