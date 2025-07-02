import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Project } from '../lib/supabase';
import { getProjects } from '../utils/supabaseStorage';
import { subscribeToTable, unsubscribeFromTable } from '../lib/supabase';

export default function Projects() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();

    // Set up real-time subscription
    const subscription = subscribeToTable('projects', (payload) => {
      console.log('Projects real-time update received:', payload);
      loadProjects(); // Reload data when changes occur
    });

    // Listen for data updates from admin panel
    const handleDataUpdate = () => {
      loadProjects();
    };
    
    window.addEventListener('dataUpdated', handleDataUpdate);

    return () => {
      unsubscribeFromTable(subscription);
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const featuredProjects = projects.filter(project => project.featured);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 6);

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white" id="projects">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white" id="projects">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-black mb-8 sm:mb-12 lg:mb-16"
        >
          Featured Projects
        </motion.h2>

        <div ref={ref} className="space-y-6 max-w-4xl mx-auto">
          {displayProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-effect p-4 sm:p-6 hover:border-black transition-all duration-300 card-hover border-2 border-light"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-black">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="featured-badge text-xs px-3 py-1 rounded-full w-fit font-bold">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-secondary mb-4 leading-relaxed text-sm sm:text-base">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <motion.span
                        key={techIndex}
                        whileHover={{ scale: 1.05 }}
                        className="tag px-2 sm:px-3 py-1 text-xs sm:text-sm"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                {project.github_url && (
                  <motion.a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm w-full sm:w-auto justify-center sm:justify-start"
                  >
                    <Github className="w-4 h-4" />
                    View Code
                  </motion.a>
                )}
                
                {project.live_url && (
                  <motion.a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all duration-300 text-sm w-full sm:w-auto justify-center sm:justify-start"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {displayProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary mb-4">No projects to display yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}