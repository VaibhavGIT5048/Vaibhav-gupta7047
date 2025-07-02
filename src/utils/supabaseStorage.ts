import { supabase, Experience, Skill, Project, ResumeFile, About } from '../lib/supabase';

// Experience operations
export const getExperiences = async (): Promise<Experience[]> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching experiences:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getExperiences:', error);
    return [];
  }
};

export const createExperience = async (experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>): Promise<Experience | null> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .insert([experience])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating experience:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createExperience:', error);
    return null;
  }
};

export const updateExperience = async (id: string, updates: Partial<Experience>): Promise<Experience | null> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating experience:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateExperience:', error);
    return null;
  }
};

export const deleteExperience = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting experience:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteExperience:', error);
    return false;
  }
};

// Skills operations
export const getSkills = async (): Promise<Skill[]> => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('type', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getSkills:', error);
    return [];
  }
};

export const createSkill = async (skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>): Promise<Skill | null> => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .insert([skill])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating skill:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createSkill:', error);
    return null;
  }
};

export const updateSkill = async (id: string, updates: Partial<Skill>): Promise<Skill | null> => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating skill:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateSkill:', error);
    return null;
  }
};

export const deleteSkill = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteSkill:', error);
    return false;
  }
};

// Projects operations
export const getProjects = async (): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getProjects:', error);
    return [];
  }
};

export const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createProject:', error);
    return null;
  }
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating project:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateProject:', error);
    return null;
  }
};

export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteProject:', error);
    return false;
  }
};

// About operations
export const getAboutContent = async (): Promise<About | null> => {
  try {
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching about content:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getAboutContent:', error);
    return null;
  }
};

export const updateAboutContent = async (content: string): Promise<About | null> => {
  try {
    // First, try to get existing about content
    const existing = await getAboutContent();
    
    if (existing) {
      // Update existing content
      const { data, error } = await supabase
        .from('about')
        .update({ content })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating about content:', error);
        throw error;
      }
      
      return data;
    } else {
      // Create new content if none exists
      const { data, error } = await supabase
        .from('about')
        .insert([{ content }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating about content:', error);
        throw error;
      }
      
      return data;
    }
  } catch (error) {
    console.error('Error in updateAboutContent:', error);
    return null;
  }
};

// Resume operations
export const getActiveResume = async (): Promise<ResumeFile | null> => {
  try {
    const { data, error } = await supabase
      .from('resume_files')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching active resume:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getActiveResume:', error);
    return null;
  }
};

export const uploadResume = async (file: File): Promise<ResumeFile | null> => {
  try {
    console.log('Starting resume upload process...');
    
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }
    
    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files are allowed');
    }
    
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User not authenticated. Please log in to upload resume.');
    }

    console.log('User authenticated:', user.id);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `resume-${timestamp}-${randomString}.pdf`;
    
    console.log('Uploading file to storage:', fileName);
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'application/pdf'
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    console.log('File uploaded successfully:', uploadData);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);

    console.log('Generated public URL:', publicUrl);

    // First, deactivate all existing resumes for this user
    console.log('Deactivating existing resumes for user...');
    const { error: deactivateError } = await supabase
      .from('resume_files')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (deactivateError) {
      console.warn('Warning: Could not deactivate existing resumes:', deactivateError);
    }

    // Create resume record in database with user_id
    console.log('Creating database record...');
    const { data, error } = await supabase
      .from('resume_files')
      .insert([{
        filename: file.name,
        file_url: publicUrl,
        file_size: file.size,
        mime_type: file.type,
        is_active: true,
        user_id: user.id // Add user_id for RLS
      }])
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      // Try to clean up uploaded file
      await supabase.storage.from('resumes').remove([fileName]);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('Resume upload completed successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in uploadResume:', error);
    throw error;
  }
};

export const deleteResume = async (id: string): Promise<boolean> => {
  try {
    console.log('Starting resume deletion process for ID:', id);
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User not authenticated. Please log in to delete resume.');
    }

    // Get the resume file info first (this will check ownership via RLS)
    const { data: resumeFile, error: fetchError } = await supabase
      .from('resume_files')
      .select('file_url, user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching resume file:', fetchError);
      throw new Error('Resume file not found or access denied.');
    }

    // Verify ownership
    if (resumeFile.user_id !== user.id) {
      throw new Error('Access denied. You can only delete your own resume files.');
    }

    // Extract filename from URL for storage deletion
    const urlParts = resumeFile.file_url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    console.log('Deleting file from storage:', fileName);
    
    if (fileName && fileName !== 'undefined' && fileName.includes('resume-')) {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('resumes')
        .remove([fileName]);
      
      if (storageError) {
        console.warn('Warning: Could not delete file from storage:', storageError);
      } else {
        console.log('File deleted from storage successfully');
      }
    }

    // Delete from database (RLS will ensure user can only delete their own files)
    console.log('Deleting database record...');
    const { error } = await supabase
      .from('resume_files')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting resume record:', error);
      throw error;
    }

    console.log('Resume deletion completed successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteResume:', error);
    throw error;
  }
};

// Health check function
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('count')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};

// Storage bucket check
export const checkStorageBucket = async (): Promise<boolean> => {
  try {
    // Try to list files in the bucket
    const { data, error } = await supabase.storage
      .from('resumes')
      .list('', { limit: 1 });
    
    if (error) {
      console.error('Storage bucket check failed:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Storage bucket check failed:', error);
    return false;
  }
};

// Initialize storage bucket if needed
export const initializeStorageBucket = async (): Promise<boolean> => {
  try {
    // Check if bucket exists by trying to list files
    const { error: listError } = await supabase.storage
      .from('resumes')
      .list('', { limit: 1 });
    
    if (listError) {
      console.log('Storage bucket may not exist, this is normal for new projects');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing storage bucket:', error);
    return false;
  }
};

// Authentication helper for resume operations
export const ensureAuthenticated = async (): Promise<string> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('Authentication required. Please log in to continue.');
  }
  
  return user.id;
};