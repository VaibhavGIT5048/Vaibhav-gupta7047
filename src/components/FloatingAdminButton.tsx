import { useState, useEffect } from 'react';
import { isAuthenticated } from '../utils/auth';
import AdminPanel from './AdminPanel';
import AuthModal from './AuthModal';

interface FloatingAdminButtonProps {
  onAdminClick: () => void;
}

export default function FloatingAdminButton({ onAdminClick }: FloatingAdminButtonProps) {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setAuthenticated(isAuthenticated());
    };
    
    checkAuth();
    
    // Listen for auth updates
    const handleAuthUpdate = () => {
      checkAuth();
    };
    
    window.addEventListener('authUpdated', handleAuthUpdate);
    
    return () => {
      window.removeEventListener('authUpdated', handleAuthUpdate);
    };
  }, []);

  const handleAuthSuccess = () => {
    setAuthenticated(true);
    setShowAdminPanel(true);
    // Dispatch auth update event
    window.dispatchEvent(new Event('authUpdated'));
  };

  const handleAdminAccess = () => {
    if (authenticated) {
      setShowAdminPanel(true);
    } else {
      setShowAuth(true);
    }
  };

  // Expose the admin access function to parent
  useEffect(() => {
    onAdminClick = handleAdminAccess;
  }, [authenticated]);

  const handleDataUpdate = () => {
    // Trigger custom events for all components to update
    window.dispatchEvent(new Event('resumeUpdated'));
    window.dispatchEvent(new Event('dataUpdated'));
  };

  return (
    <>
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onAuthenticate={handleAuthSuccess}
      />

      {/* Admin Panel */}
      {authenticated && (
        <AdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
          onDataUpdate={handleDataUpdate}
        />
      )}
    </>
  );
}