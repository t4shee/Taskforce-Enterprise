"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Printer, ShieldAlert, CheckCircle2, KeySquare, Landmark } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Simulated Full Report Data 
const getFullReport = (scanId: string) => ({
  reportMeta: {
    id: scanId || "SCN-123",
    timestamp: new Date().toISOString(),
    pqcCompliant: false,
  },
  assetMeta: {
    hostname: "pnbindia.in",
    ip_address: "103.24.1.66:443",
    classification: "PUBLIC_FACING_FINANCIAL",
    owner: "Punjab National Bank"
  },
  auditScores: {
    readinessScore: 60,
    readinessLabel: "MIGRATION RECOMMENDED",
    agilityScore: 40,
    riskLevel: "MODERATE"
  },
  cbom_summary: {
    protocol: "TLSv1.2",
    certIssuer: "DigiCert SHA2 Secured Class 3 CA",
    certSignature: "sha256WithRSAEncryption",
    encryptionAlgorithm: "AES_256_GCM_SHA384",
    weakCiphersFound: 3,
    legacyHashes: true
  },
  threat_pathology: [
    { algo: "sha256WithRSAEncryption", risk: "HIGH", vector: "Vulnerable to Shor's Factoring Attack" },
    { algo: "ECDHE", risk: "LOW", vector: "Grover's Attack (Key Size Decay)" }
  ],
  regulatoryImpact: [
    { frame: "RBI Cyber Security Framework", status: "NON-COMPLIANT" },
    { frame: "NIST PQC Standards (Draft)", status: "MIGRATION NEEDED" }
  ]
});

export default function ReportPage() {
  const router = useRouter();
  const params = useParams();
  const scanId = params.scanId as string;
  
  const reportData = getFullReport(scanId);

  // 🛡️ FIX: FORMAT DATE STRICTLY TO IST (Kolkata)
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

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans pb-16 print:bg-white print:pb-0">
      
      <nav className="bg-white border-b border-slate-200 print:hidden sticky top-0 z-50">
        <div className="max-w-[1000px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/history" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#8B1832] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Database
          </Link>
          <div className="flex gap-3">
             <button onClick={() => window.print()} className="flex items-center gap-2 text-xs font-bold text-[#8B1832] bg-rose-50 hover:bg-rose-100 border border-rose-100 px-5 py-2.5 rounded-xl uppercase tracking-widest shadow-sm">
              <Printer className="w-4 h-4" /> Generate formal PDF
            </button>
          </div>
        </div>
      </nav>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1000px] mx-auto mt-10 print:mt-0 p-12 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 print:shadow-none print:border-none print:w-full print:p-0">
        
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#8B1832] p-2 rounded-xl text-white print:bg-black"><ShieldAlert className="w-6 h-6" /></div>
              <h1 className="text-xl font-black text-slate-950 uppercase tracking-wider">Post-Quantum Security Audit</h1>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Formal Certification of PQC Readiness</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <h2 className="text-lg font-bold text-[#8B1832] uppercase">Taskforce Command</h2>
            <p className="text-xs font-medium text-slate-500 mt-1 max-w-xs leading-relaxed">Enterprise Cybersecurity Intelligence for Financial Systems</p>
            <div className="bg-slate-50 mt-4 px-4 py-2 rounded-lg border border-slate-100 text-xs font-mono text-slate-900 font-bold">ID: {reportData.reportMeta.id}</div>
          </div>
        </div>

        <div className="mb-12">
            <div className="flex items-center gap-2 mb-6"><CheckCircle2 className="w-5 h-5 text-emerald-600"/><h3 className="font-bold text-lg text-slate-900">1.0 Executive Posture</h3></div>
            <div className="grid grid-cols-4 gap-6 bg-slate-50 p-8 rounded-2xl border border-slate-100 print:bg-white print:border-2">
                
                <div className="border-r border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quantum readiness</p>
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-black uppercase tracking-widest print:border-black print:text-black">{reportData.reportMeta.pqcCompliant ? "SAFE" : "VULNERABLE"}</span>
                </div>
                
                <div className="border-r border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Readiness Score</p>
                    <p className="text-5xl font-black text-[#8B1832] print:text-black">{reportData.auditScores.readinessScore}<span className="text-xl">/100</span></p>
                </div>

                <div className="border-r border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">HNDL Risk</p>
                    <p className="text-3xl font-black text-rose-600 print:text-black">HIGH</p>
                </div>

                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Crypto Agility</p>
                    <p className="text-3xl font-black text-amber-500 print:text-black">{reportData.auditScores.agilityScore}</p>
                </div>
            </div>
            <div className="bg-white/50 border border-slate-100 p-6 rounded-2xl mt-4 text-sm font-medium text-slate-800 leading-relaxed italic print:border-black">
                "We found classic public-key algorithms are widespread across critical infrastructure. Active mitigation is REQUIRED."
            </div>
        </div>

        <div className="mb-12">
            <div className="flex items-center gap-2 mb-6"><KeySquare className="w-5 h-5 text-[#8B1832]"/><h3 className="font-bold text-lg text-slate-900">2.0 Cryptographic BOM Summary</h3></div>
            
            <div className="grid grid-cols-2 gap-8 items-start mb-8">
                <div className="space-y-4">
                    {/* 🛡️ FIX: EXPLICIT TEXT-SLATE-900 FOR VISIBILITY */}
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 print:bg-white print:border-black"><p className="text-[9px] font-bold text-slate-400 uppercase">Target Host</p><p className="font-bold text-base text-slate-900">{reportData.assetMeta.hostname}</p></div>
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 print:bg-white print:border-black"><p className="text-[9px] font-bold text-slate-400 uppercase">IP Endpoint</p><p className="font-mono text-base text-slate-900">{reportData.assetMeta.ip_address}</p></div>
                </div>
                <div className="space-y-4">
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 print:bg-white print:border-black"><p className="text-[9px] font-bold text-slate-400 uppercase">TLS Protocol</p><p className="font-mono text-base text-slate-900">{reportData.cbom_summary.protocol}</p></div>
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 print:bg-white print:border-black"><p className="text-[9px] font-bold text-slate-400 uppercase">Negotiated Cipher</p><p className="font-mono text-sm text-rose-700 print:text-black truncate">{reportData.cbom_summary.encryptionAlgorithm}</p></div>
                </div>
            </div>

            <table className="w-full text-left text-sm border-collapse border border-slate-100 print:border-black">
                <thead className="bg-slate-50 print:bg-white"><tr className="border-b border-slate-100 print:border-black text-xs uppercase font-bold text-slate-500"><th className="px-6 py-3">Algorithm</th><th className="px-6 py-3">Vector</th><th className="px-6 py-3">Risk</th></tr></thead>
                <tbody>
                    {reportData.threat_pathology.map((path, idx) => (
                        <tr key={idx} className="border-b border-slate-100 print:border-black hover:bg-slate-50/50">
                            {/* 🛡️ FIX: EXPLICIT TEXT-SLATE-900 FOR VISIBILITY */}
                            <td className="px-6 py-4 font-mono font-medium text-slate-900">{path.algo}</td>
                            <td className="px-6 py-4 text-slate-800 font-medium">{path.vector}</td>
                            <td className="px-6 py-4 font-black uppercase text-rose-700 print:text-black">{path.risk}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

         <div className="mb-12">
            <div className="flex items-center gap-2 mb-6"><Landmark className="w-5 h-5 text-[#8B1832]"/><h3 className="font-bold text-lg text-slate-900">3.0 Regulatory Compliance Impact</h3></div>
            <div className="space-y-4">
                {reportData.regulatoryImpact.map((impact, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 p-6 rounded-xl flex justify-between items-center print:bg-white print:border-black">
                        <div>
                            {/* 🛡️ FIX: EXPLICIT TEXT-SLATE-900 FOR VISIBILITY */}
                            <p className="font-bold text-sm text-slate-900">{impact.frame}</p>
                            <p className="text-xs text-slate-600 mt-1">Sector: Banking & Financial Services</p>
                        </div>
                        <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border ${impact.status === 'NON-COMPLIANT' ? 'bg-rose-50 text-rose-700 border-rose-200 print:text-black print:border-black' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{impact.status}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* 🛡️ FIX: CLEANED UP FOOTER WITH ONLY TASKFORCE COMMAND & IST TIME */}
        <div className="border-t-2 border-slate-100 pt-10 mt-16 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Generated by Taskforce Command</p>
          <p className="font-mono text-xs text-slate-500">{formatIST(reportData.reportMeta.timestamp)}</p>
        </div>

      </motion.div>
    </div>
  );
}