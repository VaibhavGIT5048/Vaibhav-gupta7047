import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Competitions from './components/Competitions';
import Contact from './components/Contact';
import FloatingAdminButton from './components/FloatingAdminButton';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import { ThemeProvider } from './contexts/ThemeContext';
import { isAuthenticated } from './utils/auth';

function App() {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setAuthenticated(true);
    setShowAdminPanel(true);
    // Dispatch auth update event
    window.dispatchEvent(new Event('authUpdated'));
  };

  const handleAdminClick = () => {
    if (isAuthenticated()) {
      setShowAdminPanel(true);
    } else {
      setShowAuth(true);
    }
  };

  const handleDataUpdate = () => {
    // Trigger custom events for all components to update
    window.dispatchEvent(new Event('resumeUpdated'));
    window.dispatchEvent(new Event('dataUpdated'));
  };

  return (
    <ThemeProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300"
      >
        <Navbar onAdminClick={handleAdminClick} />
        <Hero />
        <Experience />
        <Skills />
        <Projects />
        <Competitions />
        <Contact />
        
        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          onAuthenticate={handleAuthSuccess}
        />

        {/* Admin Panel */}
        {(authenticated || isAuthenticated()) && (
          <AdminPanel
            isOpen={showAdminPanel}
            onClose={() => setShowAdminPanel(false)}
            onDataUpdate={handleDataUpdate}
          />
        )}
      </motion.div>
    </ThemeProvider>
  );
}

export default App;