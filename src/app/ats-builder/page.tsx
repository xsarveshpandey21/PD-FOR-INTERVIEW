"use client";

import { useState } from "react";
import { Download, Plus, Trash2, FileText, Sparkles, User, Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Code, Loader2 } from "lucide-react";

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  dates: string;
  bullets: string;
}

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  dates: string;
  grade: string;
}

interface ProjectItem {
  id: string;
  title: string;
  tech: string;
  description: string;
}

export default function AtsResumeBuilderPage() {
  // Target Role for ATS Polish
  const [targetRole, setTargetRole] = useState("Software Developer");

  // Contact Info
  const [fullName, setFullName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex.johnson@email.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [location, setLocation] = useState("New Delhi, India");
  const [linkedin, setLinkedin] = useState("linkedin.com/in/alexjohnson");
  const [github, setGithub] = useState("github.com/alexjohnson");

  // Summary
  const [summary, setSummary] = useState(
    "Results-driven Computer Science graduate with strong foundational knowledge in full-stack web development, data structures, and relational databases. Eager to contribute to scalable tech solutions in a dynamic software engineering role."
  );

  // Skills
  const [skills, setSkills] = useState(
    "React.js, Next.js, Node.js, Express, TypeScript, Python, SQL, PostgreSQL, MongoDB, Git, Data Structures & Algorithms, REST APIs"
  );

  // Experience List
  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    {
      id: "1",
      title: "Software Developer Intern",
      company: "TechSolutions Pvt Ltd",
      dates: "May 2024 - Aug 2024",
      bullets:
        "Developed responsive user interfaces using React and Tailwind CSS.\nOptimized backend REST API endpoints, reducing response latency by 25%.\nCollaborated with cross-functional teams using Git and Agile methodologies.",
    },
  ]);

  // Education List
  const [educations, setEducations] = useState<EducationItem[]>([
    {
      id: "1",
      degree: "B.Tech in Computer Science & Engineering",
      institution: "S R Group of Institutions, Lucknow",
      dates: "2021 - 2025",
      grade: "CGPA: 8.8 / 10.0",
    },
  ]);

  // Projects List
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: "1",
      title: "Placement Assessment & ATS Platform",
      tech: "Next.js, React, Node.js, Prisma, SQLite, Tailwind CSS",
      description:
        "Built a full-stack assessment portal featuring student approval gating, timed MCQ test engine, Excel data export, and single-column ATS resume builder.",
    },
  ]);

  // Loading States for AI Polish
  const [enhancingSummary, setEnhancingSummary] = useState(false);
  const [enhancingProjId, setEnhancingProjId] = useState<string | null>(null);
  const [enhancingExpId, setEnhancingExpId] = useState<string | null>(null);

  // AI Enhancement Call
  const handleEnhanceSummary = async () => {
    if (!summary.trim()) return;
    setEnhancingSummary(true);
    try {
      const res = await fetch("/api/ai/enhance-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "Career Objective Summary", text: summary, targetRole }),
      });
      const data = await res.json();
      if (data.enhancedText) setSummary(data.enhancedText);
    } catch (e) {
      console.error(e);
    } finally {
      setEnhancingSummary(false);
    }
  };

  const handleEnhanceProject = async (projId: string, currentDesc: string) => {
    if (!currentDesc.trim()) return;
    setEnhancingProjId(projId);
    try {
      const res = await fetch("/api/ai/enhance-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "Project Description", text: currentDesc, targetRole }),
      });
      const data = await res.json();
      if (data.enhancedText) updateProject(projId, "description", data.enhancedText);
    } catch (e) {
      console.error(e);
    } finally {
      setEnhancingProjId(null);
    }
  };

  const handleEnhanceExperience = async (expId: string, currentBullets: string) => {
    if (!currentBullets.trim()) return;
    setEnhancingExpId(expId);
    try {
      const res = await fetch("/api/ai/enhance-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "Work Experience Highlights", text: currentBullets, targetRole }),
      });
      const data = await res.json();
      if (data.enhancedText) updateExperience(expId, "bullets", data.enhancedText);
    } catch (e) {
      console.error(e);
    } finally {
      setEnhancingExpId(null);
    }
  };

  // Experience handlers
  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      { id: Date.now().toString(), title: "", company: "", dates: "", bullets: "" },
    ]);
  };

  const removeExperience = (id: string) => {
    setExperiences((prev) => prev.filter((item) => item.id !== id));
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: string) => {
    setExperiences((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Education handlers
  const addEducation = () => {
    setEducations((prev) => [
      ...prev,
      { id: Date.now().toString(), degree: "", institution: "", dates: "", grade: "" },
    ]);
  };

  const removeEducation = (id: string) => {
    setEducations((prev) => prev.filter((item) => item.id !== id));
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    setEducations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Project handlers
  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      { id: Date.now().toString(), title: "", tech: "", description: "" },
    ]);
  };

  const removeProject = (id: string) => {
    setProjects((prev) => prev.filter((item) => item.id !== id));
  };

  const updateProject = (id: string, field: keyof ProjectItem, value: string) => {
    setProjects((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Download PDF / Print trigger
  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mx-auto max-w-7xl mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Module 01 • Open Access</span>
          </div>
          <h1 className="text-3xl font-black text-white sm:text-4xl mt-1">
            ATS Resume Generator
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Create single-column, ATS-compliant resumes with AI wording polish and instant PDF export.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDownloadPdf}
          className="inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all shrink-0 no-print"
        >
          <Download className="h-4 w-4" />
          <span>Download as PDF</span>
        </button>
      </div>

      {/* Main Grid: Form on Left, Live Preview on Right */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Input Form Controls (Hidden during print) */}
        <div className="lg:col-span-6 space-y-6 no-print">
          
          {/* Target Placement Role Selector for AI Optimization */}
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-300">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Target Role for AI Keyword Polish:</span>
            </div>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="rounded-xl border border-emerald-500/40 bg-[#0e1726] px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="Software Developer">Software Developer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Web Developer">Web Developer</option>
              <option value="Core Electronics Engineer">Core Electronics Engineer</option>
              <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
            </select>
          </div>

          {/* Section 1: Contact Info */}
          <div className="rounded-3xl border border-slate-800 bg-[#0e1726]/90 p-6 space-y-4 shadow-xl backdrop-blur-xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <User className="h-4 w-4 text-emerald-400" />
              <span>Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-[#141d2e] px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-[#141d2e] px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-[#141d2e] px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-[#141d2e] px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-[#141d2e] px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">GitHub / Portfolio</label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-[#141d2e] px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Professional Summary */}
          <div className="rounded-3xl border border-slate-800 bg-[#0e1726]/90 p-6 space-y-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <FileText className="h-4 w-4 text-emerald-400" />
                <span>Career Objective Summary</span>
              </h3>
              <button
                onClick={handleEnhanceSummary}
                disabled={enhancingSummary}
                className="inline-flex items-center space-x-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/60 px-2.5 py-1 text-xs font-bold text-emerald-300 hover:bg-emerald-900/60 transition-all disabled:opacity-50"
              >
                {enhancingSummary ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-emerald-400" />}
                <span>AI Polish & Enhance</span>
              </button>

            </div>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-[#141d2e] p-3 text-xs text-white leading-relaxed focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Section 3: Technical Skills */}
          <div className="rounded-3xl border border-slate-800 bg-[#0e1726]/90 p-6 space-y-4 shadow-xl backdrop-blur-xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Code className="h-4 w-4 text-emerald-400" />
              <span>Skills (Comma-Separated)</span>
            </h3>
            <textarea
              rows={2}
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. JavaScript, Python, React, SQL, Data Structures"
              className="w-full rounded-xl border border-slate-800 bg-[#141d2e] p-3 text-xs text-white leading-relaxed focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Section 4: Experience */}
          <div className="rounded-3xl border border-slate-800 bg-[#0e1726]/90 p-6 space-y-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-emerald-400" />
                <span>Work Experience</span>
              </h3>
              <button
                onClick={addExperience}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Experience</span>
              </button>
            </div>

            {experiences.map((exp) => (
              <div key={exp.id} className="rounded-2xl border border-slate-800 bg-[#141d2e] p-4 space-y-3 relative">
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-3 right-3 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                  <input
                    type="text"
                    placeholder="Job Title (e.g. Software Developer Intern)"
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                    className="rounded-xl border border-slate-800 bg-[#0e1726] px-3 py-1.5 text-xs text-white focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                    className="rounded-xl border border-slate-800 bg-[#0e1726] px-3 py-1.5 text-xs text-white focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Dates (e.g. May 2024 - Present)"
                    value={exp.dates}
                    onChange={(e) => updateExperience(exp.id, "dates", e.target.value)}
                    className="sm:col-span-2 rounded-xl border border-slate-800 bg-[#0e1726] px-3 py-1.5 text-xs text-white focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">Bullet points (one per line):</span>
                    <button
                      onClick={() => handleEnhanceExperience(exp.id, exp.bullets)}
                      disabled={enhancingExpId === exp.id}
                      className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
                    >
                      {enhancingExpId === exp.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                      <span>AI Polish Bullets</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Bullet points"
                    value={exp.bullets}
                    onChange={(e) => updateExperience(exp.id, "bullets", e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-[#0e1726] p-2.5 text-xs text-white focus:border-emerald-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Section 5: Education */}
          <div className="rounded-3xl border border-slate-800 bg-[#0e1726]/90 p-6 space-y-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <GraduationCap className="h-4 w-4 text-emerald-400" />
                <span>Education</span>
              </h3>
              <button
                onClick={addEducation}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Education</span>
              </button>
            </div>

            {educations.map((edu) => (
              <div key={edu.id} className="rounded-2xl border border-slate-800 bg-[#141d2e] p-4 space-y-3 relative">
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-3 right-3 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                  <input
                    type="text"
                    placeholder="Degree (e.g. B.Tech in CSE)"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                    className="rounded-xl border border-slate-800 bg-[#0e1726] px-3 py-1.5 text-xs text-white focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                    className="rounded-xl border border-slate-800 bg-[#0e1726] px-3 py-1.5 text-xs text-white focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Dates (e.g. 2021 - 2025)"
                    value={edu.dates}
                    onChange={(e) => updateEducation(edu.id, "dates", e.target.value)}
                    className="rounded-xl border border-slate-800 bg-[#0e1726] px-3 py-1.5 text-xs text-white focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Grade / CGPA (e.g. CGPA: 8.8)"
                    value={edu.grade}
                    onChange={(e) => updateEducation(edu.id, "grade", e.target.value)}
                    className="rounded-xl border border-slate-800 bg-[#0e1726] px-3 py-1.5 text-xs text-white focus:border-emerald-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Section 6: Projects */}
          <div className="rounded-3xl border border-slate-800 bg-[#0e1726]/90 p-6 space-y-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Code className="h-4 w-4 text-emerald-400" />
                <span>Key Projects</span>
              </h3>
              <button
                onClick={addProject}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            {projects.map((proj) => (
              <div key={proj.id} className="rounded-2xl border border-slate-800 bg-[#141d2e] p-4 space-y-3 relative">
                <button
                  onClick={() => removeProject(proj.id)}
                  className="absolute top-3 right-3 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={proj.title}
                    onChange={(e) => updateProject(proj.id, "title", e.target.value)}
                    className="rounded-xl border border-slate-800 bg-[#0e1726] px-3 py-1.5 text-xs text-white focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Technologies Used"
                    value={proj.tech}
                    onChange={(e) => updateProject(proj.id, "tech", e.target.value)}
                    className="rounded-xl border border-slate-800 bg-[#0e1726] px-3 py-1.5 text-xs text-white focus:border-emerald-500"
                  />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">Description:</span>
                    <button
                      onClick={() => handleEnhanceProject(proj.id, proj.description)}
                      disabled={enhancingProjId === proj.id}
                      className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
                    >
                      {enhancingProjId === proj.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                      <span>AI Polish Description</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Project Description"
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-[#0e1726] p-2.5 text-xs text-white focus:border-emerald-500"
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: Live ATS-Parsable Resume Preview Panel */}
        <div className="lg:col-span-6 sticky top-20">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between no-print">
            <span>Live ATS Resume Preview (Single-Column)</span>
            <span className="text-[10px] text-emerald-400 font-mono">Clean ATS Format • No Graphics</span>
          </div>

          {/* Clean White Paper Single-Column Resume Document */}
          <div
            id="ats-resume-document"
            className="w-full bg-white text-slate-900 font-sans p-8 sm:p-10 shadow-2xl rounded-xl border border-slate-200 min-h-[700px] text-left leading-relaxed font-serif"
            style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
          >
            {/* Header: Name & Contact */}
            <div className="text-center border-b border-slate-300 pb-4 mb-5">
              <h1 className="text-2xl font-bold uppercase tracking-wide text-slate-900">
                {fullName || "YOUR NAME"}
              </h1>
              <div className="text-xs text-slate-700 mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                {phone && <span>{phone}</span>}
                {email && <span>• {email}</span>}
                {location && <span>• {location}</span>}
              </div>
              <div className="text-xs text-slate-700 mt-0.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                {linkedin && <span>{linkedin}</span>}
                {github && <span>• {github}</span>}
              </div>
            </div>

            {/* Section: Summary */}
            {summary.trim() && (
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-1.5">
                  Professional Summary
                </h2>
                <p className="text-xs text-slate-800 leading-normal">{summary}</p>
              </div>
            )}

            {/* Section: Technical Skills */}
            {skills.trim() && (
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-1.5">
                  Technical Skills
                </h2>
                <p className="text-xs text-slate-800 leading-normal">
                  <strong className="text-slate-900">Skills & Tools:</strong> {skills}
                </p>
              </div>
            )}

            {/* Section: Experience */}
            {experiences.length > 0 && (
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-2">
                  Work Experience
                </h2>
                <div className="space-y-3">
                  {experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex items-baseline justify-between text-xs font-bold text-slate-900">
                        <span>{exp.title} — <span className="font-normal italic">{exp.company}</span></span>
                        <span className="text-[11px] font-normal text-slate-700">{exp.dates}</span>
                      </div>
                      {exp.bullets.trim() && (
                        <ul className="list-disc list-inside text-xs text-slate-800 mt-1 space-y-0.5 pl-1">
                          {exp.bullets.split("\n").map((b, i) => (
                            b.trim() ? <li key={i}>{b.trim()}</li> : null
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section: Key Projects */}
            {projects.length > 0 && (
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-2">
                  Key Projects
                </h2>
                <div className="space-y-2.5">
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="text-xs font-bold text-slate-900">
                        {proj.title} {proj.tech && <span className="font-normal text-slate-700">({proj.tech})</span>}
                      </div>
                      {proj.description && (
                        <p className="text-xs text-slate-800 mt-0.5 leading-normal">{proj.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section: Education */}
            {educations.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-2">
                  Education
                </h2>
                <div className="space-y-2">
                  {educations.map((edu) => (
                    <div key={edu.id} className="flex items-baseline justify-between text-xs">
                      <div>
                        <strong className="text-slate-900">{edu.degree}</strong> — <span className="text-slate-800">{edu.institution}</span>
                        {edu.grade && <span className="text-slate-700 font-medium"> ({edu.grade})</span>}
                      </div>
                      <span className="text-slate-700 text-[11px]">{edu.dates}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Embedded Print CSS for perfect PDF export */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
          #ats-resume-document, #ats-resume-document * {
            visibility: visible;
          }
          #ats-resume-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            padding: 20px !important;
          }
        }
      `}</style>

    </div>
  );
}
