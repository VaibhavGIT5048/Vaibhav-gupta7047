import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className={`w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`} />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 ${
        theme === 'dark' 
          ? 'bg-gray-700 border-2 border-gray-600' 
          : 'bg-gray-200 border-2 border-gray-300'
      } ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Toggle Circle */}
      <motion.div
        layout
        className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-gray-900 text-yellow-400' 
            : 'bg-white text-gray-600'
        }`}
        animate={{
          x: theme === 'dark' ? 20 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        {theme === 'dark' ? (
          <Moon className="w-3 h-3" />
        ) : (
          <Sun className="w-3 h-3" />
        )}
      </motion.div>

      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
        <Sun className={`w-3 h-3 transition-opacity duration-300 ${
          theme === 'light' ? 'opacity-0' : 'opacity-40 text-gray-400'
        }`} />
        <Moon className={`w-3 h-3 transition-opacity duration-300 ${
          theme === 'dark' ? 'opacity-0' : 'opacity-40 text-gray-500'
        }`} />
      </div>
    </motion.button>
  );
}