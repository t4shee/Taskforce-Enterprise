"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldAlert, FileDown, Plus, AlertTriangle, Globe, Activity, Lock, Key, ShieldCheck, LogOut, CheckCircle, Target, Workflow, BrainCircuit, Server, ChevronRight, Hourglass, Landmark } from "lucide-react";
import { useScan } from "../context/ScanContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 🛡️ CUSTOM SVG SEMI-CIRCLE GAUGE
const MiniGauge = ({ value, isRisk }: { value: number, isRisk: boolean }) => {
  const strokeColor = isRisk ? "#e11d48" : "#059669"; 
  const radius = 20;
  const circumference = Math.PI * radius;
  const safeValue = Math.min(Math.max(Math.abs(value), 0), 100);
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="relative w-12 h-6 flex flex-col items-center justify-end shrink-0">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 50 25">
        <path d="M 5 25 A 20 20 0 0 1 45 25" fill="none" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
        <path d="M 5 25 A 20 20 0 0 1 45 25" fill="none" stroke={strokeColor} strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
      </svg>
      <span className="text-[7px] font-bold text-slate-400 uppercase mt-1 absolute -bottom-3">{isRisk ? 'Risk' : 'Safe'}</span>
    </div>
  );
};

export default function CommandCenter() {
  const { layer2Data, isScanning, targetUrl, setTargetUrl, executeScan, clearCurrentScan } = useScan();
  const router = useRouter(); 
  
  const [driftYear] = useState(2025);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeRiskIndex, setActiveRiskIndex] = useState(0);

  useEffect(() => {
    const session = localStorage.getItem("t4skforce_active_session");
    if (!session) router.push("/login");
    else setIsAuthorized(true);
  }, [router]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetUrl) executeScan(targetUrl);
  };

  const handleLogout = () => {
    localStorage.removeItem("t4skforce_active_session");
    window.alert("Logged out successfully!"); 
    router.push("/login");
  };

  if (!isAuthorized) return <div className="min-h-screen bg-[#8B1832]" />;

  const data = layer2Data as any;
  let dynamicReadiness = 0;
  let dynamicHndl = 0;
  let baseAgility = 0;
  
  if (data) {
    const yearsAdvanced = driftYear - 2025;
    const baseReadiness = data.quantum_risk_analysis?.quantum_readiness_score?.quantum_readiness_score || 0;
    const baseHndl = data.quantum_risk_analysis?.hndl_probability || 0; 
    baseAgility = data.crypto_agility?.crypto_agility_score || 0;       
    
    dynamicReadiness = Math.max(0, Math.floor(baseReadiness - (yearsAdvanced * 2.8)));
    dynamicHndl = Math.min(0.99, baseHndl + (yearsAdvanced * 0.012));
  }

  // DATA EXTRACTION
  const riskDetails = data?.security_assessment?.risk_score_details || [];
  const readinessDetails = data?.quantum_risk_analysis?.readiness_details || [];
  const hndlDetails = data?.quantum_risk_analysis?.hndl_details || [];
  const agilityDetails = data?.crypto_agility?.agility_details || [];
  
  const aiInsights = data?.ai_risk_insights || {};
  const compliance = aiInsights.banking_compliance_context || {};

  // SMART FORMATTER
  const formatValue = (val: any) => {
    if (Array.isArray(val)) return val.join(", ");
    if (typeof val === 'object' && val !== null) {
      return Object.entries(val).filter(([k,v]) => v).map(([k]) => k.replace(/_/g, ' ').toUpperCase()).join(' | ');
    }
    return String(val);
  };

  if (!data && !isScanning) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-br from-rose-200 via-amber-100 to-yellow-300">
        <div className="absolute inset-0 bg-[radial-gradient(#8B1832_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />
        <button onClick={handleLogout} className="absolute top-6 right-6 flex items-center gap-2 text-[10px] font-bold text-[#8B1832] bg-white/80 hover:bg-white px-5 py-2.5 rounded-full transition-all shadow-sm uppercase tracking-widest z-50">
          <LogOut className="w-3 h-3"/> Logout
        </button>
        <div className="w-20 h-20 bg-gradient-to-br from-[#8B1832] to-[#5A0F20] rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-[#8B1832]/20 relative z-10">
          <ShieldAlert className="w-10 h-10 text-amber-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3 relative z-10 uppercase">Taskforce <span className="text-[#8B1832]">Command</span></h1>
        <p className="text-[#8B1832] font-bold text-sm tracking-widest mb-12 uppercase relative z-10">Post-Quantum Risk Intelligence</p>
        
        <form onSubmit={handleScan} className="w-full max-w-2xl relative z-10 px-4">
          <div className="relative flex items-center bg-white border border-slate-200 rounded-full overflow-hidden p-2 shadow-2xl shadow-rose-900/20 transition-all focus-within:ring-4 focus-within:ring-rose-100 focus-within:border-[#8B1832]">
            <Search className="w-6 h-6 text-slate-400 ml-4" />
            <input type="text" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="Enter target domain (e.g., nfsu.ac.in)..." className="flex-1 bg-transparent border-none outline-none text-slate-900 px-4 py-3 placeholder:text-slate-400 font-medium" required />
            <button type="submit" className="bg-[#8B1832] hover:bg-[#6e1328] text-white font-bold text-sm px-8 py-3 rounded-full transition-colors shadow-md">Run Audit</button>
          </div>
        </form>
      </div>
    );
  }

  // 🛡️ LOADING SCREEN
  if (isScanning) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-100 via-amber-50 to-yellow-100 relative overflow-hidden">
        <Activity size={72} className="text-[#8B1832] mb-6 animate-pulse" strokeWidth={2} />
        <h2 className="text-xl font-black text-[#8B1832] uppercase tracking-[0.2em] mb-2">Analyzing Target</h2>
        <p className="text-sm font-bold text-slate-700 uppercase tracking-widest">{targetUrl}</p>
      </div>
    );
  }

  const asset = data.asset_profile || {};
  const exec = data.executive_summary || {};
  const meta = data.scan_summary || {};
  const cbom = data.cryptographic_bill_of_materials || {};

  const radius = 46; 
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (dynamicReadiness / 100) * circumference;
  
  const readinessColor = dynamicReadiness >= 80 ? '#059669' : dynamicReadiness >= 50 ? '#ea580c' : '#e11d48';
  let badgeStyle = "bg-rose-50 border-rose-200 text-rose-700";
  if (dynamicReadiness >= 80) badgeStyle = "bg-emerald-50 border-emerald-200 text-emerald-700";
  else if (dynamicReadiness >= 50) badgeStyle = "bg-amber-50 border-amber-200 text-amber-700";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-rose-200 via-amber-100 to-yellow-300 pb-16 font-sans text-slate-900 relative">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#8B1832_1px,transparent_1px)] [background-size:24px_24px] opacity-10 -z-10" />

      {/* TOP NAVIGATION */}
      <nav className="bg-[#8B1832] text-white sticky top-0 z-50 print:hidden shadow-lg border-b border-[#5A0F20]">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 mr-4">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-1 rounded"><ShieldAlert className="w-5 h-5 text-[#8B1832]"/></div>
              <span className="font-black text-white tracking-tight text-lg leading-none uppercase hidden sm:block">Taskforce</span>
            </div>
            <div className="hidden xl:flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider">
              <span className="bg-white/10 text-white px-3 py-2 rounded-md border border-white/20 cursor-pointer">Command Center</span>
              <Link href="/intelligence" className="text-rose-100 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition-colors">CBOM</Link>
              <Link href="/telemetry" className="text-rose-100 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition-colors">Telemetry</Link>
              <Link href="/history" className="text-rose-100 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition-colors">History</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase">Welcome, {typeof window !== "undefined" ? localStorage.getItem("t4skforce_active_session") || "Admin" : "Admin"}</span>
              <span className="text-[9px] text-rose-200 tracking-widest">Active Session</span>
            </div>
            <div className="flex gap-2">
              <button onClick={clearCurrentScan} className="flex items-center gap-2 text-[10px] font-bold text-[#8B1832] bg-white hover:bg-rose-50 px-3 py-2 rounded transition-all shadow-sm uppercase tracking-widest">
                <Plus className="w-3 h-3"/> New
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-2 text-[10px] font-bold text-slate-900 bg-white hover:bg-slate-100 px-3 py-2 rounded transition-all shadow-sm uppercase tracking-widest">
                <FileDown className="w-3 h-3"/> Export
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 text-[10px] font-bold text-rose-100 bg-rose-900/50 hover:bg-rose-900 border border-rose-800 px-3 py-2 rounded transition-all shadow-sm uppercase tracking-widest">
                <LogOut className="w-3 h-3"/> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 mt-8 space-y-6">

        {/* HEADER SNAPSHOT */}
        <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Globe className="w-7 h-7 text-[#8B1832]" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{asset.hostname || 'UNKNOWN'}</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">{asset.ip_address}:{asset.port} &bull; {asset.asset_type?.replace('_', ' ').toUpperCase()}</p>
            </div>
          </div>
          <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1 shadow-inner text-xs w-full md:w-auto overflow-hidden">
            <div className="px-4 py-2 border-r border-slate-200">
              <p className="text-slate-400 font-bold mb-1 uppercase tracking-wider text-[9px]">Scan ID</p>
              <p className="font-mono text-slate-700 font-medium">{meta.scan_id?.split('-')[0] || 'N/A'}</p>
            </div>
            <div className="px-4 py-2 border-r border-slate-200 bg-white">
              <p className="text-slate-400 font-bold mb-1 uppercase tracking-wider text-[9px]">Engine</p>
              <p className="font-mono text-slate-700 font-medium">v{meta.scanner_version || '1.0'}</p>
            </div>
          </div>
        </div>

     {/* 🛡️ COMPACT AI THREAT BRIEFING */}
     <div className="bg-gradient-to-br from-rose-50 to-white border border-white/20 rounded-2xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between w-full h-full">
          <div className="absolute -right-8 -top-8 opacity-[0.03] pointer-events-none">
            <AlertTriangle className="w-48 h-48 text-[#8B1832]"/>
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#8B1832] animate-pulse"/>
              <p className="font-bold text-[10px] text-[#8B1832] uppercase tracking-widest">AI Threat Briefing</p>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
              "{exec.overall_risk_level || "UNKNOWN"} Risk Profile Detected."
            </h2>
            <p className="text-slate-600 mt-2 text-xs font-medium leading-relaxed max-w-sm">
              Classical public-key cryptography vulnerable to quantum attacks based on multi-factor analysis.
            </p>
          </div>

          <div className="relative z-10 bg-white/90 backdrop-blur-sm border border-emerald-100 p-4 rounded-xl shadow-sm flex items-start gap-3 mt-6 shrink-0 w-full">
            <div className="bg-emerald-100 p-1.5 rounded-lg shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest mb-0.5">Recommended Action</p>
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                {data.pqc_migration_recommendations?.recommended_actions?.[0] || "Execute hybrid TLS phaseout."}
              </p>
            </div>
          </div>
        </div>

        {/* 🛡️ NEW FULL WIDTH GLOBAL POSTURE */}
        <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-xl flex flex-col xl:flex-row gap-8 items-stretch w-full">
            
            {/* Left: Score & Gauge */}
            <div className="w-full xl:w-1/4 flex flex-col items-center justify-center border-b xl:border-b-0 xl:border-r border-slate-100 pb-8 xl:pb-0 xl:pr-8 shrink-0">
              <h2 className="font-bold text-xs text-slate-400 uppercase tracking-widest w-full text-center xl:text-left mb-6">Global Posture</h2>
              
              <div className="relative w-full max-w-[180px] flex items-center justify-center shrink-0">
                <svg className="w-full aspect-square transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  <motion.circle cx="50" cy="50" r={radius} fill="none" stroke={readinessColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }} transition={{ duration: 1.5, ease: "easeOut" }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter" style={{ color: readinessColor }}>{dynamicReadiness}</span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest text-center leading-tight">Readiness</span>
                </div>
              </div>
              <div className="w-full text-center mt-6">
                 <span className={`text-xs font-bold px-6 py-2.5 rounded-full uppercase tracking-widest border inline-block shadow-sm ${badgeStyle}`}>
                   {exec.quantum_readiness || 'UNVERIFIED'}
                 </span>
              </div>
            </div>

            {/* Right: Readiness Logic Grid */}
            <div className="w-full xl:w-3/4 flex flex-col justify-center">
              <h3 className="font-black text-xs text-indigo-500 uppercase tracking-widest mb-6 flex items-center gap-2 shrink-0"><CheckCircle className="w-4 h-4"/> Readiness Logic</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {readinessDetails.sort((a: any, b: any) => Math.abs(b.impact) - Math.abs(a.impact)).map((item: any, idx: number) => {
                   const isRisk = item.impact < 0; 
                   return (
                   <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                     <div>
                        <div className="flex justify-between items-start mb-3">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.parameter}</span>
                           <span className="text-[8px] font-bold border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 uppercase bg-white">{item.classification}</span>
                        </div>
                        <p className="text-xl font-black text-slate-800 leading-tight break-words mb-4">{formatValue(item.value)}</p>
                     </div>
                     <div className="mt-auto">
                        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                           <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Impact &bull; Weight</p>
                              <div className="flex items-baseline gap-1.5">
                                 <span className={`text-sm font-black ${isRisk ? 'text-rose-600' : 'text-indigo-600'}`}>{item.impact > 0 ? '+' : ''}{item.impact} pts</span>
                                 <span className="text-[9px] font-medium text-slate-400">({Math.round(item.weight * 100)}% WT)</span>
                              </div>
                           </div>
                           <MiniGauge value={item.impact} isRisk={isRisk} />
                        </div>
                     </div>
                   </div>
                   );
                })}
              </div>
            </div>
        </div>

        {/* 🛡️ ROW 2: SYMMETRICAL 50/50 LOGIC GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mt-6">
          
          {/* HNDL RATE & LOGIC */}
          <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-xl flex flex-col h-full">
            <div className="flex flex-col mb-6 shrink-0">
              <h2 className="font-bold text-xs text-slate-400 uppercase tracking-widest w-full text-left mb-6">Quantum Vulnerable</h2>
              <div className="flex justify-between items-end mb-4">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">HNDL Rate</span>
                <span className="text-4xl font-black text-[#8B1832]">{(dynamicHndl * 100).toFixed(0)}%</span>
              </div>
              <div className="flex gap-1.5 h-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`flex-1 rounded-sm ${i < (dynamicHndl * 10) ? 'bg-[#8B1832] shadow-sm' : 'bg-slate-100'}`} />
                ))}
              </div>
            </div>

            <h3 className="font-black text-xs text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-t border-slate-100 pt-6 shrink-0"><Target className="w-4 h-4"/> HNDL Exposure Logic</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {hndlDetails.map((item: any, idx: number) => {
                 const isRisk = item.impact > 0;
                 return (
                 <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full">
                   <div>
                      <div className="flex justify-between items-start mb-3">
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.parameter}</span>
                         <span className={`text-[8px] font-bold border px-1.5 py-0.5 rounded uppercase ${isRisk ? 'border-rose-200 text-rose-500 bg-rose-50' : 'border-emerald-200 text-emerald-600 bg-emerald-50'}`}>{item.classification}</span>
                      </div>
                      <p className="text-xl font-black text-slate-800 leading-tight break-words mb-4">{formatValue(item.value)}</p>
                   </div>
                   <div className="mt-auto">
                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                         <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Impact &bull; Weight</p>
                            <div className="flex items-baseline gap-1.5">
                               <span className={`text-sm font-black ${isRisk ? 'text-rose-600' : 'text-emerald-600'}`}>{item.impact > 0 ? '+' : ''}{Math.round(item.impact * 100)}%</span>
                               <span className="text-[10px] font-medium text-slate-400">({Math.round(item.weight * 100)}% WT)</span>
                            </div>
                         </div>
                         <MiniGauge value={item.impact * 100} isRisk={isRisk} />
                      </div>
                   </div>
                 </div>
                 );
              })}
            </div>
          </div>

          {/* CRYPTO AGILITY & LOGIC */}
          <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-xl flex flex-col h-full">
            <div className="flex flex-col mb-6 shrink-0">
              <h2 className="font-bold text-xs text-slate-400 uppercase tracking-widest w-full text-left mb-6">Crypto Agility</h2>
              <div className="flex justify-between items-end mb-4">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Agility Score</span>
                <span className="text-4xl font-black text-emerald-600">{baseAgility}</span>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                <motion.div initial={{ width: 0 }} animate={{ width: `${baseAgility}%` }} className="h-full bg-emerald-500" />
              </div>
            </div>

            <h3 className="font-black text-xs text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-t border-slate-100 pt-6 shrink-0"><Workflow className="w-4 h-4"/> Agility Logic</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {agilityDetails.map((item: any, idx: number) => {
                 const isRisk = item.impact < 0; 
                 return (
                 <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full">
                   <div>
                      <div className="flex justify-between items-start mb-3">
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.parameter}</span>
                         <span className={`text-[8px] font-bold border px-1.5 py-0.5 rounded uppercase ${isRisk ? 'border-rose-200 text-rose-500 bg-rose-50' : 'border-emerald-200 text-emerald-600 bg-emerald-50'}`}>{item.classification}</span>
                      </div>
                      <p className="text-xl font-black text-slate-800 leading-tight break-words mb-4">{formatValue(item.value)}</p>
                   </div>
                   <div className="mt-auto">
                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                         <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Impact &bull; Weight</p>
                            <div className="flex items-baseline gap-1.5">
                               <span className={`text-sm font-black ${isRisk ? 'text-rose-600' : 'text-emerald-600'}`}>{item.impact > 0 ? '+' : ''}{item.impact} pts</span>
                               <span className="text-[10px] font-medium text-slate-400">({Math.round(item.weight * 100)}% WT)</span>
                            </div>
                         </div>
                         <MiniGauge value={Math.abs(item.impact)} isRisk={isRisk} />
                      </div>
                   </div>
                 </div>
                 );
              })}
            </div>
          </div>

        </div>

        {/* TARGET ARCHITECTURE SNAPSHOT */}
        <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl mt-6">
          <h2 className="font-bold text-[10px] text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Server className="w-4 h-4 text-[#8B1832]"/> Target Architecture Snapshot</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col gap-1.5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Activity className="w-3 h-3 text-[#8B1832]"/> Protocol</span>
              <span className="text-sm font-black text-slate-900">{cbom.tls?.version || "N/A"}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col gap-1.5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Key className="w-3 h-3 text-indigo-500"/> Key Type</span>
              <span className="text-sm font-black text-slate-900">{cbom.certificate?.public_key_algorithm?.replace('Encryption', '').toUpperCase() || "N/A"} {cbom.certificate?.key_size || ""}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col gap-1.5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Lock className="w-3 h-3 text-amber-500"/> Cipher</span>
              <span className="text-sm font-black text-slate-900 truncate">{(cbom.cipher_inventory?.encryption_algorithms || [])[0]} {(cbom.cipher_inventory?.cipher_modes || [])[0]}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col gap-1.5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-emerald-500"/> Fwd Secrecy</span>
              <span className="text-sm font-black text-slate-900">{cbom.crypto_properties?.forward_secrecy_supported ? "Yes (Enabled)" : "No"}</span>
            </div>
          </div>
        </div>

        {/* 🛡️ INTERACTIVE RISK PARAMETERS HUD */}
        <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl mt-6 mb-16">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
             <AlertTriangle className="w-5 h-5 text-rose-500"/> Risk Parameters & Mathematical Impact
             <span className="ml-auto text-rose-700 bg-rose-50 border border-rose-200 px-4 py-1.5 rounded-full text-[10px] tracking-widest">RISK SCORE: {data?.security_assessment?.risk_score || "0"}</span>
           </h3>

           <div className="flex flex-col lg:flex-row gap-6 h-fit lg:h-[340px]">
              
              {/* Left Menu: The Heatmap Bar Chart */}
              <div className="w-full lg:w-1/3 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar h-full">
                {riskDetails.map((item: any, idx: number) => {
                   const impactRatio = Math.min((Math.abs(item.impact) / 30) * 100, 100);
                   const isPositive = item.impact > 0;
                   return (
                     <button
                       key={idx}
                       onClick={() => setActiveRiskIndex(idx)}
                       className={`relative text-left w-full p-4 rounded-xl border transition-all duration-200 overflow-hidden flex flex-col gap-1.5 shrink-0 ${
                         activeRiskIndex === idx ? "border-slate-300 shadow-md ring-2 ring-rose-100" : "bg-white border-slate-100 hover:border-slate-300"
                       }`}
                     >
                       <div className={`absolute left-0 top-0 bottom-0 opacity-10 transition-all ${isPositive ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${impactRatio}%` }} />
                       
                       <div className="flex justify-between items-center w-full relative z-10">
                         <span className={`text-xs font-bold ${activeRiskIndex === idx ? 'text-slate-900' : 'text-slate-700'}`}>{item.parameter}</span>
                         <ChevronRight className={`w-4 h-4 text-slate-300 transition-transform ${activeRiskIndex === idx ? 'translate-x-1 text-slate-600' : ''}`} />
                       </div>
                       <span className="text-[10px] font-mono text-slate-500 truncate w-full relative z-10">{formatValue(item.value)}</span>
                     </button>
                   );
                })}
              </div>

              {/* Right Details Panel: Deep Dive HUD */}
              <div className="w-full lg:w-2/3 bg-slate-50 border border-slate-100 rounded-xl p-6 md:p-8 relative overflow-hidden flex flex-col shadow-inner">
                 <AnimatePresence mode="wait">
                   {riskDetails[activeRiskIndex] && (
                     <motion.div
                       key={activeRiskIndex}
                       initial={{ opacity: 0, x: 10 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -10 }}
                       transition={{ duration: 0.2 }}
                       className="h-full flex flex-col relative z-10"
                     >
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h4 className="text-xl md:text-2xl font-black text-slate-900">{riskDetails[activeRiskIndex].parameter}</h4>
                            <p className="text-xs md:text-sm font-mono text-slate-600 mt-1">{formatValue(riskDetails[activeRiskIndex].value)}</p>
                          </div>
                          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-white border border-slate-200 px-3 py-1.5 rounded shadow-sm text-slate-700">
                            {riskDetails[activeRiskIndex].classification}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Impact Penalty</p>
                            <p className={`text-2xl font-black ${riskDetails[activeRiskIndex].impact > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {riskDetails[activeRiskIndex].impact > 0 ? '+' : ''}{riskDetails[activeRiskIndex].impact} <span className="text-sm font-sans text-slate-400 font-medium ml-1">pts</span>
                            </p>
                          </div>
                          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Algorithm Weight</p>
                            <p className="text-2xl font-black text-slate-700">{Math.round(riskDetails[activeRiskIndex].weight * 100)}%</p>
                          </div>
                        </div>

                        <div className="bg-white border-l-4 border-[#8B1832] p-5 rounded-r-xl shadow-sm mt-auto">
                          <p className="text-[10px] font-bold text-[#8B1832] uppercase tracking-widest mb-2 flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4"/> Engine Reasoning (Technical Basis)
                          </p>
                          <p className="text-sm font-medium text-slate-700 leading-relaxed">
                            {riskDetails[activeRiskIndex].technical_basis}
                          </p>
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

           </div>
        </div>

      </div>
    </motion.div>
  );
}