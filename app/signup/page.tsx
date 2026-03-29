"use client";

import { motion } from "framer-motion";
import { Building2, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/data";

const pwRules = [
  { label: "At least 6 characters", test: (p: string) => p.length >= 6 },
  { label: "Contains a letter",     test: (p: string) => /[a-zA-Z]/.test(p) },
  { label: "Contains a number",     test: (p: string) => /[0-9]/.test(p) },
];

export default function SignupPage() {
  const { signup, authError } = useStore();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "tenant" as Role });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState<Record<string, string>>({});

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())                        e.name     = "Name is required.";
    if (!form.email.trim())                       e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))   e.email    = "Enter a valid email.";
    if (pwRules.some(r => !r.test(form.password))) e.password = "Password does not meet requirements.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const ok = signup(form.name, form.email, form.password, form.role);
    if (ok) router.push("/dashboard");
    else    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[--background] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/12 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      <Link href="/" className="absolute top-7 left-7 flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg text-[--foreground] hidden sm:block">StayEase</span>
      </Link>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} className="w-full max-w-lg">
        <div className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[--foreground] mb-1">Create account</h1>
            <p className="text-[--muted] text-sm">Join StayEase and manage your PG today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-[--muted] uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[--muted]" />
                <input type="text" value={form.name} onChange={set("name")} placeholder="John Doe"
                  className={`w-full bg-[--input-bg] border rounded-xl pl-11 pr-4 py-3.5 text-[--foreground] text-sm placeholder:text-[--muted]/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all ${errors.name ? "border-rose-500/60" : "border-[--card-border]"}`} />
              </div>
              {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[--muted] uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[--muted]" />
                <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com"
                  className={`w-full bg-[--input-bg] border rounded-xl pl-11 pr-4 py-3.5 text-[--foreground] text-sm placeholder:text-[--muted]/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all ${errors.email ? "border-rose-500/60" : "border-[--card-border]"}`} />
              </div>
              {errors.email    && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
              {authError       && <p className="text-rose-400 text-xs mt-1">{authError}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-medium text-[--muted] uppercase tracking-wider mb-2">I am a…</label>
              <div className="grid grid-cols-2 gap-3">
                {(["owner", "tenant"] as Role[]).map(r => (
                  <button key={r} type="button" onClick={() => setForm(f => ({ ...f, role: r }))}
                    className={`py-3.5 rounded-xl border text-sm font-medium capitalize transition-all ${
                      form.role === r
                        ? "border-purple-500/60 bg-purple-500/15 text-purple-300"
                        : "border-[--card-border] bg-[--input-bg] text-[--muted] hover:text-[--foreground] hover:bg-white/[0.06]"
                    }`}>
                    {r === "owner" ? "🏠 PG Owner" : "🙋 Tenant"}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[--muted] uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[--muted]" />
                <input type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="••••••••"
                  className={`w-full bg-[--input-bg] border rounded-xl pl-11 pr-11 py-3.5 text-[--foreground] text-sm placeholder:text-[--muted]/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all ${errors.password ? "border-rose-500/60" : "border-[--card-border]"}`} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[--muted] hover:text-[--foreground]">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password rules */}
              {form.password && (
                <div className="mt-2 space-y-1">
                  {pwRules.map((r, i) => {
                    const ok = r.test(form.password);
                    return (
                      <div key={i} className={`flex items-center gap-1.5 text-xs ${ok ? "text-green-400" : "text-[--muted]"}`}>
                        {ok ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3 opacity-40" />}
                        {r.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 font-semibold text-sm mt-2 hover:shadow-lg hover:shadow-blue-500/30 transition-shadow disabled:opacity-60">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          <p className="mt-7 text-center text-sm text-[--muted]">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign in →</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
