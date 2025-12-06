// Data models for the application

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'Language' | 'Framework' | 'Tool' | 'Soft Skill' | 'Concept';
  evidence?: string; // e.g., "GitHub: Project X", "Marksheet: 90/100"
}

export interface CareerPath {
  role: string;
  matchScore: number; // 0-100
  salaryRange: string;
  reasoning: string;
  missingSkills: string[];
}

export interface LearningTask {
  day: number;
  title: string;
  description: string;
  duration: string;
  status: 'pending' | 'completed';
}

export interface CVSection {
  title: string;
  content: string[]; // Bullet points
}

export interface UserAnalysis {
  userSummary: string;
  skills: Skill[];
  careerPaths: CareerPath[];
  roadmap: LearningTask[];
  cvSuggestions: CVSection[];
}

export interface UploadedFile {
  file: File;
  type: 'marksheet' | 'certificate' | 'project_screenshot' | 'other';
  previewUrl: string;
}

export interface UserInputs {
  files: UploadedFile[];
  githubUrl: string;
  linkedinUrl: string;
  interests: string;
}
