"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, FileText, Activity, Server, Lock, Key, Award, List, Clock, ChevronDown, Network, Database, Settings } from "lucide-react";
import { useScan } from "../../context/ScanContext"; 
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, YAxis } from "recharts";

export default function IntelligenceCore() {
  const { layer2Data, isScanning } = useScan();
  const currentPath = usePathname();
  const d = layer2Data as any;

  // 🛡️ STATE FOR THE NEW LEDGER DROPDOWN
  const [showInfraLedger, setShowInfraLedger] = useState(false);
  // 🛡️ RAW JSON TERMINAL STATE
  const [showRawJson, setShowRawJson] = useState(false);

  if (isScanning || !d) return <LoadingState />;

  const cbom = d.cryptographic_bill_of_materials || {};
  const cert = cbom.certificate || {};
  const pqc = d.pqc_migration_recommendations || {};
  const timeline = d.visualization_data?.pqc_migration_timeline || [];
  const infra = cbom.discovered_assets || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-amber-100 to-yellow-300 text-slate-900 pb-16 font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#8B1832_1px,transparent_1px)] [background-size:24px_24px] opacity-10 -z-10" />
      
      <nav className="bg-[#8B1832] text-white sticky top-0 z-50 print:hidden shadow-lg border-b border-[#5A0F20]">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 mr-4">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-1 rounded"><ShieldAlert className="w-5 h-5 text-[#8B1832]"/></div>
              <span className="font-black text-white tracking-tight text-lg leading-none uppercase hidden sm:block">Taskforce</span>
            </div>
            
            <div className="hidden xl:flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider">
              <Link href="/" className="text-rose-100 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition-colors">Command Center</Link>
              <span className="bg-white/10 text-white px-3 py-2 rounded-md border border-white/20 cursor-pointer">CBOM</span>
              <Link href="/telemetry" className="text-rose-100 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition-colors">Telemetry</Link>
              <Link href="/history" className="text-rose-100 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition-colors">History</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => window.print()} className="bg-slate-900 hover:bg-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-md rounded transition-colors print:hidden">
               <FileText size={14} /> Export PDF
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 mt-6 print:m-0 print:p-0 space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
           <div>
             <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">CBOM</h1>
             <p className="text-xs font-bold text-[#8B1832] uppercase tracking-widest mt-1">Cryptographic Inventory & Raw Infrastructure Intelligence</p>
           </div>
           <div className="bg-white/95 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg shadow-sm text-xs font-bold text-slate-600 flex items-center gap-2">
             <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
             LIVE ANALYSIS ACTIVE
           </div>
        </div>

        {/* 1. ASSET PROFILE (FULL WIDTH) */}
        <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl flex justify-between items-center relative overflow-hidden">
           <div className="relative z-10">
             <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Target Asset Discovered</p>
             <h2 className="text-3xl font-black text-[#8B1832] mt-2">{d.asset_profile?.hostname || "UNKNOWN"}</h2>
             <p className="text-sm font-mono text-slate-500 mt-1">{d.asset_profile?.ip_address}:{d.asset_profile?.port} &bull; {d.asset_profile?.service?.toUpperCase()}</p>
           </div>
           <div className="absolute right-0 bottom-0 p-4 opacity-5 pointer-events-none"><Server size={140} /></div>
        </div>

        {/* 2 & 3. CBOM CORE + CIPHER ANALYSIS (2 COLUMNS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
           
           {/* CBOM Core */}
           <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl flex flex-col h-full">
              <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2"><Lock className="w-5 h-5 text-indigo-500"/> CBOM Core</h3>
              <div className="grid grid-cols-2 gap-4 mb-6 flex-1">
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Protocol & Ver</p>
                    <p className="text-lg font-bold text-slate-900">{cbom.tls?.protocol} {cbom.tls?.version}</p>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Supported Suites</p>
                    <p className="text-lg font-bold text-slate-900">{cbom.tls?.supported_cipher_count || cbom.cipher_inventory?.total_ciphers || 0} Vectors</p>
                 </div>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-inner mt-auto">
                 <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">Negotiated Cipher Path</p>
                 <p className="text-sm font-mono font-bold text-slate-100 break-all">{cbom.tls?.negotiated_cipher || "N/A"}</p>
              </div>
           </div>

           {/* Cipher Analysis */}
           <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl flex flex-col h-full">
              <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2"><Database className="w-5 h-5 text-emerald-500"/> Cipher Analysis</h3>
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Encryption & Hash Algorithms</p>
                      <p className="text-xs font-mono font-bold text-slate-900">{(cbom.cipher_inventory?.encryption_algorithms || []).join(', ')} / {(cbom.cipher_inventory?.hash_algorithms || []).join(', ')}</p>
                    </div>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Key Exchange Methods</p>
                      <p className="text-xs font-mono font-bold text-slate-900">{(cbom.cipher_inventory?.key_exchange_methods || []).join(', ') || "N/A"}</p>
                    </div>
                 </div>
                 <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex justify-between items-center shadow-sm">
                    <div>
                      <p className="text-[10px] font-bold text-rose-800 uppercase tracking-widest mb-1">Weak Ciphers Detected</p>
                      <p className="text-xs font-mono font-bold text-rose-700">{(cbom.cipher_inventory?.weak_ciphers || []).join(', ') || "None Detected"}</p>
                    </div>
                    <span className="bg-white border border-rose-200 text-rose-600 font-black px-3 py-1 rounded-full text-xs">{cbom.cipher_inventory?.weak_cipher_count || 0}</span>
                 </div>
              </div>
           </div>

        </div>

        {/* 4. CERTIFICATE DETAILS (FULL WIDTH) */}
        <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2"><Award className="w-5 h-5 text-[#8B1832]"/> X.509 Certificate Identity</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
             <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl flex flex-col justify-center col-span-2 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Subject / Domain</p>
                <p className="text-sm font-bold text-slate-800 truncate" title={cert.subject}>{cert.subject?.split('CN=')[1] || cert.subject || "N/A"}</p>
             </div>
             <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl flex flex-col justify-center col-span-2 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Issuing Authority</p>
                <p className="text-sm font-bold text-slate-800 truncate" title={cert.issuer}>{cert.issuer?.split('O=')[1]?.split(',')[0] || cert.issuer || "N/A"}</p>
             </div>
             
             <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl flex flex-col justify-center shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Signature Algorithm</p>
                <p className="text-xs font-mono font-bold text-slate-800">{cert.signature_algorithm}</p>
             </div>
             <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl flex flex-col justify-center shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Public Key / Size</p>
                <p className="text-xs font-bold text-slate-800">{cert.public_key_algorithm} <span className="text-[#8B1832] font-mono ml-1">({cert.key_size} bit)</span></p>
             </div>
             <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl flex flex-col justify-center shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Security Bits</p>
                <p className="text-xs font-bold text-slate-800">{cert.security_bits || "N/A"}</p>
             </div>
             <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl flex flex-col justify-center shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Validity Window</p>
                <p className="text-xs font-bold text-slate-800">{cert.validity_days} Days <span className="text-emerald-500 ml-1">Active</span></p>
             </div>
          </div>
        </div>

        {/* 5 & 6. THREAT MODEL + MIGRATION (2 COLUMNS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
           
           {/* Threat Model */}
           <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl flex flex-col h-full">
               <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2"><List className="w-5 h-5 text-rose-500"/> Quantum Threat Model</h3>
               <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                   {(d.quantum_risk_analysis?.quantum_threat_model?.quantum_threat_analysis || []).map((t: any, i: number) => (
                      <div key={i} className="flex flex-col gap-2 bg-slate-50 border border-slate-100 p-5 rounded-xl shadow-sm">
                         <p className="text-[10px] font-bold text-rose-600 bg-white border border-rose-100 px-3 py-1.5 rounded-lg w-max uppercase tracking-widest" title={t.algorithm}>{t.algorithm}</p>
                         <p className="text-xs font-semibold text-slate-700">"{t.quantum_vulnerability_reason}"</p>
                      </div>
                   ))}
                   {!(d.quantum_risk_analysis?.quantum_threat_model?.quantum_threat_analysis?.length) && <p className="text-xs text-slate-500">No specific threat models generated.</p>}
                </div>
            </div>

            {/* Migration Plan */}
            <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl flex flex-col h-full">
               <h3 className="text-sm font-bold text-slate-800 mb-6 flex justify-between items-center">PQC Migration Plan <span className="text-[#8B1832] bg-rose-50 border border-rose-100 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest">STRATEGY</span></h3>
               <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl shadow-sm">
                     <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0"><Key className="w-6 h-6 text-[#8B1832]"/></div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Recommended Key Exchange</p>
                        <p className="text-base font-black text-slate-900">{pqc.recommended_algorithms?.key_exchange || "ML-KEM"}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl shadow-sm">
                     <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0"><Lock className="w-6 h-6 text-emerald-600"/></div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Recommended Signature</p>
                        <p className="text-base font-black text-slate-900">{pqc.recommended_algorithms?.signature || "ML-DSA"}</p>
                     </div>
                  </div>
                  <div className="bg-slate-900 p-5 rounded-xl mt-auto border border-slate-800 shadow-inner">
                     <p className="text-[11px] font-bold text-slate-100 leading-relaxed">{pqc.strategy || "Execute hybrid architecture phaseout."}</p>
                  </div>
               </div>
            </div>

        </div>

        {/* 🛡️ NEW ROW 7: DISCOVERED INFRASTRUCTURE DROPDOWN (FULL WIDTH) */}
        <div className="mt-8">
            <button onClick={() => setShowInfraLedger(!showInfraLedger)} className="w-full flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-900 bg-slate-100 border border-slate-200 hover:bg-slate-200 px-6 py-5 rounded-2xl transition-colors">
              <span className="flex items-center gap-3"><Network className="w-6 h-6 text-blue-500"/> Discovered Network Infrastructure Ledger</span>
              <ChevronDown className={`w-6 h-6 transition-transform ${showInfraLedger ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showInfraLedger && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="w-full mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 shadow-sm">
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Web Services</p>
                       {infra.services?.map((s:any, i:number) => (
                          <div key={i} className="font-mono text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 mb-2 last:mb-0 shadow-sm flex justify-between items-center">
                            <span className="font-bold">Port {s.port}</span><span className="text-[10px] text-slate-400 uppercase tracking-wider">{s.asset_type}</span>
                          </div>
                       ))}
                       {!infra.services?.length && <p className="text-xs text-slate-400 font-mono">None discovered.</p>}
                    </div>
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 shadow-sm">
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">VPN Endpoints</p>
                       {infra.vpn_endpoints?.map((s:any, i:number) => (
                          <div key={i} className="font-mono text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 mb-2 last:mb-0 shadow-sm flex justify-between items-center">
                            <span className="font-bold">Port {s.port}</span><span className="text-[10px] text-slate-400 uppercase tracking-wider">{s.service || s.asset_type}</span>
                  </div>
               ))}
               {!infra.vpn_endpoints?.length && <p className="text-xs text-slate-400 font-mono">None discovered.</p>}
            </div>
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 shadow-sm">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Active APIs</p>
               {infra.apis?.map((s:any, i:number) => (
                  <div key={i} className="font-mono text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 mb-2 last:mb-0 shadow-sm flex justify-between items-center">
                    <span className="font-bold">Port {s.port}</span><span className="text-[10px] text-slate-400 uppercase tracking-wider">{s.asset_type}</span>
                  </div>
               ))}
               {!infra.apis?.length && <p className="text-xs text-slate-400 font-mono">None discovered.</p>}
            </div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>

        {/* 8. TIMELINE + FORECAST (2 COLUMNS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
           <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl flex flex-col h-full">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-sm font-bold text-slate-800">Risk Forecast Timeline</h3>
               <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-[#8B1832]"/> Quantum Risk</span>
             </div>
             <div className="w-full h-[250px] bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-inner">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={d.visualization_data?.quantum_risk_forecast || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B1832" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8B1832" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="risk" stroke="#8B1832" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl flex flex-col h-full">
             <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2"><Clock className="w-5 h-5 text-[#8B1832]"/> Recommended Phased Deployment</h3>
             <div className="flex flex-col gap-4 justify-center h-full">
                {timeline.map((phase: any, idx: number) => (
                   <div key={idx} className="relative bg-slate-50 p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                      <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{phase.start_year} - {phase.end_year}</p>
                      <p className="text-sm font-black text-[#8B1832] leading-tight text-right w-1/2">{phase.phase}</p>
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* 9. RAW JSON TERMINAL (FOR ENGINEERS) */}
        <div className="mt-8 print:hidden">
          <div className="bg-slate-950 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
            <button onClick={() => setShowRawJson(!showRawJson)} className="w-full bg-slate-900 px-6 py-5 flex items-center justify-between hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-emerald-400" />
                <div className="text-left">
                  <h3 className="font-black text-sm uppercase tracking-widest text-white">Engine Logic Object Buffer</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">View Raw Backend JSON Payload</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${showRawJson ? "rotate-180" : ""}`} />
            </button>
            
            <AnimatePresence>
              {showRawJson && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-slate-800">
                  <div className="p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
                    <pre className="font-mono text-xs text-emerald-300 leading-relaxed">
                      {JSON.stringify(d, null, 2)}
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-100 via-amber-50 to-yellow-100 relative overflow-hidden">
      <Activity size={72} className="text-[#8B1832] mb-6 animate-pulse" strokeWidth={2} />
      <h2 className="text-xl font-black text-[#8B1832] uppercase tracking-[0.2em]">Loading Dashboard</h2>
    </div>
  );
}