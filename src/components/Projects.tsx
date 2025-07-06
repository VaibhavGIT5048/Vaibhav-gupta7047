import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Project } from '../lib/supabase';
import { getProjects } from '../utils/supabaseStorage';
import { subscribeToTable, unsubscribeFromTable } from '../lib/supabase';

const PROJECT_CATEGORIES = [
  'All',
  'AI/ML',
  'Data Science & Analysis', 
  'Case Studies',
  'Web Development',
  'Other'
] as const;

type ProjectCategory = typeof PROJECT_CATEGORIES[number];

export default function Projects() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [showFilters, setShowFilters] = useState(false);

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

  // Filter projects based on selected category
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  // Show featured projects first, then others
  const featuredProjects = filteredProjects.filter(project => project.featured);
  const regularProjects = filteredProjects.filter(project => !project.featured);
  const displayProjects = [...featuredProjects, ...regularProjects];

  // Get available categories from projects
  const availableCategories = PROJECT_CATEGORIES.filter(category => {
    if (category === 'All') return true;
    return projects.some(project => project.category === category);
  });

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900 transition-colors duration-300" id="projects">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900 transition-colors duration-300" id="projects">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12 lg:mb-16"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
              Featured Projects
            </h2>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden btn-secondary flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm w-fit"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Category Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {availableCategories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 border-2 ${
                    selectedCategory === category
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'bg-white dark:bg-gray-900 text-black dark:text-white border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black'
                  }`}
                >
                  {category}
                  {category !== 'All' && (
                    <span className="ml-2 text-xs opacity-75">
                      ({projects.filter(p => p.category === category).length})
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        <div ref={ref} className="space-y-6 max-w-4xl mx-auto">
          {displayProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-effect p-4 sm:p-6 hover:border-black dark:hover:border-white transition-all duration-300 card-hover border-2 border-light dark:border-gray-700"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white">
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.featured && (
                        <span className="featured-badge text-xs px-3 py-1 rounded-full w-fit font-bold">
                          Featured
                        </span>
                      )}
                      <span className="text-xs px-3 py-1 rounded-full bg-light-gray dark:bg-gray-700 text-black dark:text-white border border-black dark:border-white font-semibold">
                        {project.category}
                      </span>
                    </div>
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
            <p className="text-secondary mb-4">
              {selectedCategory === 'All' 
                ? 'No projects to display yet.' 
                : `No projects found in "${selectedCategory}" category.`
              }
            </p>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="btn-secondary px-4 py-2 rounded-lg text-sm"
              >
                View All Projects
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}