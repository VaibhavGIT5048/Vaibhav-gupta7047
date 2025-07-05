import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Download, Menu, X, Settings } from 'lucide-react';
import { getActiveResume } from '../utils/supabaseStorage';
import { ResumeFile } from '../lib/supabase';
import { subscribeToTable, unsubscribeFromTable } from '../lib/supabase';
import { isAuthenticated } from '../utils/auth';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  onAdminClick?: () => void;
}

export default function Navbar({ onAdminClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [resumeFile, setResumeFile] = useState<ResumeFile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const loadResumeFile = async () => {
      try {
        const activeResume = await getActiveResume();
        setResumeFile(activeResume);
      } catch (error) {
        console.error('Error loading resume:', error);
      }
    };

    const checkAuth = () => {
      setAuthenticated(isAuthenticated());
    };

    window.addEventListener('scroll', handleScroll);
    loadResumeFile();
    checkAuth();

    const handleResumeUpdate = () => {
      loadResumeFile();
    };

    const handleAuthUpdate = () => {
      checkAuth();
    };

    window.addEventListener('resumeUpdated', handleResumeUpdate);
    window.addEventListener('authUpdated', handleAuthUpdate);

    const subscription = subscribeToTable('resume_files', (payload) => {
      console.log('Resume real-time update received:', payload);
      loadResumeFile();
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resumeUpdated', handleResumeUpdate);
      window.removeEventListener('authUpdated', handleAuthUpdate);
      unsubscribeFromTable(subscription);
    };
  }, []);

  const navItems = ['About', 'Experience', 'Skills', 'Projects'];

  const handleNavClick = (item: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(item.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminAccess = () => {
    setMobileMenuOpen(false);
    if (onAdminClick) {
      onAdminClick();
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b-2 border-black dark:border-white'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              className="text-lg sm:text-xl lg:text-2xl font-bold text-black dark:text-white truncate flex-shrink-0"
            >
              Vaibhav Gupta
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center h-full space-x-6 xl:space-x-8">
              {navItems.map((item) => (
                <motion.button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  whileHover={{ scale: 1.05 }}
                  className="text-black dark:text-white hover:text-secondary dark:hover:text-gray-300 transition-colors text-sm xl:text-base font-semibold border-b-2 border-transparent hover:border-black dark:hover:border-white pb-1"
                >
                  {item}
                </motion.button>
              ))}

              {resumeFile && (
                <motion.a
                  href={resumeFile.file_url}
                  download={resumeFile.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 text-black dark:text-white hover:text-secondary dark:hover:text-gray-300 transition-colors text-sm xl:text-base font-semibold border-b-2 border-transparent hover:border-black dark:hover:border-white pb-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Resume</span>
                </motion.a>
              )}

              {/* Theme Toggle */}
              <ThemeToggle />

              <motion.button
                onClick={handleAdminAccess}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-black dark:text-white hover:text-secondary dark:hover:text-gray-300 transition-colors text-sm xl:text-base font-semibold border-b-2 border-transparent hover:border-black dark:hover:border-white pb-1"
              >
                <Settings className="w-4 h-4" />
                <span>Admin Panel</span>
                {authenticated && (
                  <span className="text-xs px-2 py-1 rounded-full text-white bg-black dark:bg-white dark:text-black border-2 border-black dark:border-white">
                    Active
                  </span>
                )}
              </motion.button>
            </div>

            {/* Mobile Controls */}
            <div className="xl:hidden flex items-center gap-3">
              {/* Mobile Theme Toggle */}
              <ThemeToggle />
              
              {/* Mobile Hamburger */}
              <div className="navbar-mobile-section">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="mobile-menu-button"
                  aria-label="Toggle mobile menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mobile-menu-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={`mobile-menu-container ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-panel h-full flex flex-col bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b-2 border-black dark:border-white">
            <h2 className="text-lg font-bold text-black dark:text-white">Navigation</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-black dark:text-white hover:text-secondary dark:hover:text-gray-300 transition-colors p-1"
              aria-label="Close mobile menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 py-4 sm:py-6">
            {navItems.map((item, index) => (
              <motion.button
                key={item}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleNavClick(item)}
                className="block w-full text-left px-4 sm:px-6 py-4 text-black dark:text-white hover:text-secondary dark:hover:text-gray-300 hover:bg-light-gray dark:hover:bg-gray-800 transition-colors text-base font-semibold border-b border-light dark:border-gray-700"
              >
                {item}
              </motion.button>
            ))}

            {resumeFile && (
              <motion.a
                href={resumeFile.file_url}
                download={resumeFile.filename}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="block w-full text-left px-4 sm:px-6 py-4 text-black dark:text-white hover:text-secondary dark:hover:text-gray-300 hover:bg-light-gray dark:hover:bg-gray-800 transition-colors text-base font-semibold border-b border-light dark:border-gray-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Resume
              </motion.a>
            )}

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navItems.length * 0.1 }}
              onClick={handleAdminAccess}
              className="block w-full text-left px-4 sm:px-6 py-4 text-black dark:text-white hover:text-secondary dark:hover:text-gray-300 hover:bg-light-gray dark:hover:bg-gray-800 transition-colors text-base border-t-2 border-black dark:border-white mt-4 font-semibold"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span>Admin Panel</span>
                {authenticated && (
                  <span className="text-xs px-2 py-1 rounded-full text-white bg-black dark:bg-white dark:text-black border-2 border-black dark:border-white">
                    Active
                  </span>
                )}
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}