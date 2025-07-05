import { motion } from 'framer-motion';
import { Code2, Database, LineChart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAboutContent } from '../utils/supabaseStorage';
import { About, subscribeToTable, unsubscribeFromTable } from '../lib/supabase';

export default function Hero() {
  const [aboutContent, setAboutContent] = useState<About | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAboutContent();

    // Set up real-time subscription for about content
    const subscription = subscribeToTable('about', (payload) => {
      console.log('About content real-time update received:', payload);
      loadAboutContent(); // Reload data when changes occur
    });

    // Listen for data updates from admin panel
    const handleDataUpdate = () => {
      loadAboutContent();
    };
    
    window.addEventListener('dataUpdated', handleDataUpdate);

    return () => {
      unsubscribeFromTable(subscription);
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, []);

  const loadAboutContent = async () => {
    setIsLoading(true);
    try {
      const data = await getAboutContent();
      setAboutContent(data);
    } catch (error) {
      console.error('Error loading about content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Default content if none is loaded from database
  const defaultContent = `I'm a passionate Computer Science student deeply immersed in the realms of Data Science and AI. With a hands-on approach to technologies like Python, SQL, Tableau, and Excel, I specialize in transforming raw data into actionable, impactful insights.

Driven by insatiable curiosity and a relentless pursuit of growth, I explore the art and science of data—constantly pushing boundaries and turning complex data into meaningful stories. My work is more than just code; it's about building intelligent, dynamic solutions that pave the way for a smarter, data-driven future.

Let's harness the power of data to shape tomorrow's innovation—together.`;

  const displayContent = aboutContent?.content || defaultContent;

  // Split content into paragraphs for better rendering
  const paragraphs = displayContent.split('\n\n').filter(p => p.trim());

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 md:pt-24 lg:pt-0 bg-white dark:bg-gray-900 transition-colors duration-300" id="about">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left w-full order-1"
          >
            {/* Main Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-black dark:text-white mb-4 md:mb-6 leading-tight">
              Hello, I'm{' '}
              <span className="text-gradient block md:inline">
                Vaibhav
              </span>
            </h1>
            
            {/* Subtitle */}
            <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-medium text-secondary mb-6 md:mb-8 lg:mb-10 leading-tight">
              Data Scientist | Data Analyst 
            </h2>
            
            {/* Skills Icons */}
            <div className="flex justify-center lg:justify-start gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 rounded-xl flex items-center justify-center mb-2 md:mb-3 glass-effect-light border-2 border-black dark:border-white"> 
                  <Database className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 text-black dark:text-white" />
                </div>
                <span className="text-black dark:text-white text-xs md:text-sm lg:text-base font-semibold">Data Science</span>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 rounded-xl flex items-center justify-center mb-2 md:mb-3 glass-effect-light border-2 border-black dark:border-white">
                  <Code2 className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 text-black dark:text-white" />
                </div>
                <span className="text-black dark:text-white text-xs md:text-sm lg:text-base font-semibold">Development</span>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 rounded-xl flex items-center justify-center mb-2 md:mb-3 glass-effect-light border-2 border-black dark:border-white">
                  <LineChart className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 text-black dark:text-white" />
                </div>
                <span className="text-black dark:text-white text-xs md:text-sm lg:text-base font-semibold">Analytics</span>
              </motion.div>
            </div>
          </motion.div>

          {/* About Me Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full order-2 mt-6 lg:mt-0"
          >
            <div className="glass-effect p-4 md:p-6 lg:p-8 card-hover border-2 border-black dark:border-white"> 
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-black dark:text-white mb-4 md:mb-6">About Me</h3>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4 lg:space-y-5 text-secondary leading-relaxed">
                  {paragraphs.map((paragraph, index) => {
                    // Check if this is the last paragraph and contains "Let's harness"
                    const isCallToAction = index === paragraphs.length - 1 && paragraph.includes("Let's harness");
                    
                    return (
                      <p 
                        key={index} 
                        className={`text-sm md:text-base lg:text-lg ${
                          isCallToAction ? 'text-black dark:text-white font-bold' : ''
                        }`}
                      >
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}