"use client";

import { useState } from "react";
import { ShieldAlert, Lock, Mail, ChevronRight, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Basic Validation
    if (!email || !password || (!isLogin && !name)) {
      setErrorMsg("Please fill in all fields securely.");
      return;
    }

    // Retrieve our "mock database" from the browser
    const users = JSON.parse(localStorage.getItem("t4skforce_users") || "{}");

    if (isLogin) {
      // LOGIN LOGIC
      if (users[email] && users[email].password === password) {
        // Success! Save active session and route to Command Center
        localStorage.setItem("t4skforce_active_session", users[email].name);
        router.push("/"); 
      } else {
        setErrorMsg("Invalid credentials. Access denied.");
      }
    } else {
      // REGISTRATION LOGIC
      if (users[email]) {
        setErrorMsg("Account already exists. Please sign in.");
      } else {
        // Save new user to the "database"
        users[email] = { name, password };
        localStorage.setItem("t4skforce_users", JSON.stringify(users));
        
        // Auto-login after registration
        localStorage.setItem("t4skforce_active_session", name);
        router.push("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans">
      
      {/* LEFT SIDE: CLEAN MAROON/GOLD BRANDING */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-[#8B1832] to-[#5A0F20] text-white p-12 flex flex-col justify-between relative overflow-hidden">
        <ShieldAlert className="absolute -right-20 -bottom-20 w-[500px] h-[500px] text-white opacity-5 pointer-events-none" />
        
        <div>
          <h2 className="text-sm font-bold tracking-widest text-amber-400 uppercase mb-2">Enterprise Security</h2>
          <h1 className="text-xl font-black tracking-widest uppercase mb-12">Taskforce<br/>Command</h1>
        </div>

        <div className="relative z-10 my-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
            <ShieldAlert className="w-12 h-12 text-[#8B1832]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            PQC-Ready<br/>
            <span className="text-amber-400">Cybersecurity</span>
          </h2>
          <div className="w-20 h-1 bg-amber-400 mb-6" />
          <p className="text-lg text-rose-100/80 max-w-md font-medium">
            Enterprise-grade Post-Quantum Cryptography risk assessment and CBOM intelligence.
          </p>
        </div>

        <div className="relative z-10 mt-12">
          <p className="text-xs font-bold tracking-widest text-amber-400 uppercase">Secure Portal</p>
          <p className="text-sm font-semibold text-rose-100 mt-1">Authorized Personnel Only</p>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 relative bg-white">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-10">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              {isLogin ? "Sign in to Cyber Command" : "Register for Access"}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* ERROR MESSAGE DISPLAY */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-rose-50 border border-rose-200 text-[#8B1832] p-3 rounded-xl text-xs font-bold text-center uppercase tracking-widest">
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe" 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#8B1832] focus:ring-1 focus:ring-[#8B1832] transition-all font-medium text-slate-900" 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email / Username</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@taskforce.com" 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#8B1832] focus:ring-1 focus:ring-[#8B1832] transition-all font-medium text-slate-900" 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                {isLogin && <button type="button" className="text-xs font-bold text-[#8B1832] hover:underline">Forgot Password?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#8B1832] focus:ring-1 focus:ring-[#8B1832] transition-all font-medium text-slate-900" 
                />
              </div>
            </div>

            <button type="submit" className="w-full mt-4 bg-[#8B1832] hover:bg-[#6e1328] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8B1832]/20">
              {isLogin ? "Sign In Securely" : "Create Account"} <ChevronRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-slate-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); }} className="font-bold text-[#8B1832] hover:underline">
                {isLogin ? "Register here" : "Sign in here"}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}