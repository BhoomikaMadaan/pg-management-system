"use client";

import { useStore } from "@/lib/store";
import { 
  Building2, Users, MessageSquareWarning, CreditCard, 
  ArrowRight, ShieldCheck, Star, MapPin, Zap, User, Plus
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-600/20 rounded-full blur-[160px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-purple-400 text-xs font-bold mb-8 backdrop-blur-md">
            <Zap className="w-3 h-3 fill-purple-400" />
            STAYEASE PG ENGINE v2.0
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight mb-8">
            The Smart Way to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500">
              Host and Stay.
            </span>
          </h1>
          
          <p className="text-[--muted] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Manage your properties, tenants, and payments in one unified interface. Built for the modern PG landscape.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white text-black rounded-2xl font-black text-lg shadow-2xl shadow-white/10 hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                Owner Portal <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/signup?role=tenant">
              <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md">
                 Tenant Sign In
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function FeatureSection() {
  const features = [
    { title: "Real-time Booking", icon: Building2, desc: "Instant room reservation with digital receipts." },
    { title: "Automated Payments", icon: CreditCard, desc: "Direct UPI/Bank transfers with auto-reminders." },
    { title: "Smart Complaints", icon: MessageSquareWarning, desc: "Ticketing system for all maintenance issues." },
    { title: "Verified Listings", icon: ShieldCheck, desc: "Every property is background checked for safety." }
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-white">
        {features.map((f, i) => (
          <div key={i} className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px] hover:bg-white/[0.05] transition-all">
            <div className="h-16 w-16 rounded-3xl bg-purple-500/10 flex items-center justify-center mb-8">
              <f.icon className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-black mb-4">{f.title}</h3>
            <p className="text-[--muted] font-medium text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
