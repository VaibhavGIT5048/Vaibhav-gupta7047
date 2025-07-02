import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getSkills } from '../utils/supabaseStorage';
import { Skill } from '../lib/supabase';
import { subscribeToTable, unsubscribeFromTable } from '../lib/supabase';

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSkills();

    // Set up real-time subscription
    const subscription = subscribeToTable('skills', (payload) => {
      console.log('Skills real-time update received:', payload);
      loadSkills(); // Reload data when changes occur
    });

    // Listen for data updates from admin panel
    const handleDataUpdate = () => {
      loadSkills();
    };
    
    window.addEventListener('dataUpdated', handleDataUpdate);

    return () => {
      unsubscribeFromTable(subscription);
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, []);

  const loadSkills = async () => {
    setIsLoading(true);
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (error) {
      console.error('Error loading skills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const technicalSkills = skills.filter(skill => skill.type === 'technical');
  const softSkills = skills.filter(skill => skill.type === 'soft');

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-soft-gray" id="skills">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary">Loading skills...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-soft-gray" id="skills">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-black mb-8 sm:mb-12 lg:mb-16">Skills</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Technical Skills */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-6 sm:mb-8">Technical Skills</h3>
            <div className="space-y-4 sm:space-y-6">
              {technicalSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-black text-sm sm:text-base font-bold">{skill.name}</span>
                    <span className="text-black text-sm sm:text-base font-bold">{skill.level}%</span>
                  </div>
                  <div className="progress-bar h-3 sm:h-4">
                    <motion.div
                      className="progress-fill h-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Soft Skills */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-6 sm:mb-8">Soft Skills</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {softSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-effect p-3 sm:p-4 hover:border-black transition-all duration-300 card-hover border-2 border-light"
                >
                  <span className="text-black text-sm sm:text-base font-bold">{skill.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {skills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary mb-4">No skills added yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}