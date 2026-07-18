"use client";
import { ChevronRight, Server } from "lucide-react";
import { T4skforceScanData } from "../data/t4skforceScan";

interface RawTelemetryFeedProps {
  data: T4skforceScanData;
  target: string;
  ip: string;
}

export default function RawTelemetryFeed({ data, target, ip }: RawTelemetryFeedProps) {
  return (
    <div className="relative bg-[#0a0f16] border border-cyan-900/30 p-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b border-cyan-900/30 bg-black/40">
        <div className="flex items-center gap-3">
          <Server className="text-cyan-700 w-5 h-5" />
          <h2 className="text-sm font-mono text-cyan-500 tracking-widest uppercase">Deep-Scan Telemetry Data</h2>
        </div>
        <div className="flex gap-4 font-mono text-[10px] text-cyan-600/70">
          <span>HOST: <span className="text-cyan-400">{target}</span></span>
          <span>IP: <span className="text-cyan-400">{ip}</span></span>
        </div>
      </div>
      <details className="group marker:hidden">
        <summary className="flex items-center justify-between w-full p-4 cursor-pointer hover:bg-cyan-950/20 transition-colors outline-none bg-black/20">
          <span className="text-xs font-mono tracking-widest text-slate-400 group-hover:text-cyan-400 flex items-center gap-2 transition-colors">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            DECRYPT RAW JSON PAYLOAD
          </span>
        </summary>
        <div className="p-4 bg-black/60 border-t border-cyan-900/30 overflow-x-auto">
          <pre className="text-emerald-400/70 font-mono text-[11px] leading-relaxed">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  );
}