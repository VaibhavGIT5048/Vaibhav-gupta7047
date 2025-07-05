import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Edit2, Trash2, Save, Ambulance as Cancel, Upload, Download, LogOut, Briefcase, Code, FolderOpen, FileText, User, RotateCcw } from 'lucide-react';
import { Experience, Skill, Project, ResumeFile, About } from '../lib/supabase';
import { 
  getExperiences, 
  createExperience, 
  updateExperience, 
  deleteExperience,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getActiveResume,
  uploadResume,
  deleteResume,
  getAboutContent,
  updateAboutContent
} from '../utils/supabaseStorage';
import { logout } from '../utils/auth';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdate: () => void;
}

type TabType = 'about' | 'experience' | 'skills' | 'projects' | 'resume';

export default function AdminPanel({ isOpen, onClose, onDataUpdate }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [resumeFile, setResumeFile] = useState<ResumeFile | null>(null);
  const [aboutContent, setAboutContent] = useState<About | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [aboutUpdateStatus, setAboutUpdateStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Form states
  const [experienceForm, setExperienceForm] = useState({
    role: '',
    organization: '',
    period: '',
    location: '',
    description: '',
    type: 'professional' as 'professional' | 'leadership'
  });

  const [skillForm, setSkillForm] = useState({
    name: '',
    level: 0,
    type: 'technical' as 'technical' | 'soft'
  });

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    image: '',
    github_url: '',
    live_url: '',
    tech: [] as string[],
    featured: false
  });

  const [aboutForm, setAboutForm] = useState('');
  const [originalAboutContent, setOriginalAboutContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadAllData();
    }
  }, [isOpen]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [expData, skillData, projectData, resumeData, aboutData] = await Promise.all([
        getExperiences(),
        getSkills(),
        getProjects(),
        getActiveResume(),
        getAboutContent()
      ]);
      
      setExperiences(expData);
      setSkills(skillData);
      setProjects(projectData);
      setResumeFile(resumeData);
      setAboutContent(aboutData);
      
      // Set about form content
      const content = aboutData?.content || '';
      setAboutForm(content);
      setOriginalAboutContent(content);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      // Dispatch auth update event
      window.dispatchEvent(new Event('authUpdated'));
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // About handlers
  const handleUpdateAbout = async () => {
    setAboutUpdateStatus('saving');
    try {
      const updated = await updateAboutContent(aboutForm);
      if (updated) {
        setAboutContent(updated);
        setOriginalAboutContent(aboutForm);
        setAboutUpdateStatus('success');
        onDataUpdate();
        
        // Reset status after 2 seconds
        setTimeout(() => setAboutUpdateStatus('idle'), 2000);
      } else {
        setAboutUpdateStatus('error');
        setTimeout(() => setAboutUpdateStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error updating about content:', error);
      setAboutUpdateStatus('error');
      setTimeout(() => setAboutUpdateStatus('idle'), 3000);
    }
  };

  const handleResetAbout = () => {
    setAboutForm(originalAboutContent);
    setAboutUpdateStatus('idle');
  };

  // Experience handlers
  const handleCreateExperience = async () => {
    try {
      const newExp = await createExperience(experienceForm);
      if (newExp) {
        setExperiences([newExp, ...experiences]);
        setExperienceForm({
          role: '',
          organization: '',
          period: '',
          location: '',
          description: '',
          type: 'professional'
        });
        onDataUpdate();
      }
    } catch (error) {
      console.error('Error creating experience:', error);
    }
  };

  const handleUpdateExperience = async (id: string) => {
    try {
      const updated = await updateExperience(id, experienceForm);
      if (updated) {
        setExperiences(experiences.map(exp => exp.id === id ? updated : exp));
        setEditingItem(null);
        onDataUpdate();
      }
    } catch (error) {
      console.error('Error updating experience:', error);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      const success = await deleteExperience(id);
      if (success) {
        setExperiences(experiences.filter(exp => exp.id !== id));
        onDataUpdate();
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  // Skill handlers
  const handleCreateSkill = async () => {
    try {
      const newSkill = await createSkill(skillForm);
      if (newSkill) {
        setSkills([...skills, newSkill]);
        setSkillForm({
          name: '',
          level: 0,
          type: 'technical'
        });
        onDataUpdate();
      }
    } catch (error) {
      console.error('Error creating skill:', error);
    }
  };

  const handleUpdateSkill = async (id: string) => {
    try {
      const updated = await updateSkill(id, skillForm);
      if (updated) {
        setSkills(skills.map(skill => skill.id === id ? updated : skill));
        setEditingItem(null);
        onDataUpdate();
      }
    } catch (error) {
      console.error('Error updating skill:', error);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      const success = await deleteSkill(id);
      if (success) {
        setSkills(skills.filter(skill => skill.id !== id));
        onDataUpdate();
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  // Project handlers
  const handleCreateProject = async () => {
    try {
      const newProject = await createProject(projectForm);
      if (newProject) {
        setProjects([newProject, ...projects]);
        setProjectForm({
          title: '',
          description: '',
          image: '',
          github_url: '',
          live_url: '',
          tech: [],
          featured: false
        });
        onDataUpdate();
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = async (id: string) => {
    try {
      const updated = await updateProject(id, projectForm);
      if (updated) {
        setProjects(projects.map(project => project.id === id ? updated : project));
        setEditingItem(null);
        onDataUpdate();
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const success = await deleteProject(id);
      if (success) {
        setProjects(projects.filter(project => project.id !== id));
        onDataUpdate();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Resume handlers
  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadProgress(true);
    try {
      const uploadedResume = await uploadResume(file);
      if (uploadedResume) {
        setResumeFile(uploadedResume);
        onDataUpdate();
        // Dispatch resume update event
        window.dispatchEvent(new Event('resumeUpdated'));
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload resume');
    } finally {
      setUploadProgress(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleDeleteResume = async () => {
    if (!resumeFile) return;
    
    try {
      await deleteResume(resumeFile.id);
      setResumeFile(null);
      onDataUpdate();
      // Dispatch resume update event
      window.dispatchEvent(new Event('resumeUpdated'));
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete resume');
    }
  };

  const startEditing = (item: any, type: TabType) => {
    setEditingItem(item.id);
    
    if (type === 'experience') {
      setExperienceForm({
        role: item.role,
        organization: item.organization,
        period: item.period,
        location: item.location,
        description: item.description,
        type: item.type
      });
    } else if (type === 'skills') {
      setSkillForm({
        name: item.name,
        level: item.level,
        type: item.type
      });
    } else if (type === 'projects') {
      setProjectForm({
        title: item.title,
        description: item.description,
        image: item.image,
        github_url: item.github_url,
        live_url: item.live_url || '',
        tech: item.tech,
        featured: item.featured
      });
    }
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setExperienceForm({
      role: '',
      organization: '',
      period: '',
      location: '',
      description: '',
      type: 'professional'
    });
    setSkillForm({
      name: '',
      level: 0,
      type: 'technical'
    });
    setProjectForm({
      title: '',
      description: '',
      image: '',
      github_url: '',
      live_url: '',
      tech: [],
      featured: false
    });
  };

  if (!isOpen) return null;

  const hasAboutChanges = aboutForm !== originalAboutContent;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-6xl h-[95vh] sm:h-[90vh] rounded-lg overflow-hidden border-2 border-black dark:border-white flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b-2 border-black dark:border-white flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center glass-effect-light border-2 border-black dark:border-white">
              <Code className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white">Admin Panel</h2>
              <p className="text-xs sm:text-sm text-secondary hidden sm:block">Centralized content management</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              className="btn-secondary flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-black dark:text-white hover:text-white dark:hover:text-black transition-colors text-xs sm:text-sm rounded-lg"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
            <button
              onClick={onClose}
              className="text-black dark:text-white hover:text-secondary dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-black dark:border-white flex-shrink-0 overflow-x-auto bg-white dark:bg-gray-900">
          {[
            { id: 'about', label: 'About', icon: User },
            { id: 'experience', label: 'Experience', icon: Briefcase },
            { id: 'skills', label: 'Skills', icon: Code },
            { id: 'projects', label: 'Projects', icon: FolderOpen },
            { id: 'resume', label: 'Resume', icon: FileText }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as TabType)}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold transition-colors border-b-4 whitespace-nowrap ${
                activeTab === id
                  ? 'text-black dark:text-white border-black dark:border-white bg-light-gray dark:bg-gray-800'
                  : 'text-secondary border-transparent hover:text-black dark:hover:text-white hover:bg-light-gray dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Content - Now with proper scrolling */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 scrollbar-thin scrollbar-track-light scrollbar-thumb-dark bg-white dark:bg-gray-900">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* About Tab */}
              {activeTab === 'about' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-black dark:text-white">About Me Content</h3>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      {hasAboutChanges && (
                        <motion.button
                          onClick={handleResetAbout}
                          whileHover={{ scale: 1.05 }}
                          className="btn-secondary flex items-center gap-2 px-3 sm:px-4 py-2 text-black dark:text-white rounded-lg text-sm"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reset
                        </motion.button>
                      )}
                      <motion.button
                        onClick={handleUpdateAbout}
                        whileHover={{ scale: 1.05 }}
                        disabled={!hasAboutChanges || aboutUpdateStatus === 'saving'}
                        className="btn-primary flex items-center gap-2 px-3 sm:px-4 py-2 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {aboutUpdateStatus === 'saving' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Update About
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  <div className="glass-effect p-4 sm:p-6 border-2 border-black dark:border-white">
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-black dark:text-white mb-2">
                        About Me Content
                      </label>
                      <textarea
                        value={aboutForm}
                        onChange={(e) => setAboutForm(e.target.value)}
                        rows={12}
                        className="w-full px-3 sm:px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-2 border-black dark:border-white glass-effect text-sm leading-relaxed"
                        placeholder="Write about yourself, your background, skills, and aspirations..."
                      />
                    </div>

                    {/* Status Messages */}
                    <AnimatePresence>
                      {aboutUpdateStatus === 'success' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mb-4 p-3 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-900/20"
                        >
                          <p className="text-green-600 dark:text-green-400 text-sm font-semibold">About content updated successfully!</p>
                        </motion.div>
                      )}
                      
                      {aboutUpdateStatus === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mb-4 p-3 rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-900/20"
                        >
                          <p className="text-red-600 dark:text-red-400 text-sm font-semibold">Failed to update about content. Please try again.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="text-xs sm:text-sm text-secondary">
                      <p className="mb-2"><strong>Tips for writing effective about content:</strong></p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Keep it personal but professional</li>
                        <li>Highlight your key skills and experiences</li>
                        <li>Mention your goals and aspirations</li>
                        <li>Use line breaks to improve readability</li>
                        <li>Keep it concise but informative</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Experience Tab */}
              {activeTab === 'experience' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-black dark:text-white">Experience Management</h3>
                    <motion.button
                      onClick={() => setEditingItem('new-experience')}
                      whileHover={{ scale: 1.05 }}
                      className="btn-primary flex items-center gap-2 px-3 sm:px-4 py-2 text-white rounded-lg text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Experience
                    </motion.button>
                  </div>

                  {/* Add/Edit Form */}
                  <AnimatePresence>
                    {editingItem === 'new-experience' || (editingItem && experiences.find(exp => exp.id === editingItem)) ? (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-effect p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-black dark:border-white"
                      >
                        <h4 className="text-black dark:text-white font-bold mb-4 text-sm sm:text-base">
                          {editingItem === 'new-experience' ? 'Add New Experience' : 'Edit Experience'}
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                          <input
                            type="text"
                            placeholder="Role/Position"
                            value={experienceForm.role}
                            onChange={(e) => setExperienceForm({...experienceForm, role: e.target.value})}
                            className="px-3 sm:px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-2 border-black dark:border-white glass-effect text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Organization"
                            value={experienceForm.organization}
                            onChange={(e) => setExperienceForm({...experienceForm, organization: e.target.value})}
                            className="px-3 sm:px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-2 border-black dark:border-white glass-effect text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Period (e.g., Jan 2023 - Present)"
                            value={experienceForm.period}
                            onChange={(e) => setExperienceForm({...experienceForm, period: e.target.value})}
                            className="px-3 sm:px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-2 border-black dark:border-white glass-effect text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Location"
                            value={experienceForm.location}
                            onChange={(e) => setExperienceForm({...experienceForm, location: e.target.value})}
                            className="px-3 sm:px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-2 border-black dark:border-white glass-effect text-sm"
                          />
                        </div>
                        
                        <select
                          value={experienceForm.type}
                          onChange={(e) => setExperienceForm({...experienceForm, type: e.target.value as 'professional' | 'leadership'})}
                          className="w-full px-3 sm:px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white mb-4 border-2 border-black dark:border-white glass-effect text-sm"
                        >
                          <option value="professional">Professional</option>
                          <option value="leadership">Leadership</option>
                        </select>
                        
                        <textarea
                          placeholder="Description"
                          value={experienceForm.description}
                          onChange={(e) => setExperienceForm({...experienceForm, description: e.target.value})}
                          rows={4}
                          className="w-full px-3 sm:px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white mb-4 border-2 border-black dark:border-white glass-effect text-sm"
                        />
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => editingItem === 'new-experience' ? handleCreateExperience() : handleUpdateExperience(editingItem!)}
                            className="btn-primary flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm"
                          >
                            <Save className="w-4 h-4" />
                            {editingItem === 'new-experience' ? 'Create' : 'Update'}
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="btn-secondary flex items-center gap-2 px-4 py-2 text-black dark:text-white rounded-lg text-sm"
                          >
                            <Cancel className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {/* Experience List */}
                  <div className="space-y-4">
                    {experiences.map((experience) => (
                      <div
                        key={experience.id}
                        className="glass-effect p-3 sm:p-4 border-2 border-light dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                              <h4 className="text-black dark:text-white font-bold text-sm sm:text-base truncate">{experience.role}</h4>
                              <span className="text-xs px-2 py-1 rounded-full text-black dark:text-white border-2 border-black dark:border-white glass-effect-accent font-bold w-fit">
                                {experience.type}
                              </span>
                            </div>
                            <p className="text-black dark:text-white font-semibold text-xs sm:text-sm mb-1 truncate">{experience.organization}</p>
                            <p className="text-secondary text-xs sm:text-sm mb-2">{experience.period} • {experience.location}</p>
                            <p className="text-secondary text-xs sm:text-sm line-clamp-3">{experience.description}</p>
                          </div>
                          <div className="flex gap-1 sm:gap-2 ml-2 sm:ml-4 flex-shrink-0">
                            <button
                              onClick={() => startEditing(experience, 'experience')}
                              className="p-1.5 sm:p-2 text-black dark:text-white hover:text-secondary dark:hover:text-gray-300 transition-colors"
                            >
                              <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteExperience(experience.id)}
                              className="p-1.5 sm:p-2 text-black dark:text-white hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-black dark:text-white">Skills Management</h3>
                    <motion.button
                      onClick={() => setEditingItem('new-skill')}
                      whileHover={{ scale: 1.05 }}
                      className="btn-primary flex items-center gap-2 px-3 sm:px-4 py-2 text-white rounded-lg text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Skill
                    </motion.button>
                  </div>

                  {/* Add/Edit Form */}
                  <AnimatePresence>
                    {editingItem === 'new-skill' || (editingItem && skills.find(skill => skill.id === editingItem)) ? (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-effect p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-black dark:border-white"
                      >
                        <h4 className="text-black dark:text-white font-bold mb-4 text-sm sm:text-base">
                          {editingItem === 'new-skill' ? 'Add New Skill' : 'Edit Skill'}
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                          <input
                            type="text"
                            placeholder="Skill Name"
                            value={skillForm.name}
                            onChange={(e) => setSkillForm({...skillForm, name: e.target.value})}
                            className="px-3 sm:px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-2 border-black dark:border-white glass-effect text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Level (0-100)"
                            min="0"
                            max="100"
                            value={skillForm.level}
                            onChange={(e) => setSkillForm({...skillForm, level: parseInt(e.target.value) || 0})}
                            className="px-3 sm:px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-2 border-black dark:border-white glass-effect text-sm"
                          />
                          <select
                            value={skillForm.type}
                            onChange={(e) => setSkillForm({...skillForm, type: e.target.value as 'technical' | 'soft'})}
                            className="px-3 sm:px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-2 border-black dark:border-white glass-effect text-sm"
                          >
                            <option value="technical">Technical</option>
                            <option value="soft">Soft Skill</option>
                          </select>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => editingItem === 'new-skill' ? handleCreateSkill() : handleUpdateSkill(editingItem!)}
                            className="btn-primary flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm"
                          >
                            <Save className="w-4 h-4" />
                            {editingItem === 'new-skill' ? 'Create' : 'Update'}
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="btn-secondary flex items-center gap-2 px-4 py-2 text-black dark:text-white rounded-lg text-sm"
                          >
                            <Cancel className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {/* Skills List */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="glass-effect p-3 sm:p-4 border-2 border-light dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                              <h4 className="text-black dark:text-white font-bold text-sm sm:text-base truncate">{skill.name}</h4>
                              <span className="text-xs px-2 py-1 rounded-full text-black dark:text-white border-2 border-black dark:border-white glass-effect-accent font-bold w-fit">
                                {skill.type}
                              </span>
                            </div>
                            {skill.type === 'technical' && (
                              <div className="flex items-center gap-2">
                                <div className="flex-1 progress-bar h-2 sm:h-3">
                                  <div
                                    className="progress-fill h-full"
                                    style={{ width: `${skill.level}%` }}
                                  />
                                </div>
                                <span className="text-black dark:text-white text-xs sm:text-sm font-bold">{skill.level}%</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1 sm:gap-2 ml-2 sm:ml-4 flex-shrink-0">
                            <button
                              onClick={() => startEditing(skill, 'skills')}
                              className="p-1.5 sm:p-2 text-black dark:text-white hover:text-secondary dark:hover:text-gray-300 transition-colors"
                            >
                              <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="p-1.5 sm:p-2 text-black dark:text-white hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-black dark:text-white">Projects Management</h3>
                    <motion.button
                      onClick={() => setEditingItem('new-project')}
                      whileHover={{ scale: 1.05 }}
                      className="btn-primary flex items-center gap-2 px-3 sm:px-4 py-2 text-white rounded-lg text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Project
                    </motion.button>
                  </div>

                  {/* Add/Edit Form */}
                  <AnimatePresence>
                    {editingItem === 'new-project' || (editingItem && projects.find(project => project.id === editingItem)) ? (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-effect p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-black dark:border-white"
                      >
                        <h4 className="text-black dark:text-white font-bold mb-4 text-sm sm:text-base">
                          {editingItem === 'new-project' ? 'Add New Project' : 'Edit Project'}
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                          <input
                            type="text"
                            placeholder="Project Title"
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                            className="px-3 sm:px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-2 border-black dark:border-white glass-effect text-sm"
                          />
                          <input
                            type="url"
                            placeholder="GitHub URL"
                            value={projectForm.github_url}
                            onChange={(e) => setProjectForm({...projectForm, github_url: e.target.value})}
                            className="px-3 sm:px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-2 border-black dark:border-white glass-effect text-sm"
                          />
                          <input
                            type="url"
                            placeholder="Live URL (optional)"
                            value={projectForm.live_url}
                            onChange={(e) => setProjectForm({...projectForm, live_url: e.target.value})}
                            className="px-3 sm:px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-2 border-black dark:border-white glass-effect text-sm"
                          />
                          <input
                            type="url"
                            placeholder="Image URL (optional)"
                            value={projectForm.image}
                            onChange={(e) => setProjectForm({...projectForm, image: e.target.value})}
                            className="px-3 sm:px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white border-2 border-black dark:border-white glass-effect text-sm"
                          />
                        </div>
                        
                        <textarea
                          placeholder="Project Description"
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                          rows={3}
                          className="w-full px-3 sm:px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white mb-4 border-2 border-black dark:border-white glass-effect text-sm"
                        />
                        
                        <input
                          type="text"
                          placeholder="Technologies (comma-separated)"
                          value={projectForm.tech.join(', ')}
                          onChange={(e) => setProjectForm({...projectForm, tech: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                          className="w-full px-3 sm:px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white mb-4 border-2 border-black dark:border-white glass-effect text-sm"
                        />
                        
                        <label className="flex items-center gap-2 text-black dark:text-white mb-4 font-bold text-sm">
                          <input
                            type="checkbox"
                            checked={projectForm.featured}
                            onChange={(e) => setProjectForm({...projectForm, featured: e.target.checked})}
                            className="rounded border-2 border-black dark:border-white"
                          />
                          Featured Project
                        </label>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => editingItem === 'new-project' ? handleCreateProject() : handleUpdateProject(editingItem!)}
                            className="btn-primary flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm"
                          >
                            <Save className="w-4 h-4" />
                            {editingItem === 'new-project' ? 'Create' : 'Update'}
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="btn-secondary flex items-center gap-2 px-4 py-2 text-black dark:text-white rounded-lg text-sm"
                          >
                            <Cancel className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {/* Projects List */}
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="glass-effect p-3 sm:p-4 border-2 border-light dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                              <h4 className="text-black dark:text-white font-bold text-sm sm:text-base truncate">{project.title}</h4>
                              {project.featured && (
                                <span className="text-xs px-2 py-1 rounded-full text-white bg-black dark:bg-white dark:text-black border-2 border-black dark:border-white font-bold w-fit">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-secondary text-xs sm:text-sm mb-2 line-clamp-2">{project.description}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {project.tech.slice(0, 3).map((tech, index) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-1 rounded-full text-black dark:text-white border-2 border-black dark:border-white glass-effect-accent font-bold"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.tech.length > 3 && (
                                <span className="text-xs px-2 py-1 rounded-full text-black dark:text-white border-2 border-black dark:border-white glass-effect-accent font-bold">
                                  +{project.tech.length - 3}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2 text-xs sm:text-sm">
                              {project.github_url && (
                                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-black dark:text-white hover:underline font-semibold">
                                  GitHub
                                </a>
                              )}
                              {project.live_url && (
                                <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-black dark:text-white hover:underline font-semibold">
                                  Live Demo
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 sm:gap-2 ml-2 sm:ml-4 flex-shrink-0">
                            <button
                              onClick={() => startEditing(project, 'projects')}
                              className="p-1.5 sm:p-2 text-black dark:text-white hover:text-secondary dark:hover:text-gray-300 transition-colors"
                            >
                              <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-1.5 sm:p-2 text-black dark:text-white hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume Tab */}
              {activeTab === 'resume' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-black dark:text-white">Resume Management</h3>
                  </div>

                  <div className="glass-effect p-4 sm:p-6 border-2 border-black dark:border-white">
                    
                    {resumeFile ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center glass-effect-light border-2 border-black dark:border-white flex-shrink-0">
                            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-black dark:text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-black dark:text-white font-bold text-sm sm:text-base truncate">{resumeFile.filename}</h4>
                            <p className="text-secondary text-xs sm:text-sm">
                              {(resumeFile.file_size / 1024 / 1024).toFixed(2)} MB • 
                              Uploaded {new Date(resumeFile.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                          <a
                            href={resumeFile.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-white rounded-lg text-sm"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                          <button
                            onClick={handleDeleteResume}
                            className="btn-secondary flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-black dark:text-white rounded-lg hover:text-red-500 transition-colors text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 glass-effect-light border-2 border-black dark:border-white">
                          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-black dark:text-white" />
                        </div>
                        <h4 className="text-black dark:text-white font-bold mb-2 text-sm sm:text-base">No Resume Uploaded</h4>
                        <p className="text-secondary text-xs sm:text-sm mb-4 sm:mb-6">Upload a PDF resume to make it available for download</p>
                        
                        <label className="btn-primary inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-white rounded-lg cursor-pointer text-sm">
                          <Upload className="w-4 h-4" />
                          {uploadProgress ? 'Uploading...' : 'Upload Resume'}
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleResumeUpload}
                            className="hidden"
                            disabled={uploadProgress}
                          />
                        </label>
                      </div>
                    )}

                    {!resumeFile && (
                      <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg border-2 border-black dark:border-white glass-effect">
                        <h5 className="text-black dark:text-white font-bold mb-2 text-sm">Upload Guidelines</h5>
                        <ul className="text-secondary text-xs sm:text-sm space-y-1">
                          <li>• Only PDF files are accepted</li>
                          <li>• Maximum file size: 5MB</li>
                          <li>• Only one resume can be active at a time</li>
                          <li>• Uploading a new resume will replace the current one</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}