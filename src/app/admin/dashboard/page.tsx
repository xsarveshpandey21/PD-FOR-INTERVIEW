"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import {
  Shield,
  Download,
  Search,
  Filter,
  LogOut,
  Clock,
  Code2,
  Settings,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserCheck,
  Calendar,
  Save,
  Sparkles,
} from "lucide-react";

interface AttemptRecord {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  year: string;
  rollNumber: string | null;
  branch: string;
  field: string;
  score: number;
  maxScore: number;
  createdAt: string;
}

interface DynamicOption {
  id: string;
  code?: string;
  name: string;
}

interface HodProfile {
  name: string;
  designation: string;
  photoUrl: string;
  mobile: string;
  email: string;
  welcomeMessage: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"technical" | "scheduled" | "settings">("technical");
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");

  // Attempt Data
  const [technicalAttempts, setTechnicalAttempts] = useState<AttemptRecord[]>([]);
  const [scheduledAttempts, setScheduledAttempts] = useState<AttemptRecord[]>([]);

  // Scheduled Round Settings
  const [isScheduledRoundOpen, setIsScheduledRoundOpen] = useState(false);
  const [scheduledStartTime, setScheduledStartTime] = useState("");
  const [scheduledEndTime, setScheduledEndTime] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [erasingScheduledDb, setErasingScheduledDb] = useState(false);
  const [eraseSuccess, setEraseSuccess] = useState("");
  const [erasingTechnicalDb, setErasingTechnicalDb] = useState(false);
  const [techEraseSuccess, setTechEraseSuccess] = useState("");

  // Dynamic Options Data
  const [branches, setBranches] = useState<DynamicOption[]>([]);
  const [fields, setFields] = useState<DynamicOption[]>([]);
  const [newBranchCode, setNewBranchCode] = useState("");
  const [newBranchName, setNewBranchName] = useState("");
  const [newFieldName, setNewFieldName] = useState("");

  // HOD Profile Data
  const [hodProfile, setHodProfile] = useState<HodProfile>({
    name: "Prof. Mahima Sahay",
    designation: "Head of Department — Placement Cell",
    photoUrl: "/hod-photo.jpg",
    mobile: "+91 98765 43210",
    email: "hod.placement@srgi.ac.in",
    welcomeMessage: "Welcome to the Placement & Personality Development (PD) Web Portal of S R Group of Institutions, Lucknow!",
  });
  const [savingHod, setSavingHod] = useState(false);
  const [hodSuccess, setHodSuccess] = useState("");

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Verify Admin Session on Mount
  useEffect(() => {
    fetch("/api/admin/me", { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push("/admin/login");
        } else {
          loadDashboardData();
        }
      })
      .catch(() => router.push("/admin/login"));
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();

      // 1. Fetch Technical Attempts
      const techRes = await fetch("/api/admin/records/technical", { headers });
      const techData = await techRes.json();
      if (Array.isArray(techData)) setTechnicalAttempts(techData);

      // 2. Fetch Scheduled Attempts
      const schedRes = await fetch("/api/admin/records/scheduled", { headers });
      const schedData = await schedRes.json();
      if (Array.isArray(schedData)) setScheduledAttempts(schedData);

      // 3. Fetch Settings
      const setRes = await fetch("/api/admin/settings", { headers });
      const setObj = await setRes.json();
      if (setObj) {
        setIsScheduledRoundOpen(!!setObj.isScheduledRoundOpen);
        setScheduledStartTime(
          setObj.scheduledStartTime
            ? new Date(setObj.scheduledStartTime).toISOString().slice(0, 16)
            : ""
        );
        setScheduledEndTime(
          setObj.scheduledEndTime
            ? new Date(setObj.scheduledEndTime).toISOString().slice(0, 16)
            : ""
        );
      }

      // 4. Fetch Options
      const optRes = await fetch("/api/admin/options", { headers });
      const optObj = await optRes.json();
      if (optObj.branches) setBranches(optObj.branches);
      if (optObj.fields) setFields(optObj.fields);

      // 5. Fetch HOD Profile
      const hodRes = await fetch("/api/hod-profile", { headers });
      const hodObj = await hodRes.json();
      if (hodObj && hodObj.name) setHodProfile(hodObj);
    } catch (err) {
      console.error("Error loading admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
    }
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Export to Excel Handler (.xlsx file download)
  const exportToExcel = (records: AttemptRecord[], filename: string) => {
    const formattedData = records.map((r) => ({
      "Student Name": r.studentName,
      "Roll Number": r.rollNumber || "N/A (1st Year)",
      "Year of Study": r.year,
      "Branch": r.branch,
      "Target Field": r.field,
      "Phone Number": r.phone,
      "Email Address": r.email,
      "Score": `${r.score} / ${r.maxScore}`,
      "Percentage": `${Math.round((r.score / r.maxScore) * 100)}%`,
      "Submitted Date & Time": new Date(r.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Records");
    XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Save Scheduled Settings Handler
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setSettingsSuccess("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          isScheduledRoundOpen,
          scheduledStartTime: scheduledStartTime ? new Date(scheduledStartTime).toISOString() : null,
          scheduledEndTime: scheduledEndTime ? new Date(scheduledEndTime).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSettingsSuccess("Scheduled Round settings saved successfully!");
        setTimeout(() => setSettingsSuccess(""), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
  };

  // Erase Scheduled Interview Local Database Handler
  const handleEraseScheduledDb = async () => {
    const confirmErase = window.confirm(
      "⚠️ DANGER: Are you sure you want to COMPLETELY ERASE all Scheduled Interview attempt records from the local database?\n\nThis will permanently delete all candidate test records for the Scheduled Interview round so candidates can retake the test. This action CANNOT be undone!"
    );

    if (!confirmErase) return;

    setErasingScheduledDb(true);
    setEraseSuccess("");
    try {
      const res = await fetch("/api/admin/records/scheduled", {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setEraseSuccess(`Scheduled Interview local database erased successfully! (${data.deletedCount || 0} records deleted)`);
        loadDashboardData();
        setTimeout(() => setEraseSuccess(""), 6000);
      } else {
        alert(data.error || "Failed to erase scheduled interview database.");
      }
    } catch (err: any) {
      alert("Error erasing scheduled database: " + err.message);
    } finally {
      setErasingScheduledDb(false);
    }
  };

  // Erase Technical Assessment Local Database Handler
  const handleEraseTechnicalDb = async () => {
    const confirmErase = window.confirm(
      "⚠️ DANGER: Are you sure you want to COMPLETELY ERASE all Technical Assessment attempt records from the local database?\n\nThis will permanently delete all candidate test records for Technical Assessment. This action CANNOT be undone!"
    );

    if (!confirmErase) return;

    setErasingTechnicalDb(true);
    setTechEraseSuccess("");
    try {
      const res = await fetch("/api/admin/records/technical", {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setTechEraseSuccess(`Technical Assessment local database erased successfully! (${data.deletedCount || 0} records deleted)`);
        loadDashboardData();
        setTimeout(() => setTechEraseSuccess(""), 6000);
      } else {
        alert(data.error || "Failed to erase technical interview database.");
      }
    } catch (err: any) {
      alert("Error erasing technical database: " + err.message);
    } finally {
      setErasingTechnicalDb(false);
    }
  };

  // Add Dynamic Branch
  const handleAddBranch = async () => {
    if (!newBranchCode || !newBranchName) return;
    try {
      const res = await fetch("/api/admin/options", {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ type: "branch", code: newBranchCode, name: newBranchName }),
      });
      if (res.ok) {
        setNewBranchCode("");
        setNewBranchName("");
        loadDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add Dynamic Field
  const handleAddField = async () => {
    if (!newFieldName) return;
    try {
      const res = await fetch("/api/admin/options", {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ type: "field", name: newFieldName }),
      });
      if (res.ok) {
        setNewFieldName("");
        loadDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Option
  const handleDeleteOption = async (type: "branch" | "field", id: string) => {
    try {
      await fetch(`/api/admin/options?type=${type}&id=${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      loadDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  // Save HOD Profile
  const handleSaveHod = async () => {
    setSavingHod(true);
    setHodSuccess("");
    try {
      const res = await fetch("/api/hod-profile", {
        method: "PUT",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(hodProfile),
      });
      if (res.ok) {
        setHodSuccess("HOD profile updated successfully!");
        setTimeout(() => setHodSuccess(""), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingHod(false);
    }
  };

  // Filter Records helper
  const filterRecords = (records: AttemptRecord[]) => {
    return records.filter((r) => {
      const matchesBranch = branchFilter === "ALL" || r.branch === branchFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.studentName.toLowerCase().includes(q) ||
        (r.rollNumber && r.rollNumber.toLowerCase().includes(q)) ||
        r.email.toLowerCase().includes(q);
      return matchesBranch && matchesSearch;
    });
  };

  const filteredTechnical = filterRecords(technicalAttempts);
  const filteredScheduled = filterRecords(scheduledAttempts);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-slate-400 space-x-3">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
        <span className="text-xs font-bold">Loading Admin Management Console...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-40 right-10 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[140px]" />

      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/40 text-indigo-400 shadow-xl">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-white">Placement Admin Console</h1>
                <span className="rounded-full bg-indigo-950/80 border border-indigo-500/40 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300">
                  Authorized Staff
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage scheduled interview rounds, export candidate scores to Excel, and update department settings.
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center space-x-2 rounded-xl border border-rose-500/30 bg-rose-950/30 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-900/50 hover:border-rose-500/50 transition-all shrink-0"
          >
            <LogOut className="h-4 w-4 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 w-fit backdrop-blur-md">
          <button
            onClick={() => setActiveTab("technical")}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "technical"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Code2 className="h-4 w-4" />
            <span>Technical Test Records ({technicalAttempts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("scheduled")}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "scheduled"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Scheduled Round Controls & Records ({scheduledAttempts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "settings"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Options & HOD Settings</span>
          </button>
        </div>

        {/* TAB 1: TECHNICAL INTERVIEW RECORDS */}
        {activeTab === "technical" && (
          <div className="space-y-6">
            
            {/* Control Bar: Search, Branch Filter & Excel Download */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-[#0e1726]/90 p-4 shadow-xl backdrop-blur-xl">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search candidate or roll..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-[#141d2e] pl-9 pr-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Branch Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="rounded-xl border border-slate-800 bg-[#141d2e] px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="ALL">All Branches</option>
                    <option value="IT">IT</option>
                    <option value="CS">CS</option>
                    <option value="AIML">AIML</option>
                    <option value="DS">DS</option>
                    <option value="EC">EC</option>
                    <option value="EN">EN</option>
                  </select>
                </div>

              </div>

              {techEraseSuccess && (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-3.5 text-xs font-bold text-emerald-300 flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{techEraseSuccess}</span>
                </div>
              )}

              {/* Action Buttons: Excel Export & Erase Database */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => exportToExcel(filteredTechnical, "Technical_Interview_Records")}
                  className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all shrink-0"
                >
                  <Download className="h-4 w-4" />
                  <span>Export to Excel (.xlsx)</span>
                </button>

                <button
                  onClick={handleEraseTechnicalDb}
                  disabled={erasingTechnicalDb}
                  className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-900/40 hover:scale-105 transition-all disabled:opacity-50 shrink-0 border border-rose-500/40"
                  title="Completely erase all Technical Assessment records from the database"
                >
                  {erasingTechnicalDb ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-rose-200" />
                  )}
                  <span>Erase Local Database</span>
                </button>
              </div>
            </div>

            {/* Records Data Table */}
            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-[#0e1726]/90 shadow-2xl backdrop-blur-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#141d2e] text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Roll Number</th>
                    <th className="px-6 py-4">Year</th>
                    <th className="px-6 py-4">Branch</th>
                    <th className="px-6 py-4">Target Field</th>
                    <th className="px-6 py-4">Phone / Email</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Attempted Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredTechnical.length > 0 ? (
                    filteredTechnical.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-white">{row.studentName}</td>
                        <td className="px-6 py-4 font-mono text-cyan-300">
                          {row.rollNumber || <span className="text-slate-500 italic">1st Year (Exempt)</span>}
                        </td>
                        <td className="px-6 py-4">{row.year}</td>
                        <td className="px-6 py-4">
                          <span className="rounded-md bg-cyan-950/80 border border-cyan-500/30 px-2.5 py-1 text-[11px] font-bold text-cyan-300">
                            {row.branch}
                          </span>
                        </td>
                        <td className="px-6 py-4">{row.field}</td>
                        <td className="px-6 py-4 space-y-0.5">
                          <div>{row.phone}</div>
                          <div className="text-[11px] text-slate-400">{row.email}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-400">
                          {row.score} / {row.maxScore} ({Math.round((row.score / row.maxScore) * 100)}%)
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                          {new Date(row.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-slate-500 font-bold">
                        No technical assessment records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: SCHEDULED ROUND CONTROLS & RECORDS */}
        {activeTab === "scheduled" && (
          <div className="space-y-6">
            
            {/* Scheduled Round Controls Card */}
            <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-b from-[#240d16]/90 to-[#18070e]/90 p-6 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-rose-900/40 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-rose-400" />
                    <span>Module 04 Access Window Controls</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Control whether students can access Module 4 right now or schedule an automated start & end time.
                  </p>
                </div>

                {settingsSuccess && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full">
                    ✓ {settingsSuccess}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                
                {/* Manual Toggle */}
                <div className="flex items-center space-x-3 bg-rose-950/30 border border-rose-500/30 p-4 rounded-2xl">
                  <input
                    type="checkbox"
                    id="roundToggle"
                    checked={isScheduledRoundOpen}
                    onChange={(e) => setIsScheduledRoundOpen(e.target.checked)}
                    className="h-5 w-5 rounded accent-rose-500 cursor-pointer"
                  />
                  <label htmlFor="roundToggle" className="cursor-pointer text-xs font-bold text-white">
                    Scheduled Round Open State: <span className={isScheduledRoundOpen ? "text-emerald-400" : "text-rose-400"}>
                      {isScheduledRoundOpen ? "OPEN TO STUDENTS" : "CLOSED"}
                    </span>
                  </label>
                </div>

                {/* Scheduled Start Time */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Window Start Time</label>
                  <input
                    type="datetime-local"
                    value={scheduledStartTime}
                    onChange={(e) => setScheduledStartTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-[#160a12] px-3.5 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>

                {/* Scheduled End Time */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Window End Time</label>
                  <input
                    type="datetime-local"
                    value={scheduledEndTime}
                    onChange={(e) => setScheduledEndTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-[#160a12] px-3.5 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>

              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-rose-500/20 hover:scale-105 transition-all disabled:opacity-50"
                >
                  {savingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Save Gating Settings</span>
                </button>
              </div>
            </div>

            {/* Filter & Excel Download Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-[#0e1726]/90 p-4 shadow-xl backdrop-blur-xl">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search candidate or roll..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-[#141d2e] pl-9 pr-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="rounded-xl border border-slate-800 bg-[#141d2e] px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                  >
                    <option value="ALL">All Branches</option>
                    <option value="IT">IT</option>
                    <option value="CS">CS</option>
                    <option value="AIML">AIML</option>
                    <option value="DS">DS</option>
                    <option value="EC">EC</option>
                    <option value="EN">EN</option>
                  </select>
                </div>
              </div>

              {eraseSuccess && (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-3.5 text-xs font-bold text-emerald-300 flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{eraseSuccess}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => exportToExcel(filteredScheduled, "Scheduled_Round_Records")}
                  className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-500/20 hover:scale-105 transition-all shrink-0"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Scheduled Records (.xlsx)</span>
                </button>

                <button
                  onClick={handleEraseScheduledDb}
                  disabled={erasingScheduledDb}
                  className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-900/40 hover:scale-105 transition-all disabled:opacity-50 shrink-0 border border-rose-500/40"
                  title="Completely erase all Scheduled Interview records from the database"
                >
                  {erasingScheduledDb ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-rose-200" />
                  )}
                  <span>Erase Local Database</span>
                </button>
              </div>
            </div>

            {/* Scheduled Records Table */}
            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-[#0e1726]/90 shadow-2xl backdrop-blur-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#141d2e] text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Roll Number</th>
                    <th className="px-6 py-4">Year</th>
                    <th className="px-6 py-4">Branch</th>
                    <th className="px-6 py-4">Target Field</th>
                    <th className="px-6 py-4">Phone / Email</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Submitted Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredScheduled.length > 0 ? (
                    filteredScheduled.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-white">{row.studentName}</td>
                        <td className="px-6 py-4 font-mono text-rose-300">
                          {row.rollNumber || <span className="text-slate-500 italic">1st Year (Exempt)</span>}
                        </td>
                        <td className="px-6 py-4">{row.year}</td>
                        <td className="px-6 py-4">
                          <span className="rounded-md bg-rose-950/80 border border-rose-500/30 px-2.5 py-1 text-[11px] font-bold text-rose-300">
                            {row.branch}
                          </span>
                        </td>
                        <td className="px-6 py-4">{row.field}</td>
                        <td className="px-6 py-4 space-y-0.5">
                          <div>{row.phone}</div>
                          <div className="text-[11px] text-slate-400">{row.email}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-400">
                          {row.score} / {row.maxScore} ({Math.round((row.score / row.maxScore) * 100)}%)
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                          {new Date(row.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-slate-500 font-bold">
                        No scheduled round attempt records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: DYNAMIC OPTIONS & HOD SETTINGS */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Dynamic Branch & Field Options Manager */}
            <div className="rounded-3xl border border-slate-800 bg-[#0e1726]/90 p-6 space-y-6 shadow-2xl backdrop-blur-xl">
              <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Settings className="h-5 w-5 text-indigo-400" />
                <span>Manage Dynamic Branches & Preferred Fields</span>
              </h3>

              {/* Branch Section */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase">Branches ({branches.length})</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Code (e.g. AI)"
                    value={newBranchCode}
                    onChange={(e) => setNewBranchCode(e.target.value)}
                    className="w-24 rounded-xl border border-slate-800 bg-[#141d2e] px-3 py-1.5 text-xs text-white uppercase focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Full Branch Name"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-800 bg-[#141d2e] px-3 py-1.5 text-xs text-white focus:border-indigo-500"
                  />
                  <button
                    onClick={handleAddBranch}
                    className="inline-flex items-center space-x-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {branches.map((b) => (
                    <span
                      key={b.id}
                      className="inline-flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-300"
                    >
                      <span>{b.name} ({b.code})</span>
                      <button onClick={() => handleDeleteOption("branch", b.id)} className="text-slate-500 hover:text-rose-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Field Section */}
              <div className="space-y-3 border-t border-slate-800 pt-4">
                <span className="text-xs font-bold text-slate-300 uppercase">Preferred Target Fields ({fields.length})</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Field Name (e.g. Cloud Engineer)"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-800 bg-[#141d2e] px-3 py-1.5 text-xs text-white focus:border-indigo-500"
                  />
                  <button
                    onClick={handleAddField}
                    className="inline-flex items-center space-x-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {fields.map((f) => (
                    <span
                      key={f.id}
                      className="inline-flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-300"
                    >
                      <span>{f.name}</span>
                      <button onClick={() => handleDeleteOption("field", f.id)} className="text-slate-500 hover:text-rose-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* HOD Profile Manager */}
            <div className="rounded-3xl border border-slate-800 bg-[#0e1726]/90 p-6 space-y-4 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-cyan-400" />
                  <span>Update HOD Profile Card</span>
                </h3>
                {hodSuccess && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full">
                    ✓ {hodSuccess}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={hodProfile.name}
                    onChange={(e) => setHodProfile({ ...hodProfile, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-[#141d2e] px-3.5 py-2 text-xs text-white focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Designation</label>
                  <input
                    type="text"
                    value={hodProfile.designation}
                    onChange={(e) => setHodProfile({ ...hodProfile, designation: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-[#141d2e] px-3.5 py-2 text-xs text-white focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Mobile</label>
                    <input
                      type="text"
                      value={hodProfile.mobile}
                      onChange={(e) => setHodProfile({ ...hodProfile, mobile: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-[#141d2e] px-3.5 py-2 text-xs text-white focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={hodProfile.email}
                      onChange={(e) => setHodProfile({ ...hodProfile, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-[#141d2e] px-3.5 py-2 text-xs text-white focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Photo URL</label>
                  <input
                    type="text"
                    value={hodProfile.photoUrl}
                    onChange={(e) => setHodProfile({ ...hodProfile, photoUrl: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-[#141d2e] px-3.5 py-2 text-xs text-white focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Welcome Message</label>
                  <textarea
                    rows={3}
                    value={hodProfile.welcomeMessage}
                    onChange={(e) => setHodProfile({ ...hodProfile, welcomeMessage: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-[#141d2e] p-3 text-xs text-white leading-relaxed focus:border-cyan-500"
                  />
                </div>

                <div className="pt-2 text-right">
                  <button
                    onClick={handleSaveHod}
                    disabled={savingHod}
                    className="inline-flex items-center space-x-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-cyan-500 shadow-md"
                  >
                    {savingHod ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span>Save HOD Profile</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
