"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { 
  Moon, Sun, Globe, DollarSign, Bell, Shield, Save, User, 
  Building2, Key, ShieldCheck, Smartphone, Eye, EyeOff, Check, Zap
} from "lucide-react";
import type { Theme, Currency, Lang } from "@/lib/store";

export default function SettingsPage() {
  const { currentUser, settings, setSetting, changePassword } = useStore();
  const router = useRouter();
  
  // States
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [twoFA, setTwoFA] = useState(false);

  useEffect(() => { if (!currentUser) router.replace("/login"); }, [currentUser, router]);
  if (!currentUser) return null;

  const handleGeneralSave = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 800);
  };

  const handlePwChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    
    const err = changePassword(oldPassword, newPassword);
    if (err) {
      setPwError(err);
    } else {
      setPwSuccess("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
    }
  };

  const Section = ({ icon: Icon, title, children, description }: { icon: React.ElementType; title: string, description?: string; children: React.ReactNode }) => (
    <div className="bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden">
      <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <Icon className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="font-black text-white text-lg leading-tight">{title}</h2>
            {description && <p className="text-[--muted] text-xs font-bold uppercase tracking-widest mt-0.5">{description}</p>}
          </div>
        </div>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-4xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Settings</h1>
          <p className="text-[--muted] text-lg font-medium mt-1">Configure your StayEase experience</p>
        </div>
        
        <motion.button 
          onClick={handleGeneralSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 rounded-2xl px-8 py-4 font-black text-sm transition-all shadow-xl ${
            saveStatus === "saved" 
              ? "bg-emerald-500 text-white shadow-emerald-500/20" 
              : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {saveStatus === "saving" ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : saveStatus === "saved" ? (
            <Check className="w-5 h-5" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Changes Saved" : "Save Preferences"}
        </motion.button>
      </div>

      {/* Profile Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Section icon={User} title="Public Profile" description="Account details">
          <div className="flex items-center gap-6 mb-10 p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
            <div className={`h-20 w-20 rounded-[28px] ${currentUser.role === "owner" ? "bg-gradient-to-br from-purple-500 to-indigo-600" : "bg-gradient-to-br from-blue-500 to-cyan-500"} flex items-center justify-center text-3xl font-black text-white shadow-2xl`}>
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-black text-white">{currentUser.name}</p>
              <p className="text-[--muted] font-bold text-sm tracking-tight">{currentUser.email}</p>
              <div className="flex gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${currentUser.role === "owner" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"}`}>
                  {currentUser.role === "owner" ? <Building2 className="w-3 h-3" /> : "🙋"}
                  {currentUser.role} Account
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400">Verified</span>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-4">
               <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[--muted] mb-3">Display Name</label>
                <input defaultValue={currentUser.name} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all font-bold" />
               </div>
               <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[--muted] mb-3">Email Address</label>
                <input disabled defaultValue={currentUser.email} className="w-full bg-white/[0.01] border border-white/5 rounded-2xl px-5 py-4 text-white/30 cursor-not-allowed font-bold" />
               </div>
             </div>
             <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-[--muted] mb-3">About Me (Optional)</label>
                <textarea placeholder="Write a brief intro..." rows={4} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all font-bold resize-none" />
             </div>
          </div>
        </Section>
      </motion.div>

      {/* Security Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Section icon={Shield} title="Security & Access" description="Password and authentication">
          <div className="grid md:grid-cols-2 gap-12">
            <form onSubmit={handlePwChange} className="space-y-6">
              <h3 className="text-white font-black flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-400" />
                Update Password
              </h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type={showOld ? "text" : "password"} 
                    placeholder="Current Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-5 pr-12 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all font-bold"
                  />
                  <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                    {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type={showNew ? "text" : "password"} 
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-5 pr-12 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all font-bold"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {pwError && <p className="text-rose-500 text-xs font-black uppercase tracking-widest">{pwError}</p>}
              {pwSuccess && <p className="text-emerald-500 text-xs font-black uppercase tracking-widest">{pwSuccess}</p>}

              <button type="submit" className="px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-sm transition-all">
                Update Security Credentials
              </button>
            </form>

            <div className="space-y-6">
              <h3 className="text-white font-black flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-400" />
                Two-Factor Auth
              </h3>
              <p className="text-[--muted] text-sm font-medium leading-relaxed">
                Enhance your account security by requiring both your password and a mobile authentication code to sign in.
              </p>
              
              <div 
                onClick={() => setTwoFA(!twoFA)}
                className={`p-6 border rounded-[32px] cursor-pointer transition-all flex items-center justify-between group ${twoFA ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/[0.02] border-white/5 hover:border-white/20"}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${twoFA ? "bg-emerald-500 text-white" : "bg-white/5 text-white/20"}`}>
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`font-black ${twoFA ? "text-emerald-400" : "text-white"}`}>Authenticator App</p>
                    <p className="text-[10px] text-[--muted] font-black uppercase tracking-[0.15em]">{twoFA ? "ACTIVE" : "INACTIVE"}</p>
                  </div>
                </div>
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${twoFA ? "border-emerald-500 bg-emerald-500" : "border-white/10"}`}>
                   {twoFA && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </div>
          </div>
        </Section>
      </motion.div>

      {/* Preferences Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Section icon={Zap} title="Interface Preferences" description="Theming and localization">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-widest text-[--muted] mb-3 flex items-center gap-2">
                <Moon className="w-3 h-3" /> Visual Theme
              </label>
              <div className="flex flex-col gap-2">
                {(["dark", "light"] as Theme[]).map(t => (
                  <button 
                    key={t}
                    onClick={() => setSetting("theme", t)}
                    className={`px-4 py-3 rounded-2xl font-black text-sm text-left transition-all border ${settings.theme === t ? "bg-purple-600 text-white border-purple-500 shadow-xl shadow-purple-500/20" : "bg-white/5 text-white/40 border-transparent hover:bg-white/10"}`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)} Mode
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-widest text-[--muted] mb-3 flex items-center gap-2">
                <DollarSign className="w-3 h-3" /> App Currency
              </label>
              <div className="flex flex-col gap-2">
                {(["INR", "USD"] as Currency[]).map(c => (
                  <button 
                    key={c}
                    onClick={() => setSetting("currency", c)}
                    className={`px-4 py-3 rounded-2xl font-black text-sm text-left transition-all border ${settings.currency === c ? "bg-purple-600 text-white border-purple-500 shadow-xl shadow-purple-500/20" : "bg-white/5 text-white/40 border-transparent hover:bg-white/10"}`}
                  >
                    {c} ({c === "INR" ? "₹" : "$"})
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-widest text-[--muted] mb-3 flex items-center gap-2">
                <Globe className="w-3 h-3" /> Language
              </label>
              <div className="flex flex-col gap-2">
                {(["English", "Hindi"] as Lang[]).map(l => (
                  <button 
                    key={l}
                    onClick={() => setSetting("lang", l)}
                    className={`px-4 py-3 rounded-2xl font-black text-sm text-left transition-all border ${settings.lang === l ? "bg-purple-600 text-white border-purple-500 shadow-xl shadow-purple-500/20" : "bg-white/5 text-white/40 border-transparent hover:bg-white/10"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </motion.div>
    </div>
  );
}
