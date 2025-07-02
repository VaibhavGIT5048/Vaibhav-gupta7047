# Vaibhav Gupta - Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Supabase. Features a clean black and white design with real-time content management capabilities.

🌐 **Live Site**: [https://vaibhav-gupta7047.netlify.app](https://vaibhav-gupta7047.netlify.app)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Frontend Details](#frontend-details)
- [Backend Details](#backend-details)
- [Database Schema](#database-schema)
- [Authentication System](#authentication-system)
- [File Upload System](#file-upload-system)
- [Real-time Updates](#real-time-updates)
- [Deployment](#deployment)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)
- [Performance Optimizations](#performance-optimizations)
- [Mobile Responsiveness](#mobile-responsiveness)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Public Features
- **Responsive Design**: Optimized for all device sizes (mobile, tablet, desktop)
- **Dynamic About Section**: Content managed through admin panel
- **Experience Showcase**: Professional and leadership experiences
- **Skills Display**: Technical skills with progress bars and soft skills
- **Project Portfolio**: Featured projects with GitHub and live demo links
- **Resume Download**: PDF resume download functionality
- **Real-time Updates**: Content updates reflect immediately
- **Clean UI/UX**: Black and white theme with smooth animations

### Admin Features
- **Secure Authentication**: Password-protected admin access
- **Content Management**: Full CRUD operations for all content
- **About Content Editor**: Rich text editing for about section
- **Experience Management**: Add/edit professional and leadership roles
- **Skills Management**: Manage technical and soft skills with levels
- **Project Management**: Portfolio project management with featured highlighting
- **Resume Management**: Upload, download, and delete PDF resumes
- **Real-time Preview**: Changes reflect immediately on the live site

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **Animations**: Framer Motion 11.0.8
- **Icons**: Lucide React 0.344.0
- **Intersection Observer**: React Intersection Observer 9.8.1
- **State Management**: React Hooks (useState, useEffect)

### Backend & Database
- **Backend-as-a-Service**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

### Development Tools
- **Linting**: ESLint 9.9.1 with TypeScript support
- **Type Checking**: TypeScript 5.5.3
- **CSS Processing**: PostCSS 8.4.35 + Autoprefixer 10.4.18

### Deployment
- **Hosting**: Netlify
- **Domain**: vaibhav-gupta7047.netlify.app
- **CI/CD**: Automated deployment from Git

## 🏗 Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   Netlify       │
│   (React/TS)    │◄──►│   (Backend)     │    │   (Hosting)     │
│                 │    │                 │    │                 │
│ • Components    │    │ • PostgreSQL    │    │ • Static Site   │
│ • State Mgmt    │    │ • Auth System   │    │ • CDN           │
│ • Animations    │    │ • File Storage  │    │ • SSL/HTTPS     │
│ • Responsive    │    │ • Real-time     │    │ • Custom Domain │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎨 Frontend Details

### Component Structure
```
src/
├── components/
│   ├── AdminPanel.tsx          # Admin content management interface
│   ├── AuthModal.tsx           # Authentication modal
│   ├── Contact.tsx             # Contact section
│   ├── Experience.tsx          # Experience showcase
│   ├── FloatingAdminButton.tsx # Admin access button
│   ├── Hero.tsx                # Hero section with about content
│   ├── Navbar.tsx              # Navigation with resume download
│   ├── Projects.tsx            # Project portfolio
│   └── Skills.tsx              # Skills display
├── lib/
│   └── supabase.ts             # Supabase client and types
├── utils/
│   ├── auth.ts                 # Authentication utilities
│   └── supabaseStorage.ts      # Database operations
├── App.tsx                     # Main application component
├── main.tsx                    # Application entry point
└── index.css                   # Global styles and theme
```

### Key Frontend Features

#### 1. Responsive Design System
- **Breakpoints**: Mobile-first approach with sm, md, lg, xl breakpoints
- **Grid System**: CSS Grid and Flexbox for layouts
- **Typography**: Responsive font sizes and line heights
- **Spacing**: Consistent 8px spacing system

#### 2. Animation System
- **Framer Motion**: Smooth page transitions and micro-interactions
- **Intersection Observer**: Scroll-triggered animations
- **Hover Effects**: Interactive button and card hover states
- **Loading States**: Skeleton loading and spinners

#### 3. State Management
- **Local State**: React hooks for component state
- **Global Events**: Custom events for cross-component communication
- **Real-time Sync**: Automatic data synchronization with backend

#### 4. Theme System
- **Color Palette**: Pure black and white with gray accents
- **CSS Variables**: Consistent color and spacing tokens
- **Dark/Light**: Optimized for light theme with high contrast
- **Accessibility**: WCAG compliant color ratios

## 🗄 Backend Details

### Supabase Configuration
- **Project URL**: Configured via environment variables
- **API Keys**: Anon key for public access, service role for admin
- **Region**: Optimized for global access
- **Realtime**: Enabled for live data synchronization

### Database Operations

#### CRUD Operations
```typescript
// Experience Operations
getExperiences(): Promise<Experience[]>
createExperience(data): Promise<Experience>
updateExperience(id, data): Promise<Experience>
deleteExperience(id): Promise<boolean>

// Skills Operations
getSkills(): Promise<Skill[]>
createSkill(data): Promise<Skill>
updateSkill(id, data): Promise<Skill>
deleteSkill(id): Promise<boolean>

// Projects Operations
getProjects(): Promise<Project[]>
createProject(data): Promise<Project>
updateProject(id, data): Promise<Project>
deleteProject(id): Promise<boolean>

// About Operations
getAboutContent(): Promise<About>
updateAboutContent(content): Promise<About>

// Resume Operations
getActiveResume(): Promise<ResumeFile>
uploadResume(file): Promise<ResumeFile>
deleteResume(id): Promise<boolean>
```

## 🗃 Database Schema

### Tables Overview

#### 1. `experiences`
```sql
CREATE TABLE experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  organization text NOT NULL,
  period text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('professional', 'leadership')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### 2. `skills`
```sql
CREATE TABLE skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  level integer NOT NULL DEFAULT 0 CHECK (level >= 0 AND level <= 100),
  type text NOT NULL CHECK (type IN ('technical', 'soft')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### 3. `projects`
```sql
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image text DEFAULT '',
  github_url text NOT NULL,
  live_url text,
  tech text[] NOT NULL DEFAULT '{}',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### 4. `resume_files`
```sql
CREATE TABLE resume_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  file_url text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  is_active boolean DEFAULT true,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### 5. `about`
```sql
CREATE TABLE about (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  updated_at timestamptz DEFAULT now()
);
```

### Row Level Security (RLS)

#### Public Access Policies
```sql
-- Allow public read access to active content
CREATE POLICY "Public can read experiences" ON experiences FOR SELECT TO public USING (true);
CREATE POLICY "Public can read skills" ON skills FOR SELECT TO public USING (true);
CREATE POLICY "Public can read projects" ON projects FOR SELECT TO public USING (true);
CREATE POLICY "Public can read active resumes" ON resume_files FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Public can read about content" ON about FOR SELECT TO public USING (true);
```

#### Admin Access Policies
```sql
-- Allow authenticated users full CRUD access
CREATE POLICY "Authenticated can manage experiences" ON experiences FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated can manage skills" ON skills FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated can manage projects" ON projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can manage their resume files" ON resume_files FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Authenticated can manage about content" ON about FOR ALL TO authenticated USING (true);
```

### Database Triggers
```sql
-- Auto-update timestamps
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resume_files_updated_at BEFORE UPDATE ON resume_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_updated_at BEFORE UPDATE ON about FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🔐 Authentication System

### Authentication Flow
1. **Admin Access**: Password-based authentication
2. **Supabase Auth**: Email/password sign-in with Supabase
3. **Session Management**: Local storage with expiration
4. **Auto-refresh**: Automatic session renewal

### Security Features
- **Password Protection**: Admin panel protected by password
- **Session Expiry**: 24-hour session timeout
- **Secure Storage**: Encrypted session data
- **HTTPS Only**: All communications over HTTPS

### Authentication Implementation
```typescript
// Authentication utilities
export const authenticate = async (password: string): Promise<boolean>
export const isAuthenticated = (): boolean
export const logout = async (): Promise<void>
export const refreshSupabaseSession = async (): Promise<boolean>
```

## 📁 File Upload System

### Storage Configuration
- **Bucket**: `resumes` bucket in Supabase Storage
- **File Types**: PDF only
- **Size Limit**: 5MB maximum
- **Access**: Public read, authenticated write/delete

### Upload Process
1. **File Validation**: Type and size checking
2. **Authentication**: User must be authenticated
3. **Storage Upload**: File uploaded to Supabase Storage
4. **Database Record**: Metadata stored in database
5. **Cleanup**: Old files automatically replaced

### Storage Policies
```sql
-- Public read access to resume files
CREATE POLICY "Public can view resume files" ON storage.objects FOR SELECT TO public USING (bucket_id = 'resumes');

-- Authenticated users can manage resume files
CREATE POLICY "Authenticated users can upload resume files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "Authenticated users can delete their resume files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resumes');
```

## ⚡ Real-time Updates

### Supabase Realtime
- **Live Sync**: Changes reflect immediately across all clients
- **Event Handling**: Custom event listeners for data updates
- **Optimistic Updates**: UI updates before server confirmation

### Implementation
```typescript
// Real-time subscription setup
const subscription = subscribeToTable('experiences', (payload) => {
  console.log('Real-time update received:', payload);
  loadExperiences(); // Reload data when changes occur
});

// Cleanup subscription
unsubscribeFromTable(subscription);
```

## 🚀 Deployment

### Netlify Configuration
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18.x
- **Environment Variables**: Supabase credentials

### Build Process
1. **Install Dependencies**: `npm install`
2. **Type Checking**: TypeScript compilation
3. **Build**: Vite production build
4. **Deploy**: Automatic deployment to Netlify CDN

### Performance Optimizations
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and CSS optimization
- **CDN**: Global content delivery network

## 🏁 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Supabase account and project

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd vaibhav-portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔧 Environment Variables

### Required Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup
1. Create a new Supabase project
2. Run the provided SQL migrations
3. Set up storage bucket for resumes
4. Configure RLS policies
5. Get your project URL and anon key

## 📚 API Documentation

### Frontend API Calls

#### Experience Management
```typescript
// Get all experiences
const experiences = await getExperiences();

// Create new experience
const newExperience = await createExperience({
  role: "Software Engineer",
  organization: "Tech Company",
  period: "Jan 2023 - Present",
  location: "Remote",
  description: "Working on amazing projects",
  type: "professional"
});

// Update experience
const updated = await updateExperience(id, updateData);

// Delete experience
const success = await deleteExperience(id);
```

#### Skills Management
```typescript
// Get all skills
const skills = await getSkills();

// Create technical skill
const newSkill = await createSkill({
  name: "React",
  level: 90,
  type: "technical"
});

// Create soft skill
const softSkill = await createSkill({
  name: "Leadership",
  level: 0, // Not used for soft skills
  type: "soft"
});
```

#### Project Management
```typescript
// Get all projects
const projects = await getProjects();

// Create new project
const newProject = await createProject({
  title: "Portfolio Website",
  description: "Personal portfolio built with React",
  github_url: "https://github.com/user/repo",
  live_url: "https://example.com",
  tech: ["React", "TypeScript", "Tailwind"],
  featured: true
});
```

#### Resume Management
```typescript
// Get active resume
const resume = await getActiveResume();

// Upload new resume
const uploadedResume = await uploadResume(file);

// Delete resume
const success = await deleteResume(resumeId);
```

#### About Content Management
```typescript
// Get about content
const about = await getAboutContent();

// Update about content
const updated = await updateAboutContent("New about content...");
```

## 🔒 Security Features

### Data Protection
- **Input Validation**: All user inputs validated and sanitized
- **SQL Injection Prevention**: Parameterized queries via Supabase
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: SameSite cookies and HTTPS

### Access Control
- **Authentication Required**: Admin functions require authentication
- **Row Level Security**: Database-level access control
- **File Upload Security**: Type and size validation
- **Session Management**: Secure session handling

### Privacy
- **No Tracking**: No third-party analytics or tracking
- **Minimal Data**: Only necessary data collected
- **Secure Storage**: All data encrypted at rest
- **HTTPS Only**: All communications encrypted

## ⚡ Performance Optimizations

### Frontend Optimizations
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Responsive images with proper sizing
- **Code Splitting**: Route-based code splitting
- **Memoization**: React.memo for expensive components

### Backend Optimizations
- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: Supabase built-in caching
- **CDN**: Global content delivery
- **Compression**: Gzip compression enabled

### Loading Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 📱 Mobile Responsiveness

### Breakpoint System
```css
/* Mobile First Approach */
.container {
  padding: 1rem;           /* Mobile: 16px */
}

@media (min-width: 640px) {
  .container {
    padding: 1.5rem;       /* Tablet: 24px */
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 2rem;         /* Desktop: 32px */
  }
}
```

### Mobile Features
- **Touch Optimized**: 44px minimum touch targets
- **Swipe Gestures**: Natural mobile interactions
- **Responsive Typography**: Fluid font scaling
- **Mobile Navigation**: Hamburger menu for small screens

### Testing
- **Device Testing**: Tested on iOS and Android devices
- **Browser Testing**: Chrome, Safari, Firefox, Edge
- **Screen Sizes**: 320px to 2560px width
- **Orientation**: Portrait and landscape support

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with TypeScript rules
- **Prettier**: Code formatting (if configured)
- **Conventional Commits**: Standardized commit messages

### Testing Guidelines
- Test on multiple devices and browsers
- Verify responsive design
- Check accessibility compliance
- Test admin panel functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Vaibhav Gupta**
- Email: vwork825@gmail.com
- LinkedIn: [vaibhav-gupta-4a11b0288](https://www.linkedin.com/in/vaibhav-gupta-4a11b0288/)
- GitHub: [VaibhavGIT5048](https://github.com/VaibhavGIT5048)
- Portfolio: [vaibhav-gupta7047.netlify.app](https://vaibhav-gupta7047.netlify.app)

---

**Built with ❤️ using React, TypeScript, and Supabase**