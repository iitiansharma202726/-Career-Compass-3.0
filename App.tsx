import React, { useState } from 'react';
import { UploadedFile, UserAnalysis, UserInputs } from './types';
import { analyzeProfile } from './services/geminiService';
import FileUpload from './components/FileUpload';
import SkillRadar from './components/SkillRadar';
import Roadmap from './components/Roadmap';
import { 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  Github, 
  Linkedin, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  TrendingUp,
  Map,
  BookOpen
} from 'lucide-react';

// Default state for demonstration or fallback
const DEFAULT_INPUTS: UserInputs = {
  files: [],
  githubUrl: '',
  linkedinUrl: '',
  interests: ''
};

const App: React.FC = () => {
  const [step, setStep] = useState<'onboarding' | 'processing' | 'dashboard'>('onboarding');
  const [inputs, setInputs] = useState<UserInputs>(DEFAULT_INPUTS);
  const [analysis, setAnalysis] = useState<UserAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'cv'>('overview');
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (inputs.files.length === 0 && !inputs.githubUrl && !inputs.interests) {
      setError("Please provide at least one file, link, or interest.");
      return;
    }

    setStep('processing');
    setError(null);

    try {
      const result = await analyzeProfile(inputs.files, inputs.githubUrl, inputs.linkedinUrl, inputs.interests);
      setAnalysis(result);
      setStep('dashboard');
    } catch (err) {
      console.error(err);
      setError("Failed to analyze profile. Please try again later or check your API key.");
      setStep('onboarding');
    }
  };

  const renderOnboarding = () => (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
          Career Compass <span className="text-blue-500">3.0</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Your multimodal career co-pilot. Drop your marksheets, code, and certificates. 
          We'll build your skill graph and tell you exactly what to do next.
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden transform transition-all hover:shadow-2xl hover:border-slate-700/50">
        <div className="p-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x"></div>
        <div className="p-8 space-y-8">
          
          {/* Section 1: Files */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center text-sm font-bold border border-blue-800 shadow-sm shadow-blue-900/50">1</span>
              Upload Evidence
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Marksheets (PDF/Img), Project Screenshots, Certificates.
            </p>
            <FileUpload 
              files={inputs.files} 
              onFilesChange={(files) => setInputs(prev => ({ ...prev, files }))} 
            />
          </div>

          <div className="border-t border-slate-800"></div>

          {/* Section 2: Links */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-purple-900/50 text-purple-400 flex items-center justify-center text-sm font-bold border border-purple-800 shadow-sm shadow-purple-900/50">2</span>
              Digital Footprint
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative group">
                <Github className="absolute left-3 top-3 text-slate-500 group-hover:text-white transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="GitHub Profile URL"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 text-slate-100 rounded-lg border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 placeholder-slate-500 hover:border-slate-600 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] focus:bg-slate-800"
                  value={inputs.githubUrl}
                  onChange={(e) => setInputs(prev => ({ ...prev, githubUrl: e.target.value }))}
                />
              </div>
              <div className="relative group">
                <Linkedin className="absolute left-3 top-3 text-slate-500 group-hover:text-blue-400 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="LinkedIn Profile URL"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 text-slate-100 rounded-lg border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 placeholder-slate-500 hover:border-slate-600 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] focus:bg-slate-800"
                  value={inputs.linkedinUrl}
                  onChange={(e) => setInputs(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800"></div>

          {/* Section 3: Interests */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-pink-900/50 text-pink-400 flex items-center justify-center text-sm font-bold border border-pink-800 shadow-sm shadow-pink-900/50">3</span>
              Preferences
            </h3>
            <textarea
              placeholder="E.g., I love data and math, but I don't want to be a pure software engineer. I prefer remote work."
              className="w-full p-4 bg-slate-800 text-slate-100 rounded-lg border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 h-24 resize-none placeholder-slate-500 hover:border-slate-600 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] focus:bg-slate-800"
              value={inputs.interests}
              onChange={(e) => setInputs(prev => ({ ...prev, interests: e.target.value }))}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-900/30 border border-red-800 text-red-300 text-sm rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            className="w-full bg-white hover:bg-blue-50 text-slate-900 font-bold py-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform active:scale-[0.98] hover:-translate-y-1 flex items-center justify-center gap-2 text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white"
          >
            <Sparkles size={20} className="text-blue-600 animate-pulse" />
            Analyze My Profile with Gemini 3.0
          </button>

        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        <Sparkles className="absolute inset-0 m-auto text-blue-500 animate-pulse" size={32} />
      </div>
      <h2 className="text-2xl font-bold text-slate-100 mb-2">Analyzing your digital DNA...</h2>
      <div className="space-y-2 text-slate-500 animate-pulse">
        <p>Reading marksheets...</p>
        <p>Parsing GitHub repositories...</p>
        <p>Calculating career match scores...</p>
      </div>
    </div>
  );

  const renderDashboard = () => {
    if (!analysis) return null;

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        {/* Navbar */}
        <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-md backdrop-blur-sm bg-slate-900/90">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3 group-hover:shadow-blue-500/40">CC</div>
            <span className="font-bold text-white hidden sm:inline tracking-tight group-hover:text-blue-200 transition-colors">Career Compass 3.0</span>
          </div>
          <nav className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['overview', 'roadmap', 'cv'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  activeTab === tab 
                    ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700 scale-105' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
          <button 
            onClick={() => setStep('onboarding')} 
            className="text-sm font-medium text-slate-400 hover:text-white transition-all duration-300 hover:underline underline-offset-4 decoration-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-2 py-1"
          >
            New Profile
          </button>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto p-6">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Summary & Skill Graph */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 hover:border-slate-700 transition-colors duration-300">
                  <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-500" />
                    Skill Profile
                  </h2>
                  {/* Replaced scale with drop-shadow to avoid text blur on some browsers */}
                  <div className="-ml-4 transition-all duration-500 hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                   <SkillRadar skills={analysis.skills} />
                  </div>
                  <div className="mt-4 p-4 bg-slate-800 rounded-xl text-sm text-slate-300 leading-relaxed border border-slate-700 hover:border-slate-600 transition-colors hover:shadow-inner">
                    <span className="font-semibold text-blue-400">AI Summary: </span>
                    {analysis.userSummary}
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 hover:border-slate-700 transition-colors duration-300">
                   <h3 className="font-bold text-slate-100 mb-4">Top Skills Detected</h3>
                   <div className="flex flex-wrap gap-2">
                      {analysis.skills.sort((a,b) => b.level - a.level).slice(0, 6).map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-900/40 text-blue-300 rounded-full text-xs font-medium border border-blue-800/50 hover:bg-blue-800/60 hover:border-blue-700 hover:shadow-[0_0_10px_rgba(37,99,235,0.2)] transition-all cursor-default">
                          {skill.name} ({skill.level}%)
                        </span>
                      ))}
                   </div>
                </div>
              </div>

              {/* Career Matches */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                  <Briefcase className="text-purple-500" />
                  Recommended Roles
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {analysis.careerPaths.map((path, idx) => (
                    <div key={idx} className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110 group-hover:rotate-6">
                         <Briefcase size={80} className="text-slate-400 transform rotate-12" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-100 group-hover:text-blue-200 transition-colors">{path.role}</h3>
                            <p className="text-sm font-medium text-green-400 mt-1">{path.salaryRange} / yr (est)</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`text-2xl font-bold ${path.matchScore > 75 ? 'text-green-500' : 'text-yellow-500'}`}>
                              {path.matchScore}%
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold group-hover:text-slate-400">Match</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                          {path.reasoning}
                        </p>

                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Missing Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {path.missingSkills.map((ms, i) => (
                              <span key={i} className="px-2 py-1 bg-red-900/20 text-red-400 border border-red-900/30 rounded text-xs">
                                {ms}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => setActiveTab('roadmap')}
                          className="mt-6 w-full py-2 bg-slate-800 hover:bg-blue-900/30 text-slate-300 hover:text-blue-400 font-medium text-sm rounded-lg transition-all duration-300 border border-slate-700 hover:border-blue-500/50 flex items-center justify-center gap-2 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          View Roadmap <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
             <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-8">
                 <div className="mb-8">
                   <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                     <Map className="text-green-500" />
                     Your 5-Day Action Plan
                   </h2>
                   <p className="text-slate-400 mt-2">
                     Based on your gaps for <strong className="text-slate-200">{analysis.careerPaths[0].role}</strong>, here is your immediate learning schedule.
                   </p>
                 </div>
                 <Roadmap tasks={analysis.roadmap} />
               </div>
             </div>
          )}

          {activeTab === 'cv' && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white text-slate-900 rounded-none shadow-md border border-slate-200 min-h-[800px] p-10 md:p-16 relative">
                 {/* Paper fold effect */}
                 <div className="absolute top-0 right-0 border-t-[30px] border-r-[30px] border-t-slate-100 border-r-slate-200 shadow-sm"></div>

                 {/* CV Preview - Stays light because it represents a document */}
                 <div className="mb-8 border-b pb-4">
                    <h1 className="text-3xl font-serif text-slate-900 font-bold mb-2">Your Name</h1>
                    <p className="text-sm text-slate-500">{inputs.linkedinUrl || "linkedin.com/in/yourprofile"} • {inputs.githubUrl || "github.com/yourname"}</p>
                 </div>

                 <div className="space-y-6">
                   {analysis.cvSuggestions.map((section, idx) => (
                     <div key={idx}>
                       <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 mb-3 pb-1">
                         {section.title}
                       </h3>
                       <ul className="list-disc list-outside ml-4 space-y-2">
                         {section.content.map((point, i) => (
                           <li key={i} className="text-sm text-slate-700 leading-relaxed">
                             {point}
                           </li>
                         ))}
                       </ul>
                     </div>
                   ))}
                   
                   {!analysis.cvSuggestions.some(s => s.title.toLowerCase().includes('education')) && (
                     <div>
                       <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 mb-3 pb-1">
                         Education
                       </h3>
                       <p className="text-sm text-slate-700">University Name, Degree (Inferred from your marksheets)</p>
                     </div>
                   )}
                 </div>
              </div>
              
              <div className="space-y-4">
                 <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg border border-blue-500 transform hover:scale-105 transition-transform duration-300 hover:shadow-blue-900/50">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <Sparkles size={18} /> AI Enhancement
                    </h3>
                    <p className="text-sm text-blue-100 leading-relaxed">
                      Gemini rewrote your project descriptions to focus on <strong>impact</strong> and <strong>technologies</strong> rather than just implementation details.
                    </p>
                 </div>
                 <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800">
                    <h4 className="font-bold text-slate-100 mb-2">Export Options</h4>
                    <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-200 mb-2 border border-slate-700 hover:border-slate-500 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      Download PDF
                    </button>
                    <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-200 border border-slate-700 hover:border-slate-500 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      Copy Markdown
                    </button>
                 </div>
              </div>
            </div>
          )}

        </main>
      </div>
    );
  };

  return (
    <div className="bg-slate-950 min-h-screen font-sans text-slate-100 selection:bg-blue-500/30 selection:text-blue-100">
      {step === 'onboarding' && renderOnboarding()}
      {step === 'processing' && renderProcessing()}
      {step === 'dashboard' && renderDashboard()}
    </div>
  );
};

export default App;