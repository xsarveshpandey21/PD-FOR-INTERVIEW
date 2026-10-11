"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Shield, FileText, Code2, MessageSquare, Clock, Sparkles, Home, Layers } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Auto sign-out admin session if navigating to any non-admin portal
    if (!pathname.startsWith("/admin")) {
      const hasToken = typeof window !== "undefined" && localStorage.getItem("admin_token");
      const hasCookie = typeof document !== "undefined" && document.cookie.includes("pd_admin_jwt");

      if (hasToken || hasCookie) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("admin_token");
        }
        fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
        setIsAdminLoggedIn(false);
        return;
      }
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    fetch("/api/admin/me", { headers })
      .then((res) => res.json())
      .then((data) => {
        setIsAdminLoggedIn(!!data.authenticated);
      })
      .catch(() => setIsAdminLoggedIn(false));
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/modules", label: "Dashboard", icon: Layers },
    { href: "/ats-builder", label: "ATS Resume", icon: FileText },
    { href: "/technical-interview", label: "Technical Test", icon: Code2 },
    { href: "/mock-interview", label: "Mock Practice", icon: MessageSquare },
    { href: "/scheduled-interview", label: "Scheduled Round", icon: Clock },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-xl shadow-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand Logo & College Header */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-amber-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#090d16]">
              <GraduationCap className="h-6 w-6 text-cyan-400 group-hover:rotate-6 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                S R Group of Institutions, Lucknow
              </span>
              <span className="inline-flex items-center space-x-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                <Sparkles className="h-2.5 w-2.5 text-cyan-400" />
                <span>PD Cell</span>
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-400">
              Department of Placement & Personality Development
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/60 border border-slate-800/80 p-1 rounded-2xl backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Staff / Login Portal Button */}
        <div className="flex items-center space-x-3">
          {isAdminLoggedIn ? (
            <Link
              href="/admin"
              className="inline-flex items-center space-x-2 rounded-xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950 to-slate-900 px-4 py-2 text-xs font-bold text-indigo-300 hover:text-white hover:border-indigo-400 shadow-lg shadow-indigo-500/20 transition-all"
            >
              <Shield className="h-4 w-4 text-indigo-400" />
              <span>Staff Console</span>
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="inline-flex items-center space-x-2 rounded-xl border border-rose-500/30 bg-rose-950/30 px-3.5 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-900/50 hover:border-rose-500/50 transition-all shadow-sm"
            >
              <Shield className="h-3.5 w-3.5 text-rose-400" />
              <span>Login Portal</span>
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
