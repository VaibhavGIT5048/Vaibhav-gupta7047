import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';

export default function Contact() {
  const handleContactClick = () => {
    window.location.href = 'mailto:vwork825@gmail.com';
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-soft-gray dark:bg-gray-800 transition-colors duration-300" id="contact">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-8 sm:mb-12 lg:mb-16">
            Contact
          </h2>

          {/* Contact Information */}
          <div className="glass-effect p-6 sm:p-8 mb-8 card-hover border-2 border-black dark:border-white">
            
            <div className="space-y-6 mb-8">
              <div className="flex items-center justify-center text-secondary">
                <MapPin className="w-5 h-5 mr-3 text-black dark:text-white flex-shrink-0" />
                <span className="text-sm sm:text-base font-semibold">Dwarka, New Delhi, India</span>
              </div>
              
              <div className="flex items-center justify-center text-secondary">
                <Mail className="w-5 h-5 mr-3 text-black dark:text-white flex-shrink-0" />
                <span className="text-sm sm:text-base font-semibold">vwork825@gmail.com</span>
              </div>
            </div>
            
            <div className="flex justify-center space-x-6 mb-8">
              <motion.a
                href="https://github.com/VaibhavGIT5048"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="social-icon w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300"
              >
                <Github className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/vaibhav-gupta-4a11b0288/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="social-icon w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300"
              >
                <Linkedin className="w-6 h-6" />
              </motion.a>
            </div>

            {/* Contact Me Button */}
            <motion.button
              onClick={handleContactClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-bold text-sm sm:text-base"
            >
              <Mail className="w-4 h-4" />
              Contact Me
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}