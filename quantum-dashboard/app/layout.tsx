import "./globals.css";
import { ScanProvider } from "../context/ScanContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "T4SKFORCE | Enterprise Quantum Security",
  description: "Post-Quantum Cryptography Risk Analyzer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen selection:bg-blue-100 selection:text-blue-900">
        <ScanProvider>
          {/* Removed the Sidebar. The page will now take up the full screen. */}
          <main className="w-full flex-1 flex flex-col">
            {children}
          </main>
        </ScanProvider>
      </body>
    </html>
  );
}