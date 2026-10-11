"use client";

import Link from "next/link";
import { FileText, Code2, MessageSquare, Clock, ArrowRight, CheckCircle2, Shield, Sparkles } from "lucide-react";

export default function ModuleDashboardPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] px-4 py-12 sm:px-6 lg:px-8">
      {/* Ambient background lights */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[140px]" />

      <div className="mx-auto max-w-6xl space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-950/50 px-4 py-1 text-xs font-bold text-cyan-300">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Placement Department Dashboard</span>
          </div>

          <h1 className="text-3xl font-black text-white sm:text-5xl">
            Choose Your <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">Preparation Module</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Select any module below to build your resume, practice technical MCQs, review flashcards, or enter a live scheduled round.
          </p>
        </div>

        {/* 4 Multicolor Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: ATS Resume Generator */}
          <Link
            href="/ats-builder"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#0c1f1a]/90 to-[#091512]/90 shadow-2xl hover:border-emerald-400/60 hover:shadow-emerald-500/20 hover:-translate-y-1.5 transition-all backdrop-blur-xl"
          >
            {/* Visual Photo Banner */}
            <div className="relative h-44 w-full overflow-hidden border-b border-emerald-500/20">
              <img
                src="/ats_resume_visual.jpg"
                alt="ATS Resume Generator Visual"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1f1a] via-transparent to-transparent" />
              <span className="absolute top-3 right-3 rounded-full bg-emerald-950/90 border border-emerald-500/40 px-3 py-1 text-[11px] font-extrabold text-emerald-300 shadow-md">
                Module 01 • Open Tool
              </span>
            </div>

            <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-black text-white group-hover:text-emerald-300 transition-colors">
                    ATS Resume Generator
                  </h2>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Create a job-ready, single-column ATS resume in minutes with real-time formatting preview and instant one-click PDF export.
                </p>
              </div>

              <ul className="space-y-2 text-xs font-medium text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>100% ATS parser compliant single-column layout</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Smart AI bullet point & summary polisher</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Instant high-resolution PDF download</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-emerald-900/40 flex items-center justify-between text-xs font-black text-emerald-400 group-hover:text-emerald-300">
                <span>Launch Resume Builder</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 2: Technical Interview Module */}
          <Link
            href="/technical-interview"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#0c1a2c]/90 to-[#08111e]/90 shadow-2xl hover:border-cyan-400/60 hover:shadow-cyan-500/20 hover:-translate-y-1.5 transition-all backdrop-blur-xl"
          >
            {/* Visual Photo Banner */}
            <div className="relative h-44 w-full overflow-hidden border-b border-cyan-500/20">
              <img
                src="/technical_test_visual.jpg"
                alt="Technical Assessment Visual"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a2c] via-transparent to-transparent" />
              <span className="absolute top-3 right-3 rounded-full bg-cyan-950/90 border border-cyan-500/40 px-3 py-1 text-[11px] font-extrabold text-cyan-300 shadow-md">
                Module 02 • Assessment Test
              </span>
            </div>

            <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                    Technical Assessment Test
                  </h2>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Practice timed technical MCQs tailored specifically to your engineering branch and target job field. 10-minute countdown timer.
                </p>
              </div>

              <ul className="space-y-2 text-xs font-medium text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>13-Digit Roll Number verification (2nd–4th year)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>10 field-customized technical questions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>No-repeat history tracking for fair practice</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-cyan-900/40 flex items-center justify-between text-xs font-black text-cyan-400 group-hover:text-cyan-300">
                <span>Start Technical Test</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 3: Mock Interview Practice */}
          <Link
            href="/mock-interview"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#241a0a]/90 to-[#171005]/90 shadow-2xl hover:border-amber-400/60 hover:shadow-amber-500/20 hover:-translate-y-1.5 transition-all backdrop-blur-xl"
          >
            {/* Visual Photo Banner */}
            <div className="relative h-44 w-full overflow-hidden border-b border-amber-500/20">
              <img
                src="/mock_interview_visual.jpg"
                alt="Mock Interview Visual"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#241a0a] via-transparent to-transparent" />
              <span className="absolute top-3 right-3 rounded-full bg-amber-950/90 border border-amber-500/40 px-3 py-1 text-[11px] font-extrabold text-amber-300 shadow-md">
                Module 03 • Self-Paced Flashcards
              </span>
            </div>

            <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                    Mock Interview Practice
                  </h2>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Low-pressure practice space with interactive flashcards. Master Technical Concepts, HR & Behavioral questions, GD topics, and Branch concepts.
                </p>
              </div>

              <ul className="space-y-2 text-xs font-medium text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Zero-stress learning with flip-to-reveal model answers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Category-filtered questions (HR, GD, Tech, Branch)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Generate fresh non-repeating question sets on demand</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-amber-900/40 flex items-center justify-between text-xs font-black text-amber-400 group-hover:text-amber-300">
                <span>Enter Practice Space</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 4: Scheduled Interview Round */}
          <Link
            href="/scheduled-interview"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-rose-500/30 bg-gradient-to-b from-[#240d16]/90 to-[#18070e]/90 shadow-2xl hover:border-rose-400/60 hover:shadow-rose-500/20 hover:-translate-y-1.5 transition-all backdrop-blur-xl"
          >
            {/* Visual Photo Banner */}
            <div className="relative h-44 w-full overflow-hidden border-b border-rose-500/20 bg-gradient-to-br from-rose-950 via-purple-950 to-slate-900 flex items-center justify-center p-6 text-center">
              <div className="space-y-1">
                <span className="inline-flex items-center space-x-1 text-[11px] font-extrabold text-rose-300 bg-rose-900/60 border border-rose-500/40 px-3 py-1 rounded-full">
                  <Clock className="h-3.5 w-3.5 text-rose-400 animate-spin" />
                  <span>Time-Gated Live Screening</span>
                </span>
                <h3 className="text-lg font-black text-white pt-1">Official Live Interview Round</h3>
                <p className="text-[11px] text-slate-300">Admin Controlled Scheduled Session</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#240d16] via-transparent to-transparent pointer-events-none" />
              <span className="absolute top-3 right-3 rounded-full bg-rose-950/90 border border-rose-500/40 px-3 py-1 text-[11px] font-extrabold text-rose-300 shadow-md">
                Module 04 • Admin Gated
              </span>
            </div>

            <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-black text-white group-hover:text-rose-300 transition-colors">
                    Scheduled Interview Round
                  </h2>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Time-gated live screening session managed by Placement Officers. 5 targeted questions with a 5-minute countdown timer during active windows.
                </p>
              </div>

              <ul className="space-y-2 text-xs font-medium text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>Admin scheduled start & end window gating</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>5 targeted questions with 5-minute timer</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>Official live screening attempt recording</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-rose-900/40 flex items-center justify-between text-xs font-black text-rose-400 group-hover:text-rose-300">
                <span>Check Round Status</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </Link>

        </div>


        {/* Separately Styled Admin Login Footer Link */}
        <div className="pt-6 text-center border-t border-slate-800/80">
          <Link
            href="/admin/login"
            className="inline-flex items-center space-x-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800 transition-all shadow-md"
          >
            <Shield className="h-4 w-4 text-indigo-400" />
            <span>Placement Department Staff? Click here to access Admin Management Console</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
