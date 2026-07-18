"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crosshair, LayoutDashboard, BrainCircuit, Server, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Command Center", path: "/", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "AI Intelligence", path: "/intelligence", icon: <BrainCircuit className="w-5 h-5" /> },
    { name: "Raw Telemetry", path: "/telemetry", icon: <Server className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 h-screen border-r border-cyan-900/40 bg-[#030712]/80 backdrop-blur-xl flex flex-col fixed left-0 top-0 z-50">
      <div className="h-20 flex items-center px-6 border-b border-cyan-900/40">
        <Crosshair className="text-cyan-500 w-6 h-6 animate-[spin_4s_linear_infinite] mr-3" />
        <span className="text-white font-black tracking-widest text-lg">T4SKFORCE</span>
      </div>
      <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
        {links.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link key={link.name} href={link.path} className="relative group">
              {isActive && (
                <motion.div layoutId="activeTab" className="absolute inset-0 bg-cyan-900/30 rounded-lg border border-cyan-500/50" />
              )}
              <div className={`relative flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-colors ${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200 group-hover:bg-white/5"}`}>
                {link.icon}
                {link.name}
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-cyan-900/40">
        <div className="flex items-center gap-3 px-4 py-3 text-slate-500 font-mono text-xs">
          <Settings className="w-4 h-4" /> System Settings
        </div>
      </div>
    </div>
  );
}