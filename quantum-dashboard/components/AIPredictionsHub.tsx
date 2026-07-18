"use client";
import { BrainCircuit, Network, ShieldQuestion, Hourglass, ShieldAlert } from "lucide-react";
import { T4skforceScanData } from "../data/t4skforceScan";

interface AIPredictionsHubProps {
  ai: T4skforceScanData['ai_risk_insights'];
}

export default function AIPredictionsHub({ ai }: AIPredictionsHubProps) {
  return (
    <div className="p-6 bg-fuchsia-950/10 backdrop-blur-md border border-fuchsia-900/40 relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)' }}>
      <div className="absolute inset-0 bg-fuchsia-600/5 blur-3xl pointer-events-none" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-fuchsia-900/30 pb-4">
        <h2 className="text-fuchsia-400 font-mono text-xs tracking-[0.2em] uppercase flex items-center gap-2">
          <BrainCircuit className="w-5 h-5" /> Predictive Quantum Intelligence
        </h2>
        <div className="text-[9px] font-mono text-fuchsia-500/70 mt-2 md:mt-0 uppercase tracking-widest bg-fuchsia-950/50 px-2 py-1 border border-fuchsia-900/50">
          Engine: Random Forest
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/30 p-4 border border-fuchsia-900/30 rounded flex flex-col items-center justify-center">
          <Network className="text-fuchsia-500 w-4 h-4 mb-2" />
          <p className="text-[10px] text-slate-500 font-mono uppercase mb-1">HNDL Probability</p>
          <p className="text-2xl font-bold text-rose-400">{ai.hndl_probability * 100}%</p>
        </div>
        <div className="bg-black/30 p-4 border border-fuchsia-900/30 rounded flex flex-col items-center justify-center">
          <ShieldQuestion className="text-amber-500 w-4 h-4 mb-2" />
          <p className="text-[10px] text-slate-500 font-mono uppercase mb-1">Agility Score</p>
          <div className="flex items-end gap-2"><p className="text-2xl font-bold text-amber-400">{ai.crypto_agility_score}</p><span className="text-xs text-slate-600 mb-1">/100</span></div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center bg-black/30 p-3 rounded border border-cyan-900/20">
          <div className="flex items-center gap-2"><Hourglass className="text-cyan-500 w-4 h-4"/><span className="text-xs font-mono uppercase text-slate-400">Predicted Break</span></div>
          <span className="text-sm font-bold text-cyan-400">{ai.predicted_break_window}</span>
        </div>
        <div className="flex justify-between items-center bg-black/30 p-3 rounded border-b-2 border-b-rose-500">
          <div className="flex items-center gap-2"><ShieldAlert className="text-rose-500 w-4 h-4"/><span className="text-xs font-mono uppercase text-slate-400">Action Priority</span></div>
          <span className="text-sm font-bold text-rose-500 tracking-widest">{ai.migration_priority}</span>
        </div>
      </div>
    </div>
  );
}