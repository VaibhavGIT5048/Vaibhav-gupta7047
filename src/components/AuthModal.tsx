import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Eye, EyeOff } from 'lucide-react';
import { authenticate } from '../utils/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: () => void;
}

export default function AuthModal({ isOpen, onClose, onAuthenticate }: AuthModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      await authenticate(password);
      setPassword('');
      onAuthenticate();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid password. Access denied.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="rounded-lg w-full max-w-md mx-4 overflow-hidden border-2 border-black bg-white"
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b-2 border-black">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center glass-effect-light border-2 border-black">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-black">Authentication Required</h2>
              <p className="text-xs sm:text-sm text-secondary">Enter password to access project manager</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-black hover:text-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="mb-6">
            <label className="block text-sm font-bold text-black mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black pr-12 text-sm sm:text-base border-2 border-black glass-effect"
                placeholder="Enter your password"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-secondary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 rounded-lg border-2 border-red-500 bg-red-50"
              >
                <p className="text-red-600 text-sm font-semibold">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="btn-primary flex-1 px-4 py-3 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Access Manager'
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary px-4 py-3 text-black rounded-lg transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="rounded-lg p-3 sm:p-4 border-2 border-black glass-effect">
            <p className="text-xs text-secondary leading-relaxed">
              <strong className="text-black">Security Note:</strong> This authentication protects your project manager from unauthorized access. If you're experiencing session issues, try re-authenticating to refresh your access.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}