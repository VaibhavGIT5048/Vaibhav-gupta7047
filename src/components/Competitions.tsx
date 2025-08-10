import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Trophy, Calendar, MapPin, Users, ExternalLink, Award, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Competition } from '../lib/supabase';
import { getCompetitions } from '../utils/supabaseStorage';
import { subscribeToTable, unsubscribeFromTable } from '../lib/supabase';

const EVENT_TYPES = ['All', 'Hackathon', 'Competition'] as const;
type EventType = typeof EVENT_TYPES[number];

export default function Competitions() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<EventType>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadCompetitions();

    // Set up real-time subscription
    const subscription = subscribeToTable('competitions', (payload) => {
      console.log('Competitions real-time update received:', payload);
      loadCompetitions();
    });

    // Listen for data updates from admin panel
    const handleDataUpdate = () => {
      loadCompetitions();
    };
    
    window.addEventListener('dataUpdated', handleDataUpdate);

    return () => {
      unsubscribeFromTable(subscription);
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, []);

  const loadCompetitions = async () => {
    setIsLoading(true);
    try {
      const data = await getCompetitions();
      setCompetitions(data);
    } catch (error) {
      console.error('Error loading competitions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter competitions based on selected type
  const filteredCompetitions = selectedType === 'All' 
    ? competitions 
    : competitions.filter(comp => comp.event_type === selectedType.toLowerCase());

  // Show featured competitions first, then others
  const featuredCompetitions = filteredCompetitions.filter(comp => comp.featured);
  const regularCompetitions = filteredCompetitions.filter(comp => !comp.featured);
  const displayCompetitions = [...featuredCompetitions, ...regularCompetitions];

  // Get available types from competitions
  const availableTypes = EVENT_TYPES.filter(type => {
    if (type === 'All') return true;
    return competitions.some(comp => comp.event_type === type.toLowerCase());
  });

  const getStandingColor = (standing: string) => {
    const lowerStanding = standing.toLowerCase();
    if (lowerStanding.includes('1st') || lowerStanding.includes('winner') || lowerStanding.includes('first')) {
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700';
    }
    if (lowerStanding.includes('2nd') || lowerStanding.includes('second')) {
      return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600';
    }
    if (lowerStanding.includes('3rd') || lowerStanding.includes('third')) {
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700';
    }
    return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700';
  };

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-soft-gray dark:bg-gray-800 transition-colors duration-300" id="competitions">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary">Loading competitions...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 sm:py-16 lg:py-20 bg-soft-gray dark:bg-gray-800 transition-colors duration-300" id="competitions">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-12 lg:mb-16"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white flex items-center gap-3">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10" />
                Hackathons & Competitions
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

            {/* Event Type Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {availableTypes.map((type) => (
                  <motion.button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 border-2 ${
                      selectedType === type
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                        : 'bg-white dark:bg-gray-900 text-black dark:text-white border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black'
                    }`}
                  >
                    {type}
                    {type !== 'All' && (
                      <span className="ml-2 text-xs opacity-75">
                        ({competitions.filter(c => c.event_type === type.toLowerCase()).length})
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          <div ref={ref} className="space-y-6 max-w-6xl mx-auto">
            {displayCompetitions.map((competition, index) => (
              <motion.div
                key={competition.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-effect p-4 sm:p-6 hover:border-black dark:hover:border-white transition-all duration-300 card-hover border-2 border-light dark:border-gray-700"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Main Content */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white">
                            {competition.title}
                          </h3>
                          {competition.featured && (
                            <span className="featured-badge text-xs px-3 py-1 rounded-full font-bold">
                              Featured
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold border-2 ${getStandingColor(competition.standing)}`}>
                            <Award className="w-3 h-3 inline mr-1" />
                            {competition.standing}
                          </span>
                          <span className="text-xs px-3 py-1 rounded-full bg-light-gray dark:bg-gray-700 text-black dark:text-white border border-black dark:border-white font-semibold capitalize">
                            {competition.event_type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-secondary mb-4 leading-relaxed text-sm sm:text-base">
                      {competition.description}
                    </p>

                    {/* Event Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-secondary">
                        <Calendar className="w-4 h-4 text-black dark:text-white flex-shrink-0" />
                        <span className="font-medium">{competition.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-secondary">
                        <MapPin className="w-4 h-4 text-black dark:text-white flex-shrink-0" />
                        <span className="font-medium">{competition.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-secondary">
                        <Users className="w-4 h-4 text-black dark:text-white flex-shrink-0" />
                        <span className="font-medium">Team of {competition.team_size}</span>
                      </div>
                      <div className="flex items-center gap-2 text-secondary">
                        <Trophy className="w-4 h-4 text-black dark:text-white flex-shrink-0" />
                        <span className="font-medium">{competition.organizer}</span>
                      </div>
                    </div>

                    {/* Technologies */}
                    {competition.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {competition.technologies.map((tech, techIndex) => (
                          <motion.span
                            key={techIndex}
                            whileHover={{ scale: 1.05 }}
                            className="tag px-2 sm:px-3 py-1 text-xs sm:text-sm"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      {competition.project_url && (
                        <motion.a
                          href={competition.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          className="btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm w-full sm:w-auto justify-center sm:justify-start"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Project
                        </motion.a>
                      )}
                      
                      {competition.certificate_url && (
                        <motion.a
                          href={competition.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all duration-300 text-sm w-full sm:w-auto justify-center sm:justify-start"
                        >
                          <Award className="w-4 h-4" />
                          Certificate
                        </motion.a>
                      )}
                    </div>
                  </div>

                  {/* Images Gallery */}
                  {competition.images.length > 0 && (
                    <div className="lg:w-80">
                      <h4 className="text-sm font-bold text-black dark:text-white mb-3">Event Photos</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {competition.images.slice(0, 4).map((image, imageIndex) => (
                          <motion.div
                            key={imageIndex}
                            whileHover={{ scale: 1.02 }}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-light dark:border-gray-600 hover:border-black dark:hover:border-white transition-colors"
                            onClick={() => setSelectedImage(image)}
                          >
                            <img
                              src={image}
                              alt={`${competition.title} - Photo ${imageIndex + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {imageIndex === 3 && competition.images.length > 4 && (
                              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  +{competition.images.length - 4} more
                                </span>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {displayCompetitions.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-secondary mx-auto mb-4" />
              <p className="text-secondary mb-4">
                {selectedType === 'All' 
                  ? 'No competitions to display yet.' 
                  : `No ${selectedType.toLowerCase()}s found.`
                }
              </p>
              {selectedType !== 'All' && (
                <button
                  onClick={() => setSelectedType('All')}
                  className="btn-secondary px-4 py-2 rounded-lg text-sm"
                >
                  View All Events
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Competition photo"
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              ×
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}