"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { API_ENDPOINTS } from "../app/config/apiConfig";

// Note: Using 'any' for the data types to support the dynamic transition 
// between the Layer 1 (Scanner) and Layer 2 (Quantum) JSON structures.
interface ScanContextType {
  layer1Data: any | null; // Scanner Results (Page 3)
  layer2Data: any | null; // Quantum Analysis (Page 1 & 2)
  scanHistory: any[];
  isScanning: boolean;
  loadingStep: string;
  targetUrl: string;
  setTargetUrl: (url: string) => void;
  executeScan: (url: string) => Promise<void>;
  clearCurrentScan: () => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [layer1Data, setLayer1Data] = useState<any | null>(null);
  const [layer2Data, setLayer2Data] = useState<any | null>(null);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [targetUrl, setTargetUrl] = useState("");

  const executeScan = async (url: string) => {
    setIsScanning(true);
    setLayer1Data(null);
    setLayer2Data(null);
    
    try {
      // --- STEP 1: LAYER 1 SCAN (Person 1: Scanner) ---
      setLoadingStep("Step 1: Discovering Cryptographic Assets...");
      
      const scannerResponse = await fetch(API_ENDPOINTS.SCANNER, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ url }),
      });

      if (!scannerResponse.ok) throw new Error("Scanner API failed");
      
      const layer1Results = await scannerResponse.json();
      setLayer1Data(layer1Results); // Population for Page 3

      // --- STEP 2: LAYER 2 ANALYSIS (Person 2: Quantum Analyzer) ---
      setLoadingStep("Step 2: Performing Quantum Risk Analysis...");
      
      const analyzerResponse = await fetch(API_ENDPOINTS.ANALYZER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(layer1Results), // Pass Layer 1 output to Layer 2
      });

      if (!analyzerResponse.ok) throw new Error("Quantum Analyzer API failed");
      
      const layer2Results = await analyzerResponse.json();
      setLayer2Data(layer2Results); // Population for Page 1 & 2

      // Add to history (storing the final enriched analysis locally)
      setScanHistory((prev) => [layer2Results, ...prev]);

      // --- STEP 3: SAVE TO ENTERPRISE DATABASE (Supabase) ---
      setLoadingStep("Step 3: Saving to Audit Database...");
      try {
        // Safely extract the risk score from your JSON payload (default to 50 if missing)
        const extractedRisk = layer2Results?.quantum_risk_analysis?.quantum_readiness_score?.quantum_readiness_score || 50;
        
        // Dynamically calculate the text status based on the score
        let extractedStatus = "Moderate";
        if (extractedRisk >= 60) extractedStatus = "Critical";
        if (extractedRisk < 30) extractedStatus = "Secure";

        // Send it to your new Next.js API route!
        await fetch('/api/scans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            target: url, 
            risk: extractedRisk,
            status: extractedStatus
          })
        });
      } catch (dbError) {
        // We log the error, but don't break the whole app just because the DB was slow
        console.error("Failed to save to enterprise database:", dbError);
      }

      setLoadingStep("Analysis Complete");
      
    } catch (error) {
      console.error("Pipeline Error:", error);
      setLoadingStep("Error: Connection to API Failed");
    } finally {
      setIsScanning(false);
      // Reset loading step after a delay so user sees "Complete"
      setTimeout(() => setLoadingStep(""), 3000);
    }
  };

  const clearCurrentScan = () => {
    setLayer1Data(null);
    setLayer2Data(null);
    setTargetUrl("");
    setLoadingStep("");
  };

  return (
    <ScanContext.Provider value={{ 
      layer1Data, 
      layer2Data, 
      scanHistory, 
      isScanning, 
      loadingStep,
      targetUrl, 
      setTargetUrl, 
      executeScan, 
      clearCurrentScan 
    }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const context = useContext(ScanContext);
  if (!context) throw new Error("useScan must be used within a ScanProvider");
  return context;
}