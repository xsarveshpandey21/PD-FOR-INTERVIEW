"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Phone, Mail, Sparkles, ShieldCheck, FileText, Code2, MessageSquare, Clock, CheckCircle2 } from "lucide-react";

interface HodProfile {
  name: string;
  designation: string;
  photoUrl: string;
  mobile: string;
  email: string;
  welcomeMessage: string;
}

export default function LandingPage() {
  const [hod, setHod] = useState<HodProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hod-profile")
      .then((res) => res.json())
      .then((data) => {
        setHod(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load HOD profile:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      {/* Dynamic Ambient Background Lights */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[550px] w-[550px] rounded-full bg-cyan-600/15 blur-[150px]" />
      <div className="pointer-events-none absolute top-1/2 -right-40 h-[550px] w-[550px] rounded-full bg-indigo-600/15 blur-[150px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-amber-600/10 blur-[150px]" />

      <div className="mx-auto max-w-6xl space-y-12">
        
        {/* Banner Placeholder */}
        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/40 p-6 text-center shadow-2xl backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">S R Group of Institutions, Lucknow</p>
          <h2 className="text-2xl font-black text-white sm:text-3xl mt-1">
            Department of Placement & Personality Development (PD Cell)
          </h2>
          <p className="text-xs text-slate-300 mt-2 max-w-3xl mx-auto">
            Welcome to our official student placement portal — designed to eliminate test anxiety, build job-ready resumes, and elevate technical & interview confidence.
          </p>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/40 bg-cyan-950/60 px-4 py-1.5 text-xs font-extrabold text-cyan-300 shadow-lg shadow-cyan-500/10 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span>Official Student Career & Assessment Hub</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
            Prepare, Practice & Conquer <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
              Campus Placements
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
            Take practice technical assessment tests, generate single-column ATS resumes, practice flashcards, and attend scheduled live screening rounds.
          </p>
        </div>

        {/* HOD Profile Card */}
        <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0f172a]/90 to-[#0b0f19]/90 p-8 shadow-2xl backdrop-blur-xl hover:border-cyan-500/30 transition-all">
          <div className="absolute top-0 right-0 h-40 w-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            
            {/* HOD Photo */}
            <div className="shrink-0 text-center space-y-3">
              <div className="relative h-36 w-36 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-indigo-500 to-amber-400 shadow-xl shadow-cyan-500/20">
                <img
                  src={
                    hod?.photoUrl ||
                    "/hod-photo.jpg"
                  }
                  alt={hod?.name || "HOD Profile"}
                  className="h-full w-full rounded-full object-cover bg-slate-900"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/hod-photo.jpg";
                  }}
                />
              </div>
              <div className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Head of Department</span>
              </div>
            </div>

            {/* HOD Details & Welcome Message */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Department Leadership</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">
                  {loading ? "Loading HOD Details..." : hod?.name || "Prof. Mahima Sahay"}
                </h2>
                <p className="text-xs font-bold text-slate-400 mt-0.5">
                  {hod?.designation || "Head of Department — Placement & Personality Development"}
                </p>
              </div>

              <blockquote className="text-sm leading-relaxed text-slate-300 italic border-l-4 border-cyan-500/50 pl-4 py-1.5 bg-slate-900/40 rounded-r-xl">
                "{hod?.welcomeMessage ||
                  "Welcome to the PD Web Portal! Our department is committed to helping every student build confidence, sharpen technical abilities, and secure top placement offers."}"
              </blockquote>

              {/* Clickable Contact Links */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold">
                {hod?.mobile && (
                  <a
                    href={`tel:${hod.mobile}`}
                    className="inline-flex items-center space-x-2 rounded-xl border border-cyan-500/40 bg-cyan-950/60 px-4 py-2 text-cyan-300 hover:bg-cyan-900/60 hover:text-white transition-all shadow-md"
                  >
                    <Phone className="h-4 w-4 text-cyan-400" />
                    <span>{hod.mobile}</span>
                  </a>
                )}

                {hod?.email && (
                  <a
                    href={`mailto:${hod.email}`}
                    className="inline-flex items-center space-x-2 rounded-xl border border-indigo-500/40 bg-indigo-950/60 px-4 py-2 text-indigo-300 hover:bg-indigo-900/60 hover:text-white transition-all shadow-md"
                  >
                    <Mail className="h-4 w-4 text-indigo-400" />
                    <span>{hod.email}</span>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Student Quick Steps: How It Works */}
        <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-[#0e1726]/90 to-purple-950/40 p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Easy 3-Step Student Guide</span>
            <h3 className="text-2xl font-black text-white">How To Get Placement Ready</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-2 text-center">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 font-extrabold text-base border border-emerald-500/40">
                1
              </div>
              <h4 className="text-sm font-bold text-white">Build Your ATS Resume</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Use Module 01 to generate a single-column, parser-compliant resume with instant PDF download.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 space-y-2 text-center">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 font-extrabold text-base border border-cyan-500/40">
                2
              </div>
              <h4 className="text-sm font-bold text-white">Practice Assessment Tests</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Take Module 02 timed technical MCQs tailored specifically to your branch and target career field.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 space-y-2 text-center">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 font-extrabold text-base border border-amber-500/40">
                3
              </div>
              <h4 className="text-sm font-bold text-white">Master Interview Flashcards</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Use Module 03 to review HR, GD, and Branch questions with instant flip-to-reveal expert model answers.
              </p>
            </div>
          </div>
        </div>

        {/* Portal Offerings Summary with Visual Photos */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Interactive Learning Tools</span>
            <h3 className="text-2xl font-black text-white">Explore Placement Modules</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Offering 1 */}
            <div className="group rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/30 to-[#0e1726]/90 overflow-hidden shadow-2xl backdrop-blur-md hover:border-emerald-400/50 transition-all flex flex-col justify-between">
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src="/ats_resume_visual.jpg"
                  alt="ATS Resume Generator"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1726] via-transparent to-transparent" />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <FileText className="h-5 w-5" />
                  <h4 className="text-base font-bold text-white">ATS Resume Generator</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Single-column ATS-friendly resume builder with instant formatting preview & crisp PDF download.
                </p>
                <Link
                  href="/ats-builder"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-1"
                >
                  <span>Open Builder</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Offering 2 */}
            <div className="group rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/30 to-[#0e1726]/90 overflow-hidden shadow-2xl backdrop-blur-md hover:border-cyan-400/50 transition-all flex flex-col justify-between">
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src="/technical_test_visual.jpg"
                  alt="Technical Test"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1726] via-transparent to-transparent" />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <Code2 className="h-5 w-5" />
                  <h4 className="text-base font-bold text-white">Technical Test</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  10-question timed assessment tailored to your branch & target field with zero duplicate questions.
                </p>
                <Link
                  href="/technical-interview"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-1"
                >
                  <span>Start Test</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Offering 3 */}
            <div className="group rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/30 to-[#0e1726]/90 overflow-hidden shadow-2xl backdrop-blur-md hover:border-amber-400/50 transition-all flex flex-col justify-between">
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src="/mock_interview_visual.jpg"
                  alt="Mock Flashcards"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1726] via-transparent to-transparent" />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center space-x-2 text-amber-400">
                  <MessageSquare className="h-5 w-5" />
                  <h4 className="text-base font-bold text-white">Mock Flashcards</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Low-pressure practice space covering Technical, HR, GD, and Branch questions with instant flip answers.
                </p>
                <Link
                  href="/mock-interview"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 pt-1"
                >
                  <span>Practice Flashcards</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Prominent "Enter Portal" CTA Button */}
        <div className="text-center pt-4">
          <Link
            href="/modules"
            className="inline-flex items-center space-x-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-amber-500 px-8 py-4 text-base font-black text-white shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.03] transition-all"
          >
            <span>Enter Student Placement Portal</span>
            <ArrowRight className="h-5 w-5 animate-pulse" />
          </Link>
        </div>


      </div>
    </div>
  );
}
