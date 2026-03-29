"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  Building2, LayoutDashboard, BedDouble, Users,
  MessageSquareWarning, CreditCard, Settings,
  Bell, Search, LogOut, ChevronRight, Menu, X
} from "lucide-react";

const navItems = [
  { href: "/dashboard",            icon: LayoutDashboard,      label: "Dashboard" },
  { href: "/dashboard/rooms",      icon: BedDouble,            label: "Rooms" },
  { href: "/dashboard/tenants",    icon: Users,                label: "Tenants",   ownerOnly: true },
  { href: "/dashboard/chat",       icon: MessageSquareWarning, label: "Messages" },
  { href: "/dashboard/complaints", icon: MessageSquareWarning, label: "Complaints" },
  { href: "/dashboard/payments",   icon: CreditCard,           label: "Payments" },
  { href: "/dashboard/settings",   icon: Settings,             label: "Settings" },
];

const NOTIFS = [
  { text: "New complaint: AC not working",      time: "2m ago",  dot: "bg-rose-400" },
  { text: "Rent due: Priya Sharma (Room 102)",  time: "1h ago",  dot: "bg-amber-400" },
  { text: "New tenant Sara checked in",         time: "3h ago",  dot: "bg-green-400" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, settings } = useStore();
  const pathname = usePathname();
  const router   = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);

  const handleLogout = () => { logout(); router.push("/login"); };

  const isOwner = currentUser?.role === "owner";

  const visible = navItems.filter(n => !n.ownerOnly || isOwner);

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`${mobile ? "w-full" : sidebarOpen ? "w-60" : "w-16"} flex-shrink-0 sidebar-bg border-r border-[--card-border] flex flex-col transition-all duration-300`}>
      <div className={`h-16 flex items-center border-b border-[--card-border] ${sidebarOpen || mobile ? "px-5 gap-2.5" : "justify-center"}`}>
        <div className="h-8 w-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        {(sidebarOpen || mobile) && <span className="font-bold text-white text-base">StayEase</span>}
      </div>

      {(sidebarOpen || mobile) && currentUser && (
        <div className="px-4 py-4 border-b border-[--card-border]">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isOwner ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
          }`}>
            {isOwner ? "🏠 Owner" : "🙋 Tenant"}
          </div>
        </div>
      )}

      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {visible.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
              <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all cursor-pointer group
                ${active
                  ? "bg-purple-500/15 text-purple-300 border border-purple-500/20"
                  : "text-white/45 hover:text-white hover:bg-white/5 border border-transparent"}`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {(sidebarOpen || mobile) && <span className="text-sm font-medium leading-none">{label}</span>}
                {(sidebarOpen || mobile) && active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-purple-400" />}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className={`p-3 border-t border-[--card-border] ${sidebarOpen || mobile ? "" : "flex justify-center"}`}>
        {(sidebarOpen || mobile) ? (
          <div className="flex items-center gap-3 px-2">
            <div className={`h-8 w-8 rounded-full ${isOwner ? "bg-gradient-to-br from-purple-500 to-indigo-500" : "bg-gradient-to-br from-blue-500 to-cyan-500"} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
              {currentUser?.name?.slice(0, 2).toUpperCase() ?? "?"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-white/40 truncate capitalize">{currentUser?.role} Plan</p>
            </div>
            <button onClick={handleLogout} className="ml-auto text-white/30 hover:text-rose-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className={`h-8 w-8 rounded-full ${isOwner ? "bg-gradient-to-br from-purple-500 to-indigo-500" : "bg-gradient-to-br from-blue-500 to-cyan-500"} flex items-center justify-center text-xs font-bold text-white`}>
            {currentUser?.name?.slice(0, 2).toUpperCase() ?? "?"}
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex"><Sidebar /></div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden flex">
            <motion.div initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-64 h-full">
              <Sidebar mobile />
            </motion.div>
            <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex-shrink-0 backdrop-blur-xl border-b border-[--card-border] flex items-center justify-between px-5 gap-4"
          style={{ background: "var(--card-bg)" }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 text-[--muted] hover:text-[--foreground]" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <button className="hidden md:flex p-2 text-[--muted]/60 hover:text-[--foreground] transition-colors" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--muted]" />
              <input placeholder="Search…"
                className="w-52 bg-[--input-bg] border border-[--card-border] rounded-xl pl-9 pr-3 py-2 text-sm text-[--foreground] placeholder:text-[--muted]/60 focus:outline-none focus:border-purple-500/50 focus:w-72 transition-all" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              {isOwner && (
                <button onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 text-[--muted] hover:text-[--foreground] transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full ring-1 ring-[--background]" />
                </button>
              )}
              <AnimatePresence>
                {notifOpen && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-11 w-80 glass-card rounded-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[--card-border] flex justify-between">
                      <span className="text-sm font-semibold text-[--foreground]">Notifications</span>
                      <span className="text-xs text-purple-400 cursor-pointer">Mark all read</span>
                    </div>
                    {NOTIFS.map((n, i) => (
                      <div key={i} className="px-4 py-3 flex gap-3 hover:bg-white/[0.03] border-b border-[--card-border] last:border-0">
                        <div className={`w-2 h-2 ${n.dot} rounded-full mt-1.5 flex-shrink-0`} />
                        <div>
                          <p className="text-sm text-[--foreground]/80">{n.text}</p>
                          <p className="text-xs text-[--muted] mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className={`h-8 w-8 rounded-full ${isOwner ? "bg-gradient-to-br from-purple-500 to-indigo-500" : "bg-gradient-to-br from-blue-500 to-cyan-500"} flex items-center justify-center text-xs font-bold text-white`}>
              {currentUser?.name?.slice(0, 2).toUpperCase() ?? "?"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto" style={{ background: "var(--background)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
