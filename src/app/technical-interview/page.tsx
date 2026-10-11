"use client";

import { useEffect, useState } from "react";
import { Sparkles, Code2, Clock, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Loader2, Award, RotateCcw, HelpCircle } from "lucide-react";

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

// Format Timer Display (MM:SS)
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const mm = m < 10 ? "0" + m : "" + m;
  const ss = s < 10 ? "0" + s : "" + s;
  return mm + ":" + ss;
}

export default function TechnicalInterviewPage() {
  // Step State: 'register' | 'testing' | 'result'
  const [step, setStep] = useState<"register" | "testing" | "result">("register");

  // Options loaded from backend
  const [options, setOptions] = useState<DynamicOptions>({ branches: [], fields: [] });
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Form State
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
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Result State
  const [resultData, setResultData] = useState<{ score: number; maxScore: number; percentage: number } | null>(null);

  // Load dynamic options on mount
  useEffect(() => {
    fetch("/api/options")
      .then((res) => res.json())
      .then((data) => {
        if (data.branches && data.fields) {
          setOptions(data);
          if (data.branches.length > 0) setBranch(data.branches[0].code);
          if (data.fields.length > 0) setField(data.fields[0].name);
        }
        setLoadingOptions(false);
      })
      .catch((err) => {
        console.error("Failed to load dynamic options:", err);
        setLoadingOptions(false);
      });
  }, []);

  // Timer Countdown Effect
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

  // Handle Form Submission -> Start Test
  async function handleStartTest(e: React.FormEvent) {
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
          count: 10,
          studentIdentifier: rollNumber.trim() || cleanEmail,
          email: cleanEmail,
          rollNumber: rollNumber.trim(),
          phone: phone.trim(),
          mode: "technical",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.questions || data.questions.length === 0) {
        throw new Error(data.error || "Failed to generate test questions.");
      }

      setQuestions(data.questions);
      setSelectedAnswers({});
      setCurrentIdx(0);
      setTimeLeft(600);
      setStep("testing");
    } catch (err: any) {
      console.error("Test generation error:", err);
      setFormError(err.message || "Could not generate test. Please try again.");
    } finally {
      setLoadingQuestions(false);
    }
  }

  function handleSelectOption(optionIndex: number) {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optionIndex,
    }));
  }

  async function handleFinalSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/attempts/technical", {
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
      console.error("Submit test error:", err);
      alert(err.message || "Failed to submit assessment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-600/15 blur-[140px]" />

      <div className="mx-auto max-w-4xl space-y-8">
        {step === "register" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-950/50 px-4 py-1 text-xs font-bold text-cyan-300">
                <Code2 className="h-4 w-4 text-cyan-400" />
                <span>Module 02 • Technical Assessment</span>
              </div>
              <h1 className="text-3xl font-black text-white sm:text-4xl">Candidate Registration</h1>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                Fill out your academic details below to launch your personalized 10-question AI technical test.
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#0c1a2c]/90 to-[#08111e]/90 shadow-2xl backdrop-blur-xl space-y-6">
              <div className="relative h-44 w-full overflow-hidden border-b border-cyan-500/20">
                <img
                  src="/technical_test_visual.jpg"
                  alt="Technical Assessment Visual"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a2c] via-[#0c1a2c]/60 to-transparent flex items-end p-6">
                  <div className="space-y-1">
                    <span className="inline-flex items-center space-x-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 px-3 py-1 text-[11px] font-extrabold text-cyan-300">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Student Assessment Registration</span>
                    </span>
                    <h2 className="text-xl font-black text-white">Enter Your Details To Begin</h2>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
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
                        Student Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-[#0e1726] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Year of Study <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-[#0e1726] px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="1st Year">1st Year (Exempt from Roll Number)</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Roll Number {year === "1st Year" ? <span className="text-slate-500">(Optional for 1st Year)</span> : <span className="text-rose-400">* (13 Digits)</span>}
                      </label>
                      <input
                        type="text"
                        required={year !== "1st Year"}
                        maxLength={13}
                        placeholder={year === "1st Year" ? "Not required for 1st Year" : "e.g. 2100530100045"}
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value.replace(/\D/g, ""))}
                        className="w-full rounded-xl border border-slate-800 bg-[#0e1726] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Branch <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-[#0e1726] px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                      >
                        {options.branches.length > 0 ? (
                          options.branches.map((b) => (
                            <option key={b.id} value={b.code}>
                              {b.name} ({b.code})
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="CS">Computer Science (CS)</option>
                            <option value="IT">Information Technology (IT)</option>
                            <option value="AIML">AI & Machine Learning (AIML)</option>
                            <option value="DS">Data Science (DS)</option>
                            <option value="EC">Electronics & Comm (EC)</option>
                            <option value="EN">Electrical Eng (EN)</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Preferred Field <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={field}
                        onChange={(e) => setField(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-[#0e1726] px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                      >
                        {options.fields.length > 0 ? (
                          options.fields.map((f) => (
                            <option key={f.id} value={f.name}>
                              {f.name}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="Software Developer">Software Developer</option>
                            <option value="Data Scientist">Data Scientist</option>
                            <option value="Data Analyst">Data Analyst</option>
                            <option value="Web Developer">Web Developer</option>
                            <option value="Core/Electronics Engineer">Core/Electronics Engineer</option>
                            <option value="Networking">Networking</option>
                            <option value="Cybersecurity">Cybersecurity</option>
                            <option value="Other">Other</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Phone Number <span className="text-rose-400">* (10 Digits)</span>
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="e.g. 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        className="w-full rounded-xl border border-slate-800 bg-[#0e1726] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Email ID <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul.sharma@college.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-[#0e1726] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 text-center">
                    <button
                      type="submit"
                      disabled={loadingQuestions}
                      className="inline-flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                      {loadingQuestions ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Generating Technical Assessment Questions...</span>
                        </>
                      ) : (
                        <>
                          <span>Start Technical Assessment</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {step === "testing" && questions.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-cyan-500/30 bg-[#0c1a2c]/90 p-4 backdrop-blur-xl shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Technical MCQ Test</span>
                <p className="text-xs text-slate-300 font-semibold mt-0.5">
                  Question {currentIdx + 1} of {questions.length} • {field} ({branch})
                </p>
              </div>

              <div className={`flex items-center space-x-2 rounded-xl px-4 py-2 border font-mono font-bold text-sm ${
                timeLeft <= 120 ? "bg-rose-950/80 border-rose-500/50 text-rose-300 animate-pulse" : "bg-cyan-950/80 border-cyan-500/40 text-cyan-300"
              }`}>
                <Clock className="h-4 w-4 text-cyan-400" />
                <span>Time Remaining: {formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#0e1726]/90 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
              <div className="space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Question {currentIdx + 1}</span>
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
                          ? "bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10"
                          : "bg-[#141d2e] border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border text-xs font-bold ${
                          isSelected ? "bg-cyan-500 border-cyan-400 text-slate-950" : "bg-slate-800 border-slate-700 text-slate-400"
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{optText}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-6">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((prev) => prev - 1)}
                  className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-[#141d2e] px-4 py-2 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="hidden sm:flex items-center space-x-1.5">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIdx(i)}
                      className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                        i === currentIdx
                          ? "bg-cyan-500 text-slate-950 ring-2 ring-cyan-400"
                          : selectedAnswers[i] !== undefined
                          ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx((prev) => prev + 1)}
                    className="inline-flex items-center space-x-1.5 rounded-xl bg-cyan-600 px-5 py-2 text-xs font-bold text-white hover:bg-cyan-500 shadow-md"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-emerald-500/20 hover:scale-105"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Submit Test</span>}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {step === "result" && resultData && (
          <div className="space-y-6 text-center">
            <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#0c1a2c]/90 to-[#08111e]/90 p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-xl">
                <Award className="h-10 w-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Assessment Complete</span>
                <h2 className="text-3xl font-black text-white mt-1">Well Done, {studentName}!</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Your response has been saved to the Placement Department database.
                </p>
              </div>

              <div className="mx-auto max-w-sm rounded-2xl border border-slate-800 bg-[#141d2e] p-6 space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase">Your Final Score</p>
                <div className="text-4xl font-black text-cyan-300">
                  {resultData.score} / {resultData.maxScore}
                </div>
                <p className="text-xs font-bold text-emerald-400">
                  Score Percentage: {resultData.percentage}%
                </p>
              </div>

              <div className="text-left space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <HelpCircle className="h-4 w-4 text-cyan-400" />
                  <span>Question Review & Explanations</span>
                </h3>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {questions.map((q, idx) => {
                    const userAns = selectedAnswers[idx];
                    const isCorrect = userAns === q.correctOptionIndex;
                    return (
                      <div key={idx} className="rounded-2xl border border-slate-800 bg-[#0e1726] p-4 space-y-2 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-white">
                            {idx + 1}. {q.questionText}
                          </p>
                          <span className={`shrink-0 rounded-md px-2 py-0.5 font-bold ${
                            isCorrect ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30" : "bg-rose-950 text-rose-300 border border-rose-500/30"
                          }`}>
                            {isCorrect ? "Correct (+1)" : "Incorrect (0)"}
                          </span>
                        </div>

                        <p className="text-slate-300">
                          <strong className="text-slate-400">Correct Answer:</strong> {q.options[q.correctOptionIndex]}
                        </p>

                        {q.explanation && (
                          <p className="text-slate-400 italic bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                            💡 {q.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setStep("register")}
                  className="inline-flex items-center space-x-2 rounded-xl bg-slate-800 px-6 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Attempt Another Test</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
