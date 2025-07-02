import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getExperiences } from '../utils/supabaseStorage';
import { Experience as ExperienceType } from '../lib/supabase';
import { subscribeToTable, unsubscribeFromTable } from '../lib/supabase';

export default function Experience() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExperiences();

    // Set up real-time subscription
    const subscription = subscribeToTable('experiences', (payload) => {
      console.log('Real-time update received:', payload);
      loadExperiences(); // Reload data when changes occur
    });

    // Listen for data updates from admin panel
    const handleDataUpdate = () => {
      loadExperiences();
    };
    
    window.addEventListener('dataUpdated', handleDataUpdate);

    return () => {
      unsubscribeFromTable(subscription);
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, []);

  const loadExperiences = async () => {
    setIsLoading(true);
    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch (error) {
      console.error('Error loading experiences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const professionalExperiences = experiences.filter(exp => exp.type === 'professional');
  const leadershipExperiences = experiences.filter(exp => exp.type === 'leadership');

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white" id="experience">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary">Loading experiences...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white" id="experience">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-black mb-8 sm:mb-12 lg:mb-16"
        >
          Experience
        </motion.h2>

        <div ref={ref} className="max-w-4xl mx-auto">
          {/* Professional Experience */}
          {professionalExperiences.length > 0 && (
            <div className="mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-6 sm:mb-8">Professional Experience</h3>
              <div className="space-y-4 sm:space-y-6">
                {professionalExperiences.map((experience, index) => (
                  <motion.div
                    key={experience.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="glass-effect p-4 sm:p-6 hover:border-black transition-all duration-300 card-hover border-2 border-light"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-3">
                      <div className="flex-1">
                        <h4 className="text-lg sm:text-xl font-bold text-black mb-2">
                          {experience.role}
                        </h4>
                        <p className="text-black font-semibold mb-2">
                          {experience.organization}
                        </p>
                      </div>
                      <div className="flex flex-col lg:items-end text-sm text-secondary gap-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0 text-black" />
                          <span className="break-words font-medium">{experience.period}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0 text-black" />
                          <span className="break-words font-medium">{experience.location}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-secondary leading-relaxed text-sm sm:text-base">
                      {experience.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Leadership Experience */}
          {leadershipExperiences.length > 0 && (
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-6 sm:mb-8">Leadership & Extracurricular</h3>
              <div className="space-y-4 sm:space-y-6">
                {leadershipExperiences.map((experience, index) => (
                  <motion.div
                    key={experience.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: (professionalExperiences.length + index) * 0.1 }}
                    className="glass-effect p-4 sm:p-6 hover:border-black transition-all duration-300 card-hover border-2 border-light"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-3">
                      <div className="flex-1">
                        <h4 className="text-lg sm:text-xl font-bold text-black mb-2">
                          {experience.role}
                        </h4>
                        <p className="text-black font-semibold mb-2">
                          {experience.organization}
                        </p>
                      </div>
                      <div className="flex flex-col lg:items-end text-sm text-secondary gap-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0 text-black" />
                          <span className="break-words font-medium">{experience.period}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0 text-black" />
                          <span className="break-words font-medium">{experience.location}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-secondary leading-relaxed text-sm sm:text-base">
                      {experience.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {experiences.length === 0 && (
            <div className="text-center py-12">
              <p className="text-secondary mb-4">No experience entries yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}