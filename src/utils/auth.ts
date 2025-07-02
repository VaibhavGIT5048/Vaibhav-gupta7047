import { supabase, signOut } from '../lib/supabase';

// Simple authentication utility
const AUTH_KEY = 'portfolio_auth';
const SESSION_KEY = 'portfolio_session';

// Admin credentials - using your actual Supabase user email
const ADMIN_EMAIL = 'vaibhav.gupta7047@gmail.com';
const ADMIN_PASSWORD = 'Vaibhav.gupta7047';

export const authenticate = async (password: string): Promise<boolean> => {
  if (password === ADMIN_PASSWORD) {
    try {
      // Sign in with email and password instead of anonymous
      const { data, error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });
      
      if (error) {
        console.error('Supabase sign-in error:', error);
        throw new Error('Failed to establish session. Please try again.');
      }

      // Create a local session that expires in 24 hours
      const session = {
        authenticated: true,
        expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        sessionCreated: Date.now(),
        supabaseUserId: data.user?.id
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      throw new Error('Authentication failed. Please try again.');
    }
  }
  throw new Error('Invalid password');
};

export const isAuthenticated = (): boolean => {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return false;
    
    const { authenticated, expires } = JSON.parse(session);
    
    // Check if session has expired
    if (Date.now() > expires) {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
    
    return authenticated;
  } catch (error) {
    return false;
  }
};

export const isSupabaseSessionValid = async (): Promise<boolean> => {
  try {
    // Check local authentication first
    if (!isAuthenticated()) {
      return false;
    }

    // Check if we have an active Supabase session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking Supabase session:', error);
      return false;
    }

    return session !== null;
  } catch (error) {
    console.error('Error validating Supabase session:', error);
    return false;
  }
};

export const refreshSupabaseSession = async (): Promise<boolean> => {
  try {
    // Check if we have a valid local session
    if (!isAuthenticated()) {
      return false;
    }

    // Try to refresh the Supabase session
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Error refreshing Supabase session:', error);
      // If refresh fails, try to re-authenticate with credentials
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });
      
      if (authError) {
        console.error('Error re-authenticating:', authError);
        return false;
      }

      // Update local session with new user ID
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const sessionData = JSON.parse(session);
        sessionData.sessionCreated = Date.now();
        sessionData.supabaseUserId = authData.user?.id;
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      }
      
      return true;
    }

    // Update the local session timestamp
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const sessionData = JSON.parse(session);
      sessionData.sessionCreated = Date.now();
      sessionData.supabaseUserId = data.user?.id;
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    }
    
    return true;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return false;
  }
};

export const logout = async (): Promise<void> => {
  try {
    // Sign out from Supabase
    await signOut();
    
    // Clear local session
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear local session even if Supabase signout fails
    localStorage.removeItem(SESSION_KEY);
  }
};

export const extendSession = (): void => {
  if (isAuthenticated()) {
    const currentSession = localStorage.getItem(SESSION_KEY);
    let supabaseUserId = null;
    
    if (currentSession) {
      try {
        const sessionData = JSON.parse(currentSession);
        supabaseUserId = sessionData.supabaseUserId;
      } catch (error) {
        console.error('Error parsing current session:', error);
      }
    }

    const session = {
      authenticated: true,
      expires: Date.now() + (24 * 60 * 60 * 1000), // Extend by 24 hours
      sessionCreated: Date.now(),
      supabaseUserId
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
};

// Get the admin password for display purposes (in development)
export const getAdminPassword = (): string => {
  return ADMIN_PASSWORD;
};

// Get the admin email for reference
export const getAdminEmail = (): string => {
  return ADMIN_EMAIL;
};