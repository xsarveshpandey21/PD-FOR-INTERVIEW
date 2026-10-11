import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "PD Mock Technical Assessment Platform",
  description: "Official Placement & Personality Development (PD) Department Assessment & ATS Resume Platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#060913] text-slate-100 antialiased selection:bg-cyan-600 selection:text-white">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-800/80 bg-[#090d16] py-6 text-center text-xs text-slate-500">
            <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p>© {new Date().getFullYear()} PD Department — Placement & Personality Development Cell.</p>
              <div className="flex items-center space-x-4">
                <span className="text-slate-400 font-medium">Head of Department: Prof. Mahima Sahay</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
