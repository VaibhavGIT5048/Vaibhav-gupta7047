import { supabase, ThemePreference } from '../lib/supabase';

// Generate a unique session ID for anonymous users
const generateSessionId = (): string => {
  const stored = localStorage.getItem('portfolio_session_id');
  if (stored) return stored;
  
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  localStorage.setItem('portfolio_session_id', sessionId);
  return sessionId;
};

// Get current session ID
export const getSessionId = (): string => {
  return generateSessionId();
};

// Get theme preference from Supabase
export const getThemePreference = async (): Promise<'light' | 'dark'> => {
  try {
    const sessionId = getSessionId();
    
    const { data, error } = await supabase
      .from('theme_preferences')
      .select('theme')
      .eq('user_session', sessionId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching theme preference:', error);
      return 'light'; // Default fallback
    }
    
    return data?.theme || 'light';
  } catch (error) {
    console.error('Error in getThemePreference:', error);
    return 'light';
  }
};

// Save theme preference to Supabase
export const saveThemePreference = async (theme: 'light' | 'dark'): Promise<boolean> => {
  try {
    const sessionId = getSessionId();
    
    // Try to update existing preference first
    const { data: existing } = await supabase
      .from('theme_preferences')
      .select('id')
      .eq('user_session', sessionId)
      .maybeSingle();
    
    if (existing) {
      // Update existing preference
      const { error } = await supabase
        .from('theme_preferences')
        .update({ theme })
        .eq('user_session', sessionId);
      
      if (error) {
        console.error('Error updating theme preference:', error);
        return false;
      }
    } else {
      // Create new preference
      const { error } = await supabase
        .from('theme_preferences')
        .insert([{ user_session: sessionId, theme }]);
      
      if (error) {
        console.error('Error creating theme preference:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveThemePreference:', error);
    return false;
  }
};

// Subscribe to theme changes for real-time updates across tabs
export const subscribeToThemeChanges = (callback: (theme: 'light' | 'dark') => void) => {
  const sessionId = getSessionId();
  
  return supabase
    .channel('theme_preferences_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'theme_preferences',
        filter: `user_session=eq.${sessionId}`
      },
      (payload) => {
        if (payload.new && 'theme' in payload.new) {
          callback(payload.new.theme as 'light' | 'dark');
        }
      }
    )
    .subscribe();
};

// Unsubscribe from theme changes
export const unsubscribeFromThemeChanges = (subscription: any) => {
  if (subscription) {
    supabase.removeChannel(subscription);
  }
};