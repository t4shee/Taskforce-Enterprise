"use client";
import { motion } from "framer-motion";
import { Milestone, Search, CircuitBoard, Network } from "lucide-react";

const steps = [
  { id: 1, title: "Asset Discovery", year: "2025", desc: "Generate full CBOM and map risks.", icon: <Search />, x: "10%", y: "10%", status: "active" },
  { id: 2, title: "Hybrid PQC", year: "2027", desc: "Implement hybrid TLS protocols.", icon: <Network />, x: "50%", y: "40%", status: "future" },
  { id: 3, title: "Phaseout Plan", year: "2029", desc: "Execute RSA/ECC phaseout strategy.", icon: <CircuitBoard />, x: "30%", y: "70%", status: "future" },
  { id: 4, title: "Full Compliance", year: "2035", desc: "Certify full PQC safe posture.", icon: <Milestone />, x: "85%", y: "90%", status: "future" },
];

export default function PQCMapFlow() {
  return (
    <div className="relative p-8 h-full bg-[#030712]/50 backdrop-blur-3xl border border-emerald-950/50 shadow-2xl rounded-3xl" style={{ clipPath: 'polygon(30px 0, 100% 0, 100% 100%, 0 100%, 0 30px)' }}>
      <h2 className="text-emerald-500 font-mono text-xs tracking-[0.3em] uppercase mb-10 flex items-center gap-3">
        <Milestone className="w-4 h-4" /> PQC Deployment Vector
      </h2>
      
      {/* Dynamic connecting lines */}
      <svg className="absolute inset-0 w-full h-full opacity-30 z-0">
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="3.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <motion.path d="M 100 80 Q 300 150 500 240 Q 600 350 400 420 Q 700 480 950 540" stroke="#10b981" strokeWidth="2" fill="none" filter="url(#glow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, ease: "easeInOut" }} />
      </svg>

      {/* Stylized nodes */}
      {steps.map((step, idx) => (
        <motion.div key={step.id} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + idx * 0.2, type: "spring", stiffness: 100 }} className="absolute z-10 flex gap-4 items-center group cursor-pointer" style={{ left: step.x, top: step.y }}>
          <div className={`w-14 h-14 flex items-center justify-center rounded-full border-2 ${step.status === 'active' ? 'bg-emerald-950 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.7)] pulse-border' : 'bg-slate-900/80 border-slate-700'}`}>
            <div className={`w-8 h-8 ${step.status === 'active' ? 'text-emerald-400' : 'text-slate-600'}`}>{step.icon}</div>
          </div>
          <div className="p-4 bg-slate-950/80 border border-slate-700 w-52 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest">{step.title} <span className="text-slate-500 ml-2">({step.year})</span></p>
            <p className="text-xs text-slate-300 mt-1">{step.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}