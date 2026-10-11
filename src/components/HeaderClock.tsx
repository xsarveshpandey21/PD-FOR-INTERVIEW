"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function HeaderClock() {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setTimeStr(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2 rounded-lg bg-[#111827] px-3 py-1.5 border border-[#1e293b] text-cyan-400 font-mono text-xs shadow-inner">
      <Clock className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
      <span>{timeStr || "--:--:-- --"}</span>
    </div>
  );
}
