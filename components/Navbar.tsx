"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { 
  Building2, Users, MessageSquareWarning, CreditCard, 
  ArrowRight, ShieldCheck, Star, MapPin, Zap, User,
  LayoutDashboard, LogOut, Menu, X, Bell
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { currentUser, logout } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage) return null;

  const navLinks = [
    { name: "Explore Rooms", href: "/#rooms" },
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-[100] p-4 md:p-6 pointer-events-none">
      <div className="container mx-auto max-w-7xl flex items-center justify-between pointer-events-auto">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-500/20 group-hover:scale-110 transition-transform">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">StayEase</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-2 p-2 bg-white/[0.03] border border-white/5 backdrop-blur-2xl rounded-[24px]">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="px-6 py-2.5 rounded-2xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="w-px h-6 bg-white/10 mx-2" />
          
          {currentUser ? (
            <div className="flex items-center gap-2 pr-2">
              <Link href="/dashboard">
                <div className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-black transition-all cursor-pointer">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </div>
              </Link>
              <button 
                onClick={logout}
                className="p-2.5 hover:bg-rose-500/10 text-white/40 hover:text-rose-400 rounded-2xl transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pr-2">
              <Link href="/login">
                <div className="px-6 py-2.5 text-sm font-bold text-white hover:text-purple-400 transition-colors cursor-pointer">
                  Login
                </div>
              </Link>
              <Link href="/signup">
                <div className="flex items-center justify-center px-6 py-2.5 bg-white text-black rounded-2xl text-sm font-black hover:bg-gray-200 transition-all cursor-pointer">
                  Get Started
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-3">
          {currentUser && (
             <Link href="/dashboard">
              <div className="h-10 w-10 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                <LayoutDashboard className="w-5 h-5" />
              </div>
            </Link>
          )}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[90] pointer-events-auto"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[300px] bg-[#0a0a0f] border-l border-white/5 z-[110] p-10 flex flex-col pointer-events-auto shadow-2xl"
            >
              <div className="flex flex-col gap-6 mt-10">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-black text-white/40 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="h-px w-full bg-white/5 my-4" />
                
                {currentUser ? (
                  <div className="space-y-4">
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <div className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 cursor-pointer">
                        <LayoutDashboard className="w-5 h-5" />
                        Go to Dashboard
                      </div>
                    </Link>
                    <button 
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="w-full py-4 bg-white/5 border border-white/10 text-rose-400 rounded-2xl font-bold flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <div className="w-full py-4 border border-white/10 text-white rounded-2xl font-bold cursor-pointer text-center">
                        Login
                      </div>
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      <div className="w-full py-4 bg-white text-black rounded-2xl font-black cursor-pointer text-center">
                        Get Started
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
