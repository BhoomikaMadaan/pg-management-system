"use client";

import { motion } from "framer-motion";
import { Building2, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const { login, authError } = useStore();
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim())              e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email.";
    if (!password)                  e.password = "Password is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = login(email, password);
    if (ok) router.push("/dashboard");
    else     setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[--background] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

      <Link href="/" className="absolute top-7 left-7 flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg text-[--foreground] hidden sm:block">StayEase</span>
      </Link>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[--foreground] mb-1">Welcome back</h1>
            <p className="text-[--muted] text-sm">Sign in to your StayEase account</p>
          </div>

          {/* Demo cards */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { label: "Owner Demo",  email: "owner@demo.com", pw: "owner123" },
              { label: "Tenant Demo", email: "alex@demo.com",  pw: "alex123" },
            ].map(d => (
              <button key={d.email} onClick={() => { setEmail(d.email); setPassword(d.pw); }}
                className="text-xs rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[--muted] hover:text-[--foreground] hover:bg-white/[0.06] transition-all text-left">
                <span className="font-medium text-purple-400 block mb-0.5">{d.label}</span>
                {d.email}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[--muted] uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[--muted]" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                  className={`w-full bg-[--input-bg] border rounded-xl pl-11 pr-4 py-3.5 text-[--foreground] text-sm placeholder:text-[--muted]/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all ${errors.email ? "border-rose-500/60" : "border-[--card-border]"}`} />
              </div>
              {errors.email    && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
              {authError       && <p className="text-rose-400 text-xs mt-1">{authError}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-xs font-medium text-[--muted] uppercase tracking-wider">Password</label>
                <Link href="#" className="text-xs text-purple-400 hover:text-purple-300">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[--muted]" />
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className={`w-full bg-[--input-bg] border rounded-xl pl-11 pr-11 py-3.5 text-[--foreground] text-sm placeholder:text-[--muted]/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all ${errors.password ? "border-rose-500/60" : "border-[--card-border]"}`} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[--muted] hover:text-[--foreground]">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-rose-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3.5 font-semibold text-sm mt-2 hover:shadow-lg hover:shadow-purple-500/30 transition-shadow disabled:opacity-60">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          <p className="mt-7 text-center text-sm text-[--muted]">
            No account?{" "}
            <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Create one free →</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
