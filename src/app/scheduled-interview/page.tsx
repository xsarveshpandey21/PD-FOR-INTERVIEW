"use client";

import { useEffect, useState } from "react";
import { Clock, ShieldAlert, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Loader2, Award, Lock, Calendar } from "lucide-react";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

interface DynamicOptions {
  branches: Array<{ id: string; code: string; name: string }>;
  fields: Array<{ id: string; name: string }>;
}

export default function ScheduledInterviewPage() {
  // Gating status state
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [scheduledStartTime, setScheduledStartTime] = useState<string | null>(null);
  const [scheduledEndTime, setScheduledEndTime] = useState<string | null>(null);

  // Step state: 'waiting' | 'register' | 'testing' | 'result'
  const [step, setStep] = useState<"waiting" | "register" | "testing" | "result">("waiting");

  // Options loaded from backend
  const [options, setOptions] = useState<DynamicOptions>({ branches: [], fields: [] });

  // Candidate Registration Form
  const [studentName, setStudentName] = useState("");
  const [year, setYear] = useState("3rd Year");
  const [rollNumber, setRollNumber] = useState("");
  const [branch, setBranch] = useState("CS");
  const [field, setField] = useState("Software Developer");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");

  // Test State
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes for 5 questions
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Result state
  const [resultData, setResultData] = useState<{ score: number; maxScore: number; percentage: number } | null>(null);

  // Check scheduled round gating on mount
  useEffect(() => {
    fetch("/api/attempts/scheduled")
      .then((res) => res.json())
      .then((data) => {
        setIsOpen(!!data.isOpen);
        setScheduledStartTime(data.scheduledStartTime || null);
        setScheduledEndTime(data.scheduledEndTime || null);
        if (data.isOpen) {
          setStep("register");
        } else {
          setStep("waiting");
        }
        setCheckingStatus(false);
      })
      .catch((err) => {
        console.error(err);
        setCheckingStatus(false);
      });

    fetch("/api/options")
      .then((res) => res.json())
      .then((data) => {
        if (data.branches && data.fields) {
          setOptions(data);
          if (data.branches.length > 0) setBranch(data.branches[0].code);
          if (data.fields.length > 0) setField(data.fields[0].name);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // 5-minute countdown timer effect
  useEffect(() => {
    if (step !== "testing") return;

    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeLeft]);

  // Start test
  const handleStartTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!studentName.trim()) {
      setFormError("Student Name is required.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setFormError("Phone number must be exactly 10 numeric digits.");
      return;
    }

    if (year !== "1st Year") {
      const cleanRoll = rollNumber.trim();
      if (!cleanRoll) {
        setFormError(`Roll Number is required for ${year}.`);
        return;
      }
      if (!/^\d{13}$/.test(cleanRoll)) {
        setFormError("Roll Number must be exactly 13 numeric digits.");
        return;
      }
    }

    setLoadingQuestions(true);
    try {
      const res = await fetch("/api/questions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: studentName.trim(),
          branch,
          field,
          year,
          count: 5, // 5 questions for scheduled round
          studentIdentifier: rollNumber.trim() || cleanEmail,
          email: cleanEmail,
          rollNumber: rollNumber.trim(),
          phone: phone.trim(),
          mode: "scheduled",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.questions) {
        throw new Error(data.error || "Failed to generate questions.");
      }

      setQuestions(data.questions);
      setSelectedAnswers({});
      setCurrentIdx(0);
      setTimeLeft(300); // 5 minutes
      setStep("testing");
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Failed to start test.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optionIndex,
    }));
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/attempts/scheduled", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: studentName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.replace(/\D/g, ""),
          year,
          rollNumber: year !== "1st Year" ? rollNumber.trim() : null,
          branch,
          field,
          questions,
          selectedAnswers,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");

      setResultData({
        score: data.score,
        maxScore: data.maxScore,
        percentage: data.percentage,
      });
      setStep("result");
    } catch (err: any) {
      alert(err.message || "Submission error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (checkingStatus) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-slate-400 space-x-3">
        <Loader2 className="h-6 w-6 animate-spin text-rose-400" />
        <span className="text-xs font-bold">Checking Scheduled Round Access Window...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-rose-600/10 blur-[140px]" />

      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* STEP WAITING: Gated Screen Outside Window */}
        {step === "waiting" && (
          <div className="text-center space-y-6 max-w-xl mx-auto py-12">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-2xl">
              <Lock className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <span className="rounded-full bg-rose-950/80 border border-rose-500/40 px-3.5 py-1 text-xs font-bold text-rose-300">
                Module 04 • Admin Gated
              </span>
              <h1 className="text-3xl font-black text-white sm:text-4xl">Scheduled Interview Round is Currently Closed</h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                This interview round is strictly controlled by Placement Officers and opens only during pre-scheduled time windows.
              </p>
            </div>

            {/* Schedule Window Banner */}
            <div className="rounded-2xl border border-rose-900/40 bg-[#160a12]/90 p-6 space-y-3 text-left backdrop-blur-xl">
              <div className="flex items-center space-x-2 text-rose-300 font-bold text-xs">
                <Calendar className="h-4 w-4 text-rose-400" />
                <span>Next Scheduled Window Details:</span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                Start Time: {scheduledStartTime ? new Date(scheduledStartTime).toLocaleString() : "Not Scheduled Yet"}
              </p>
              <p className="text-xs text-slate-300 font-mono">
                End Time: {scheduledEndTime ? new Date(scheduledEndTime).toLocaleString() : "Not Scheduled Yet"}
              </p>
            </div>

            <p className="text-xs text-slate-500">
              Check back at your assigned interview session time or contact the Placement Department for updates.
            </p>
          </div>
        )}

        {/* STEP REGISTER: Form inside Active Window */}
        {step === "register" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-2 rounded-full border border-rose-500/30 bg-rose-950/50 px-4 py-1 text-xs font-bold text-rose-300">
                <Clock className="h-4 w-4 text-rose-400" />
                <span>Module 04 • Live Scheduled Round (Active)</span>
              </div>
              <h1 className="text-3xl font-black text-white sm:text-4xl">Scheduled Round Registration</h1>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                Official 5-question live screening test (5-minute countdown). Register below to start immediately.
              </p>
            </div>

            <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-b from-[#240d16]/90 to-[#18070e]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
              {formError && (
                <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs font-bold text-rose-300 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleStartTest} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Student Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-[#160a12] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Year of Study <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-[#160a12] px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Roll Number {year !== "1st Year" ? <span className="text-rose-400">* (13 Digits)</span> : <span className="text-slate-500 font-normal">(Exempt)</span>}
                    </label>
                    <input
                      type="text"
                      disabled={year === "1st Year"}
                      maxLength={13}
                      placeholder={year === "1st Year" ? "Exempt for 1st Year" : "e.g. 2100560100012"}
                      value={year === "1st Year" ? "" : rollNumber}
                      onChange={(e) => setRollNumber(e.target.value.replace(/\D/g, ""))}
                      className="w-full rounded-xl border border-slate-800 bg-[#160a12] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none disabled:opacity-40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Branch</label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-[#160a12] px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                    >
                      {options.branches.map((b) => (
                        <option key={b.id} value={b.code}>
                          {b.name} ({b.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Preferred Field</label>
                    <select
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-[#160a12] px-4 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                    >
                      {options.fields.map((f) => (
                        <option key={f.id} value={f.name}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Phone Number (10 Digits)</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full rounded-xl border border-slate-800 bg-[#160a12] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Email ID</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul.sharma@college.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-[#160a12] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                </div>

                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    disabled={loadingQuestions}
                    className="inline-flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-rose-500/25 hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {loadingQuestions ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Generating Scheduled Questions...</span>
                      </>
                    ) : (
                      <>
                        <span>Enter Scheduled Test (5 Questions, 5 Mins)</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* STEP TESTING: Interactive Test Engine */}
        {step === "testing" && questions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-rose-500/30 bg-[#1e0a13]/90 p-4 backdrop-blur-xl shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Scheduled Interview Round</span>
                <p className="text-xs text-slate-300 font-semibold mt-0.5">
                  Question {currentIdx + 1} of {questions.length} • 5-Minute Timer
                </p>
              </div>

              <div className="flex items-center space-x-2 rounded-xl bg-rose-950/90 border border-rose-500/50 px-4 py-2 text-rose-300 font-mono font-bold text-sm">
                <Clock className="h-4 w-4 text-rose-400" />
                <span>Timer: {formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#160a12]/90 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
              <div className="space-y-2">
                <span className="text-xs font-bold text-rose-400 uppercase">Question {currentIdx + 1}</span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white leading-relaxed">
                  {questions[currentIdx].questionText}
                </h2>
              </div>

              <div className="space-y-3">
                {questions[currentIdx].options.map((optText, optIdx) => {
                  const isSelected = selectedAnswers[currentIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-rose-500/20 border-rose-400 text-white shadow-lg shadow-rose-500/10"
                          : "bg-[#220d1c] border-slate-800 text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border text-xs font-bold ${
                          isSelected ? "bg-rose-500 border-rose-400 text-slate-950" : "bg-slate-800 border-slate-700 text-slate-400"
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{optText}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-6">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((prev) => prev - 1)}
                  className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-[#220d1c] px-4 py-2 text-xs font-bold text-slate-300 disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx((prev) => prev + 1)}
                    className="inline-flex items-center space-x-1.5 rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-500"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-rose-500/20 hover:scale-105"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Submit Scheduled Test</span>}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP RESULT: Score display */}
        {step === "result" && resultData && (
          <div className="text-center space-y-6">
            <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-b from-[#240d16]/90 to-[#18070e]/90 p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
              
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-xl">
                <Award className="h-10 w-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Scheduled Round Completed</span>
                <h2 className="text-3xl font-black text-white mt-1">Thank you, {studentName}!</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Your official scheduled round response has been recorded for Placement Cell evaluation.
                </p>
              </div>

              <div className="mx-auto max-w-sm rounded-2xl border border-slate-800 bg-[#220d1c] p-6 space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase">Score Overview</p>
                <div className="text-4xl font-black text-rose-300">
                  {resultData.score} / {resultData.maxScore}
                </div>
                <p className="text-xs font-bold text-emerald-400">
                  Score Percentage: {resultData.percentage}%
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
