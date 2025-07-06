import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  Upload, 
  Download, 
  FileText, 
  Briefcase, 
  Code, 
  User, 
  FolderOpen,
  Star,
  ExternalLink,
  Github,
  Calendar,
  MapPin,
  Building,
  Award,
  Target,
  Layers
} from 'lucide-react';
import { 
  Experience, 
  Skill, 
  Project, 
  ResumeFile, 
  About 
} from '../lib/supabase';
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
  getAboutContent,
  updateAboutContent,
  getActiveResume,
  uploadResume,
  deleteResume
} from '../utils/supabaseStorage';
import { logout } from '../utils/auth';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdate: () => void;
}

type TabType = 'about' | 'experiences' | 'skills' | 'projects' | 'resume';

const PROJECT_CATEGORIES = [
  'AI/ML',
  'Data Science & Analysis', 
  'Case Studies',
  'Web Development',
  'Other'
] as const;

type ProjectCategory = typeof PROJECT_CATEGORIES[number];

export default function AdminPanel({ isOpen, onClose, onDataUpdate }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // About state
  const [aboutContent, setAboutContentState] = useState('');
  const [aboutOriginal, setAboutOriginal] = useState('');

  // Experiences state
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    role: '',
    organization: '',
    period: '',
    location: '',
    description: '',
    type: 'professional'
  });

  // Skills state
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    name: '',
    level: 0,
    type: 'technical'
  });

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    image: '',
    github_url: '',
    live_url: '',
    tech: [],
    featured: false,
    category: 'Other'
  });
  const [techInput, setTechInput] = useState('');

  // Resume state
  const [resumeFile, setResumeFile] = useState<ResumeFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      loadAllData();
    }
  }, [isOpen]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadAboutContent(),
        loadExperiences(),
        loadSkills(),
        loadProjects(),
        loadResumeFile()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      showMessage('error', 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // About Content Functions
  const loadAboutContent = async () => {
    try {
      const data = await getAboutContent();
      const content = data?.content || '';
      setAboutContentState(content);
      setAboutOriginal(content);
    } catch (error) {
      console.error('Error loading about content:', error);
    }
  };

  const saveAboutContent = async () => {
    setIsLoading(true);
    try {
      await updateAboutContent(aboutContent);
      setAboutOriginal(aboutContent);
      showMessage('success', 'About content updated successfully');
      onDataUpdate();
    } catch (error) {
      console.error('Error saving about content:', error);
      showMessage('error', 'Failed to save about content');
    } finally {
      setIsLoading(false);
    }
  };

  // Experience Functions
  const loadExperiences = async () => {
    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch (error) {
      console.error('Error loading experiences:', error);
    }
  };

  const saveExperience = async () => {
    if (!newExperience.role || !newExperience.organization || !newExperience.period || 
        !newExperience.location || !newExperience.description || !newExperience.type) {
      showMessage('error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await createExperience(newExperience as Omit<Experience, 'id' | 'created_at' | 'updated_at'>);
      setNewExperience({
        role: '',
        organization: '',
        period: '',
        location: '',
        description: '',
        type: 'professional'
      });
      await loadExperiences();
      showMessage('success', 'Experience added successfully');
      onDataUpdate();
    } catch (error) {
      console.error('Error saving experience:', error);
      showMessage('error', 'Failed to save experience');
    } finally {
      setIsLoading(false);
    }
  };

  const updateExperienceItem = async () => {
    if (!editingExperience) return;

    setIsLoading(true);
    try {
      await updateExperience(editingExperience.id, editingExperience);
      setEditingExperience(null);
      await loadExperiences();
      showMessage('success', 'Experience updated successfully');
      onDataUpdate();
    } catch (error) {
      console.error('Error updating experience:', error);
      showMessage('error', 'Failed to update experience');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExperienceItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    setIsLoading(true);
    try {
      await deleteExperience(id);
      await loadExperiences();
      showMessage('success', 'Experience deleted successfully');
      onDataUpdate();
    } catch (error) {
      console.error('Error deleting experience:', error);
      showMessage('error', 'Failed to delete experience');
    } finally {
      setIsLoading(false);
    }
  };

  // Skill Functions
  const loadSkills = async () => {
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  };

  const saveSkill = async () => {
    if (!newSkill.name || !newSkill.type) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    // For soft skills, set level to 0
    const skillData = {
      ...newSkill,
      level: newSkill.type === 'soft' ? 0 : (newSkill.level || 0)
    };

    setIsLoading(true);
    try {
      await createSkill(skillData as Omit<Skill, 'id' | 'created_at' | 'updated_at'>);
      setNewSkill({
        name: '',
        level: 0,
        type: 'technical'
      });
      await loadSkills();
      showMessage('success', 'Skill added successfully');
      onDataUpdate();
    } catch (error) {
      console.error('Error saving skill:', error);
      showMessage('error', 'Failed to save skill');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSkillItem = async () => {
    if (!editingSkill) return;

    setIsLoading(true);
    try {
      await updateSkill(editingSkill.id, editingSkill);
      setEditingSkill(null);
      await loadSkills();
      showMessage('success', 'Skill updated successfully');
      onDataUpdate();
    } catch (error) {
      console.error('Error updating skill:', error);
      showMessage('error', 'Failed to update skill');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSkillItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    setIsLoading(true);
    try {
      await deleteSkill(id);
      await loadSkills();
      showMessage('success', 'Skill deleted successfully');
      onDataUpdate();
    } catch (error) {
      console.error('Error deleting skill:', error);
      showMessage('error', 'Failed to delete skill');
    } finally {
      setIsLoading(false);
    }
  };

  // Project Functions
  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleTechInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTechTag();
    }
  };

  const addTechTag = () => {
    const tech = techInput.trim();
    if (tech && !newProject.tech?.includes(tech)) {
      setNewProject(prev => ({
        ...prev,
        tech: [...(prev.tech || []), tech]
      }));
      setTechInput('');
    }
  };

  const removeTechTag = (techToRemove: string) => {
    setNewProject(prev => ({
      ...prev,
      tech: prev.tech?.filter(tech => tech !== techToRemove) || []
    }));
  };

  const saveProject = async () => {
    if (!newProject.title || !newProject.description || !newProject.github_url || !newProject.category) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await createProject(newProject as Omit<Project, 'id' | 'created_at' | 'updated_at'>);
      setNewProject({
        title: '',
        description: '',
        image: '',
        github_url: '',
        live_url: '',
        tech: [],
        featured: false,
        category: 'Other'
      });
      setTechInput('');
      await loadProjects();
      showMessage('success', 'Project added successfully');
      onDataUpdate();
    } catch (error) {
      console.error('Error saving project:', error);
      showMessage('error', 'Failed to save project');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProjectItem = async () => {
    if (!editingProject) return;

    setIsLoading(true);
    try {
      await updateProject(editingProject.id, editingProject);
      setEditingProject(null);
      await loadProjects();
      showMessage('success', 'Project updated successfully');
      onDataUpdate();
    } catch (error) {
      console.error('Error updating project:', error);
      showMessage('error', 'Failed to update project');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProjectItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    setIsLoading(true);
    try {
      await deleteProject(id);
      await loadProjects();
      showMessage('success', 'Project deleted successfully');
      onDataUpdate();
    } catch (error) {
      console.error('Error deleting project:', error);
      showMessage('error', 'Failed to delete project');
    } finally {
      setIsLoading(false);
    }
  };

  // Resume Functions
  const loadResumeFile = async () => {
    try {
      const data = await getActiveResume();
      setResumeFile(data);
    } catch (error) {
      console.error('Error loading resume:', error);
    }
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showMessage('error', 'Only PDF files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'File size must be less than 5MB');
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const uploadedFile = await uploadResume(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (uploadedFile) {
        setResumeFile(uploadedFile);
        showMessage('success', 'Resume uploaded successfully');
        onDataUpdate();
      }
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      showMessage('error', error.message || 'Failed to upload resume');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleResumeDelete = async () => {
    if (!resumeFile || !confirm('Are you sure you want to delete the current resume?')) return;

    setIsLoading(true);
    try {
      await deleteResume(resumeFile.id);
      setResumeFile(null);
      showMessage('success', 'Resume deleted successfully');
      onDataUpdate();
    } catch (error: any) {
      console.error('Error deleting resume:', error);
      showMessage('error', error.message || 'Failed to delete resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to logout?')) return;
    
    try {
      await logout();
      onClose();
      window.dispatchEvent(new Event('authUpdated'));
      showMessage('success', 'Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      showMessage('error', 'Failed to logout');
    }
  };

  const handleClose = () => {
    // Check if there are unsaved changes in about content
    if (aboutContent !== aboutOriginal) {
      if (!confirm('You have unsaved changes in About content. Are you sure you want to close?')) {
        return;
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'about' as TabType, label: 'About', icon: User },
    { id: 'experiences' as TabType, label: 'Experience', icon: Briefcase },
    { id: 'skills' as TabType, label: 'Skills', icon: Code },
    { id: 'projects' as TabType, label: 'Projects', icon: FolderOpen },
    { id: 'resume' as TabType, label: 'Resume', icon: FileText }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border-2 border-black dark:border-white transition-colors duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b-2 border-black dark:border-white bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center glass-effect-light border-2 border-black dark:border-white">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white">Project Manager</h2>
              <p className="text-xs sm:text-sm text-secondary">Manage your portfolio content</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="btn-secondary px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105"
            >
              Logout
            </button>
            <button
              onClick={handleClose}
              className="text-black dark:text-white hover:text-secondary dark:hover:text-gray-300 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Display */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mx-4 sm:mx-6 mt-4 p-3 rounded-lg border-2 ${
                message.type === 'success'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
              }`}
            >
              <p className="text-sm font-semibold">{message.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex border-b-2 border-black dark:border-white bg-white dark:bg-gray-900 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-300 border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-black dark:border-white text-black dark:text-white bg-light-gray dark:bg-gray-800'
                    : 'border-transparent text-secondary hover:text-black dark:hover:text-white hover:bg-light-gray dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white dark:bg-gray-900 scrollbar-thin scrollbar-track-light scrollbar-thumb-dark">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black dark:text-white">About Content</h3>
                <button
                  onClick={saveAboutContent}
                  disabled={isLoading || aboutContent === aboutOriginal}
                  className="btn-primary px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">
                  About Content
                </label>
                <textarea
                  value={aboutContent}
                  onChange={(e) => setAboutContentState(e.target.value)}
                  className="w-full h-64 px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect resize-none"
                  placeholder="Enter your about content here..."
                />
                <p className="text-xs text-secondary mt-2">
                  Separate paragraphs with double line breaks. The last paragraph starting with "Let's harness" will be styled as a call-to-action.
                </p>
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experiences' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black dark:text-white">Experience Management</h3>
              </div>

              {/* Add New Experience */}
              <div className="glass-effect p-4 sm:p-6 border-2 border-black dark:border-white">
                <h4 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Experience
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-2">Role *</label>
                    <input
                      type="text"
                      value={newExperience.role || ''}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-2">Organization *</label>
                    <input
                      type="text"
                      value={newExperience.organization || ''}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, organization: e.target.value }))}
                      className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                      placeholder="e.g., Tech Company Inc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-2">Period *</label>
                    <input
                      type="text"
                      value={newExperience.period || ''}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, period: e.target.value }))}
                      className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                      placeholder="e.g., Jan 2023 - Present"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-2">Location *</label>
                    <input
                      type="text"
                      value={newExperience.location || ''}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                      placeholder="e.g., Remote, New York"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-bold text-black dark:text-white mb-2">Type *</label>
                  <select
                    value={newExperience.type || 'professional'}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, type: e.target.value as 'professional' | 'leadership' }))}
                    className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                  >
                    <option value="professional">Professional Experience</option>
                    <option value="leadership">Leadership & Extracurricular</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-bold text-black dark:text-white mb-2">Description *</label>
                  <textarea
                    value={newExperience.description || ''}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full h-24 px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect resize-none"
                    placeholder="Describe your role and achievements..."
                  />
                </div>
                
                <button
                  onClick={saveExperience}
                  disabled={isLoading}
                  className="btn-primary px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  {isLoading ? 'Adding...' : 'Add Experience'}
                </button>
              </div>

              {/* Experience List */}
              <div className="space-y-4">
                {experiences.map((experience) => (
                  <div key={experience.id} className="glass-effect p-4 sm:p-6 border-2 border-light dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-300">
                    {editingExperience?.id === experience.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-black dark:text-white mb-2">Role</label>
                            <input
                              type="text"
                              value={editingExperience.role}
                              onChange={(e) => setEditingExperience(prev => prev ? { ...prev, role: e.target.value } : null)}
                              className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-bold text-black dark:text-white mb-2">Organization</label>
                            <input
                              type="text"
                              value={editingExperience.organization}
                              onChange={(e) => setEditingExperience(prev => prev ? { ...prev, organization: e.target.value } : null)}
                              className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-bold text-black dark:text-white mb-2">Period</label>
                            <input
                              type="text"
                              value={editingExperience.period}
                              onChange={(e) => setEditingExperience(prev => prev ? { ...prev, period: e.target.value } : null)}
                              className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-bold text-black dark:text-white mb-2">Location</label>
                            <input
                              type="text"
                              value={editingExperience.location}
                              onChange={(e) => setEditingExperience(prev => prev ? { ...prev, location: e.target.value } : null)}
                              className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-bold text-black dark:text-white mb-2">Type</label>
                          <select
                            value={editingExperience.type}
                            onChange={(e) => setEditingExperience(prev => prev ? { ...prev, type: e.target.value as 'professional' | 'leadership' } : null)}
                            className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                          >
                            <option value="professional">Professional Experience</option>
                            <option value="leadership">Leadership & Extracurricular</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-bold text-black dark:text-white mb-2">Description</label>
                          <textarea
                            value={editingExperience.description}
                            onChange={(e) => setEditingExperience(prev => prev ? { ...prev, description: e.target.value } : null)}
                            className="w-full h-24 px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect resize-none"
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={updateExperienceItem}
                            disabled={isLoading}
                            className="btn-primary px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingExperience(null)}
                            className="btn-secondary px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-3">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-black dark:text-white mb-2 flex items-center gap-2">
                              <Briefcase className="w-5 h-5" />
                              {experience.role}
                            </h4>
                            <p className="text-black dark:text-white font-semibold mb-2 flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              {experience.organization}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-secondary mb-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-black dark:text-white" />
                                <span className="font-medium">{experience.period}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-black dark:text-white" />
                                <span className="font-medium">{experience.location}</span>
                              </div>
                            </div>
                            <div className="mb-3">
                              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                experience.type === 'professional' 
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                                  : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700'
                              }`}>
                                {experience.type === 'professional' ? 'Professional' : 'Leadership'}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingExperience(experience)}
                              className="btn-secondary p-2 rounded-lg flex items-center justify-center text-sm"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteExperienceItem(experience.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-2 rounded-lg border-2 border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-secondary leading-relaxed text-sm">{experience.description}</p>
                      </div>
                    )}
                  </div>
                ))}
                
                {experiences.length === 0 && (
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <p className="text-secondary">No experiences added yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black dark:text-white">Skills Management</h3>
              </div>

              {/* Add New Skill */}
              <div className="glass-effect p-4 sm:p-6 border-2 border-black dark:border-white">
                <h4 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Skill
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-2">Skill Name *</label>
                    <input
                      type="text"
                      value={newSkill.name || ''}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                      placeholder="e.g., React, Leadership"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-2">Type *</label>
                    <select
                      value={newSkill.type || 'technical'}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, type: e.target.value as 'technical' | 'soft' }))}
                      className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                    >
                      <option value="technical">Technical Skill</option>
                      <option value="soft">Soft Skill</option>
                    </select>
                  </div>
                  
                  {newSkill.type === 'technical' && (
                    <div>
                      <label className="block text-sm font-bold text-black dark:text-white mb-2">Level (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newSkill.level || 0}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, level: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                        placeholder="e.g., 85"
                      />
                    </div>
                  )}
                </div>
                
                <button
                  onClick={saveSkill}
                  disabled={isLoading}
                  className="btn-primary px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  {isLoading ? 'Adding...' : 'Add Skill'}
                </button>
              </div>

              {/* Skills List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Technical Skills */}
                <div>
                  <h4 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Technical Skills
                  </h4>
                  <div className="space-y-3">
                    {skills.filter(skill => skill.type === 'technical').map((skill) => (
                      <div key={skill.id} className="glass-effect p-4 border-2 border-light dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-300">
                        {editingSkill?.id === skill.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editingSkill.name}
                              onChange={(e) => setEditingSkill(prev => prev ? { ...prev, name: e.target.value } : null)}
                              className="w-full px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                            />
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editingSkill.level}
                              onChange={(e) => setEditingSkill(prev => prev ? { ...prev, level: parseInt(e.target.value) || 0 } : null)}
                              className="w-full px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={updateSkillItem}
                                disabled={isLoading}
                                className="btn-primary px-3 py-1 text-white rounded text-xs flex items-center gap-1"
                              >
                                <Save className="w-3 h-3" />
                                Save
                              </button>
                              <button
                                onClick={() => setEditingSkill(null)}
                                className="btn-secondary px-3 py-1 rounded text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-black dark:text-white text-sm font-bold">{skill.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-black dark:text-white text-sm font-bold">{skill.level}%</span>
                                <button
                                  onClick={() => setEditingSkill(skill)}
                                  className="text-black dark:text-white hover:text-secondary dark:hover:text-gray-300 p-1"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => deleteSkillItem(skill.id)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <div className="progress-bar h-2">
                              <div
                                className="progress-fill h-full"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {skills.filter(skill => skill.type === 'technical').length === 0 && (
                      <div className="text-center py-8">
                        <Code className="w-8 h-8 text-secondary mx-auto mb-2" />
                        <p className="text-secondary text-sm">No technical skills added yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Soft Skills */}
                <div>
                  <h4 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Soft Skills
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {skills.filter(skill => skill.type === 'soft').map((skill) => (
                      <div key={skill.id} className="glass-effect p-3 border-2 border-light dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-300">
                        {editingSkill?.id === skill.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editingSkill.name}
                              onChange={(e) => setEditingSkill(prev => prev ? { ...prev, name: e.target.value } : null)}
                              className="w-full px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={updateSkillItem}
                                disabled={isLoading}
                                className="btn-primary px-3 py-1 text-white rounded text-xs flex items-center gap-1"
                              >
                                <Save className="w-3 h-3" />
                                Save
                              </button>
                              <button
                                onClick={() => setEditingSkill(null)}
                                className="btn-secondary px-3 py-1 rounded text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <span className="text-black dark:text-white text-sm font-bold">{skill.name}</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingSkill(skill)}
                                className="text-black dark:text-white hover:text-secondary dark:hover:text-gray-300 p-1"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteSkillItem(skill.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {skills.filter(skill => skill.type === 'soft').length === 0 && (
                      <div className="text-center py-8">
                        <Target className="w-8 h-8 text-secondary mx-auto mb-2" />
                        <p className="text-secondary text-sm">No soft skills added yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black dark:text-white">Projects Management</h3>
              </div>

              {/* Add New Project */}
              <div className="glass-effect p-4 sm:p-6 border-2 border-black dark:border-white">
                <h4 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Project
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-2">Project Title *</label>
                    <input
                      type="text"
                      value={newProject.title || ''}
                      onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                      placeholder="e.g., Portfolio Website"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-2">Category *</label>
                    <select
                      value={newProject.category || 'Other'}
                      onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value as ProjectCategory }))}
                      className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                    >
                      {PROJECT_CATEGORIES.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-2">GitHub URL *</label>
                    <input
                      type="url"
                      value={newProject.github_url || ''}
                      onChange={(e) => setNewProject(prev => ({ ...prev, github_url: e.target.value }))}
                      className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-2">Live Demo URL</label>
                    <input
                      type="url"
                      value={newProject.live_url || ''}
                      onChange={(e) => setNewProject(prev => ({ ...prev, live_url: e.target.value }))}
                      className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-bold text-black dark:text-white mb-2">Description *</label>
                  <textarea
                    value={newProject.description || ''}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full h-24 px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect resize-none"
                    placeholder="Describe your project..."
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-bold text-black dark:text-white mb-2">Technologies</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newProject.tech?.map((tech, index) => (
                      <span
                        key={index}
                        className="tag px-3 py-1 text-sm flex items-center gap-2"
                      >
                        {tech}
                        <button
                          onClick={() => removeTechTag(tech)}
                          className="text-black dark:text-white hover:text-red-600 dark:hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={handleTechInputKeyPress}
                      className="flex-1 px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                      placeholder="Add technology (press Enter or comma to add)"
                    />
                    <button
                      type="button"
                      onClick={addTechTag}
                      className="btn-secondary px-4 py-3 rounded-lg text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newProject.featured || false}
                      onChange={(e) => setNewProject(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 text-black dark:text-white bg-white dark:bg-gray-800 border-2 border-black dark:border-white rounded focus:ring-black dark:focus:ring-white"
                    />
                    <span className="text-sm font-bold text-black dark:text-white">Featured Project</span>
                  </label>
                </div>
                
                <button
                  onClick={saveProject}
                  disabled={isLoading}
                  className="btn-primary px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  {isLoading ? 'Adding...' : 'Add Project'}
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="glass-effect p-4 sm:p-6 border-2 border-light dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-300">
                    {editingProject?.id === project.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-black dark:text-white mb-2">Title</label>
                            <input
                              type="text"
                              value={editingProject.title}
                              onChange={(e) => setEditingProject(prev => prev ? { ...prev, title: e.target.value } : null)}
                              className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-bold text-black dark:text-white mb-2">Category</label>
                            <select
                              value={editingProject.category}
                              onChange={(e) => setEditingProject(prev => prev ? { ...prev, category: e.target.value as ProjectCategory } : null)}
                              className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                            >
                              {PROJECT_CATEGORIES.map((category) => (
                                <option key={category} value={category}>{category}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-bold text-black dark:text-white mb-2">GitHub URL</label>
                            <input
                              type="url"
                              value={editingProject.github_url}
                              onChange={(e) => setEditingProject(prev => prev ? { ...prev, github_url: e.target.value } : null)}
                              className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-bold text-black dark:text-white mb-2">Live Demo URL</label>
                            <input
                              type="url"
                              value={editingProject.live_url || ''}
                              onChange={(e) => setEditingProject(prev => prev ? { ...prev, live_url: e.target.value } : null)}
                              className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-bold text-black dark:text-white mb-2">Description</label>
                          <textarea
                            value={editingProject.description}
                            onChange={(e) => setEditingProject(prev => prev ? { ...prev, description: e.target.value } : null)}
                            className="w-full h-24 px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect resize-none"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-bold text-black dark:text-white mb-2">Technologies</label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {editingProject.tech.map((tech, index) => (
                              <span
                                key={index}
                                className="tag px-3 py-1 text-sm flex items-center gap-2"
                              >
                                {tech}
                                <button
                                  onClick={() => setEditingProject(prev => prev ? {
                                    ...prev,
                                    tech: prev.tech.filter((_, i) => i !== index)
                                  } : null)}
                                  className="text-black dark:text-white hover:text-red-600 dark:hover:text-red-400"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={editingProject.featured}
                              onChange={(e) => setEditingProject(prev => prev ? { ...prev, featured: e.target.checked } : null)}
                              className="w-4 h-4 text-black dark:text-white bg-white dark:bg-gray-800 border-2 border-black dark:border-white rounded focus:ring-black dark:focus:ring-white"
                            />
                            <span className="text-sm font-bold text-black dark:text-white">Featured Project</span>
                          </label>
                        </div>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={updateProjectItem}
                            disabled={isLoading}
                            className="btn-primary px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingProject(null)}
                            className="btn-secondary px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-3">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                              <h4 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                                <FolderOpen className="w-5 h-5" />
                                {project.title}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {project.featured && (
                                  <span className="featured-badge text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    Featured
                                  </span>
                                )}
                                <span className="text-xs px-3 py-1 rounded-full bg-light-gray dark:bg-gray-700 text-black dark:text-white border border-black dark:border-white font-semibold">
                                  {project.category}
                                </span>
                              </div>
                            </div>
                            <p className="text-secondary mb-4 leading-relaxed text-sm">{project.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tech.map((tech, techIndex) => (
                                <span key={techIndex} className="tag px-2 py-1 text-xs">
                                  {tech}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                              {project.github_url && (
                                <a
                                  href={project.github_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-secondary inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                                >
                                  <Github className="w-3 h-3" />
                                  Code
                                </a>
                              )}
                              
                              {project.live_url && (
                                <a
                                  href={project.live_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-primary inline-flex items-center gap-2 px-3 py-2 text-white rounded-lg text-xs"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Demo
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingProject(project)}
                              className="btn-secondary p-2 rounded-lg flex items-center justify-center text-sm"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProjectItem(project.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-2 rounded-lg border-2 border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {projects.length === 0 && (
                  <div className="text-center py-12">
                    <FolderOpen className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <p className="text-secondary">No projects added yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resume Tab */}
          {activeTab === 'resume' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black dark:text-white">Resume Management</h3>
              </div>

              {/* Current Resume */}
              {resumeFile ? (
                <div className="glass-effect p-4 sm:p-6 border-2 border-black dark:border-white">
                  <h4 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Current Resume
                  </h4>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-black dark:text-white font-semibold mb-2">{resumeFile.filename}</p>
                      <div className="text-sm text-secondary space-y-1">
                        <p>Size: {(resumeFile.file_size / 1024 / 1024).toFixed(2)} MB</p>
                        <p>Uploaded: {new Date(resumeFile.created_at).toLocaleDateString()}</p>
                        <p>Type: {resumeFile.mime_type}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={resumeFile.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm justify-center"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                      <button
                        onClick={handleResumeDelete}
                        disabled={isLoading}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 px-4 py-2 rounded-lg border-2 border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                        {isLoading ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-effect p-4 sm:p-6 border-2 border-light dark:border-gray-700 text-center">
                  <FileText className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <p className="text-secondary mb-4">No resume uploaded yet.</p>
                </div>
              )}

              {/* Upload New Resume */}
              <div className="glass-effect p-4 sm:p-6 border-2 border-black dark:border-white">
                <h4 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  {resumeFile ? 'Replace Resume' : 'Upload Resume'}
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-2">
                      Select PDF File (Max 5MB)
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      disabled={isLoading}
                      className="w-full px-4 py-3 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm border-2 border-black dark:border-white glass-effect disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  {uploadProgress > 0 && (
                    <div>
                      <div className="flex justify-between text-sm text-black dark:text-white mb-2">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="progress-bar h-2">
                        <div
                          className="progress-fill h-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-secondary">
                    <p>• Only PDF files are allowed</p>
                    <p>• Maximum file size: 5MB</p>
                    <p>• {resumeFile ? 'Uploading a new file will replace the current resume' : 'This will be your downloadable resume'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}