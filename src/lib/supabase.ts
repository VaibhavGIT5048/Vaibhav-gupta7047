import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database types
export interface Experience {
  id: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  description: string;
  type: 'professional' | 'leadership';
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  type: 'technical' | 'soft';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  github_url: string;
  live_url?: string;
  tech: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResumeFile {
  id: string;
  filename: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  is_active: boolean;
  user_id: string; // Added user_id for proper RLS
  created_at: string;
  updated_at: string;
}

export interface About {
  id: string;
  content: string;
  updated_at: string;
}

// Real-time subscription helpers
export const subscribeToTable = (
  table: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`public:${table}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      callback
    )
    .subscribe();
};

export const unsubscribeFromTable = (subscription: any) => {
  if (subscription) {
    supabase.removeChannel(subscription);
  }
};

// Authentication helpers
export const signInAnonymously = async () => {
  // For portfolio admin access, we'll create a simple anonymous session
  // This is a workaround since you're using password-based auth
  const { data, error } = await supabase.auth.signInAnonymously();
  
  if (error) {
    console.error('Anonymous sign in error:', error);
    throw error;
  }
  
  return data;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Get user error:', error);
    return null;
  }
  
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};