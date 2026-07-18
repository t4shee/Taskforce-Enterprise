"use client";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

interface RiskRadarProps {
  score: number;
  level: string;
}

export default function RiskRadar({ score, level }: RiskRadarProps) {
  return (
    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative group h-full">
      <div className="absolute inset-0 bg-rose-950/20 backdrop-blur-md border border-rose-900/50" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)' }} />
      <div className="relative p-8 flex flex-col items-center h-full justify-between">
        <h2 className="text-rose-400/80 font-mono text-xs tracking-[0.2em] w-full text-left mb-8 uppercase border-b border-rose-900/50 pb-2">Threat Assessment Level</h2>
        
        <div className="relative w-56 h-56 flex items-center justify-center mb-8">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-900" />
            <motion.circle 
              cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="6" fill="transparent"
              strokeDasharray={540} strokeLinecap="square"
              initial={{ strokeDashoffset: 540 }}
              animate={{ strokeDashoffset: 540 - (540 * score) / 100 }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              className="text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-6xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{score}</span>
            <span className="text-[10px] text-rose-400 font-mono mt-1 tracking-[0.3em] uppercase">{level}</span>
          </div>
        </div>

        <div className="w-full flex items-center justify-between bg-rose-950/50 border border-rose-500/30 p-4 mt-auto">
          <div className="flex items-center gap-3"><ShieldAlert className="text-rose-500 w-6 h-6 animate-pulse" /><span className="text-rose-300 font-bold text-sm tracking-widest uppercase">HNDL Vulnerable</span></div>
          <div className="h-2 w-2 bg-rose-500 rounded-full animate-ping" />
        </div>
      </div>
    </motion.div>
  );
}