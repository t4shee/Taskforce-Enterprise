"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Clock, CalendarDays, Calendar, Activity, FileDown, Search, ShieldCheck, AlertTriangle, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useRouter } from "next/navigation";

interface ScanRecord {
  id: number;
  scan_id: string;
  target: string;
  risk: number;
  status: string;
  timestamp: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"daily" | "weekly" | "monthly">("daily");
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleTerminate = () => {
    localStorage.removeItem("t4skforce_active_session");
    window.alert("Session Terminated Successfully."); 
    router.push("/login");
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/scans?filter=${filter}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        // 🛡️ THE ARRAY SHIELD: Prevents the .filter crash!
        if (Array.isArray(data)) {
          setScans(data);
        } else {
          console.error("API returned a non-array object (likely an error):", data);
          setScans([]); // Safely fallback to an empty array
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Database fetch error:", err);
        setScans([]); // Safely fallback to an empty array on network failure
        setIsLoading(false);
      });
  }, [filter]);

  const formatIST = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }) + " IST";
  };

  // 🛡️ SAFE MATH: We guarantee validScans is always an array before filtering
  const validScans = Array.isArray(scans) ? scans : [];
  const totalScans = validScans.length;
  
  // Added optional chaining (?.) just in case a database row is missing a status
  const secureCount = validScans.filter((s) => s.status?.toLowerCase() === "secure").length;
  const criticalCount = validScans.filter((s) => s.status?.toLowerCase() === "critical").length;
  const moderateCount = validScans.filter((s) => s.status?.toLowerCase() === "moderate").length;

  const pieData = [
    { name: "Secure", value: secureCount, color: "#10b981" },
    { name: "Moderate", value: moderateCount, color: "#f59e0b" },
    { name: "Critical", value: criticalCount, color: "#e11d48" },
  ].filter(item => item.value > 0); 

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-amber-100 to-yellow-300 font-sans text-slate-900 pb-16 relative">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#8B1832_1px,transparent_1px)] [background-size:24px_24px] opacity-10 -z-10" />

      <nav className="bg-[#8B1832] text-white sticky top-0 z-50 shadow-lg border-b border-[#5A0F20]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 mr-4">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-1 rounded">
                <ShieldAlert className="w-5 h-5 text-[#8B1832]" />
              </div>
              <span className="font-black text-white tracking-tight text-lg leading-none uppercase hidden sm:block">
                Taskforce
              </span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider">
              <Link href="/" className="text-rose-100 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition-colors">Command Center</Link>
              <Link href="/intelligence" className="text-rose-100 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition-colors">CBOM</Link>
              <Link href="/telemetry" className="text-rose-100 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition-colors">Telemetry</Link>
              <span className="bg-[#5A0F20] text-white px-3 py-2 rounded-md border border-rose-900 shadow-inner cursor-default">History</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase">Welcome, {typeof window !== "undefined" ? localStorage.getItem("t4skforce_active_session") || "Admin" : "Admin"}</span>
              <span className="text-[9px] text-rose-200 tracking-widest">Active Session</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-slate-900 bg-white hover:bg-slate-100 px-3 py-2 rounded transition-all shadow-sm uppercase tracking-widest">
                <FileDown className="w-3 h-3"/> Export
              </button>
              <button onClick={handleTerminate} className="flex items-center gap-2 text-[10px] font-bold text-[#8B1832] bg-white hover:bg-rose-50 px-4 py-2 rounded transition-all shadow-sm uppercase tracking-widest">
                <ShieldAlert className="w-3 h-3"/> Terminate
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 mt-12 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Audit Database</h1>
          <p className="text-sm font-bold tracking-widest text-slate-400 uppercase mt-1">Enterprise PostgreSQL Telemetry Logs</p>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => setFilter("daily")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm ${filter === "daily" ? "bg-[#8B1832] text-white shadow-rose-900/20" : "bg-white/95 text-slate-500 backdrop-blur-md border border-slate-200 hover:border-rose-300"}`}>
            <Clock className="w-3.5 h-3.5" /> Daily (24H)
          </button>
          <button onClick={() => setFilter("weekly")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm ${filter === "weekly" ? "bg-[#8B1832] text-white shadow-rose-900/20" : "bg-white/95 text-slate-500 backdrop-blur-md border border-slate-200 hover:border-rose-300"}`}>
            <CalendarDays className="w-3.5 h-3.5" /> Weekly (7D)
          </button>
          <button onClick={() => setFilter("monthly")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm ${filter === "monthly" ? "bg-[#8B1832] text-white shadow-rose-900/20" : "bg-white/95 text-slate-500 backdrop-blur-md border border-slate-200 hover:border-rose-300"}`}>
            <Calendar className="w-3.5 h-3.5" /> Monthly (30D)
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 grid grid-cols-3 gap-6">
          <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl shadow-rose-900/5 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 bg-slate-50 w-24 h-24 rounded-full opacity-50 pointer-events-none" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Audits</p>
            <p className="text-4xl font-black text-slate-900">{isLoading ? "-" : totalScans}</p>
          </div>
          
          <div className="bg-emerald-50/90 backdrop-blur-sm border border-emerald-100/50 rounded-3xl p-6 shadow-2xl shadow-emerald-900/5 flex flex-col justify-center relative overflow-hidden">
            <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-100 opacity-50 pointer-events-none" />
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Quantum Safe</p>
            <p className="text-4xl font-black text-emerald-700">{isLoading ? "-" : secureCount}</p>
          </div>

          <div className="bg-rose-50/90 backdrop-blur-sm border border-rose-100/50 rounded-3xl p-6 shadow-2xl shadow-rose-900/5 flex flex-col justify-center relative overflow-hidden">
             <AlertTriangle className="absolute -right-4 -bottom-4 w-24 h-24 text-rose-100 opacity-50 pointer-events-none" />
            <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">Vulnerable</p>
            <p className="text-4xl font-black text-rose-700">{isLoading ? "-" : criticalCount}</p>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl shadow-rose-900/5 flex items-center justify-between">
           <div className="flex-1 h-32 w-full">
             {isLoading || pieData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-slate-300 animate-spin-slow" />
                </div>
             ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={35} outerRadius={55} paddingAngle={5} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
             )}
           </div>
           <div className="flex flex-col gap-2 pl-4 border-l border-slate-100">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"/><span className="text-[9px] font-bold text-slate-500 uppercase">Safe</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"/><span className="text-[9px] font-bold text-slate-500 uppercase">Warn</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"/><span className="text-[9px] font-bold text-slate-500 uppercase">Crit</span></div>
           </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-rose-900/10 border border-white/20 overflow-hidden">
          <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-4 grid grid-cols-12 gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <div className="col-span-2">Scan ID</div>
            <div className="col-span-3">Target Asset</div>
            <div className="col-span-3">Timestamp</div>
            <div className="col-span-2">Readiness</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          <div className="divide-y divide-slate-50 min-h-[300px] relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                <Activity className="w-8 h-8 text-[#8B1832] animate-spin-slow" />
              </div>
            ) : validScans.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-bold text-sm uppercase tracking-widest">
                No database records found for this timeframe.
              </div>
            ) : (
              validScans.map((scan) => (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={scan.id} className="px-8 py-5 grid grid-cols-12 gap-4 items-center hover:bg-rose-50/30 transition-colors group">
                  <div className="col-span-2 font-mono text-xs font-bold text-slate-600">{scan.scan_id || "SCN"}</div>
                  <div className="col-span-3 font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Search className="w-3 h-3 text-slate-300 group-hover:text-[#8B1832] transition-colors" /> {scan.target}
                  </div>
                  <div className="col-span-3 font-mono text-xs font-medium text-slate-500">
                    {formatIST(scan.timestamp)}
                  </div>
                  <div className="col-span-2">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      scan.status?.toLowerCase() === "critical" ? "bg-rose-50 text-rose-700 border-rose-200" :
                      scan.status?.toLowerCase() === "moderate" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      {scan.status || "Unknown"} ({scan.risk}%)
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <Link href={`/history/report/${scan.scan_id || scan.id}`} className="text-[10px] font-bold text-[#8B1832] bg-rose-50 hover:bg-rose-100 border border-rose-100 px-4 py-2 rounded-lg uppercase tracking-widest inline-flex items-center gap-1 transition-colors">
                      View Report <FileDown className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}