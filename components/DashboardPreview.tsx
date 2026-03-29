"use client";

import { motion, Variants } from "framer-motion";
import { 
  BarChart3, 
  Bell, 
  CreditCard, 
  Home, 
  MessageSquare, 
  Search, 
  Users, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

const sidebarLinks = [
  { icon: Home, label: "Overview", active: true },
  { icon: Home, label: "Properties", active: false },
  { icon: Users, label: "Tenants", active: false },
  { icon: MessageSquare, label: "Complaints", active: false },
  { icon: CreditCard, label: "Billing", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
];

const cards = [
  { label: "Total Revenue", value: "$12,300", change: "+14%", positive: true },
  { label: "Active Tenants", value: "84", change: "+4%", positive: true },
  { label: "Vacant Rooms", value: "12", change: "-2%", positive: false },
  { label: "Open Complaints", value: "3", change: "-1", positive: true },
];

const recentActivity = [
  { id: 1, type: "payment", user: "Alex J.", text: "Paid rent for Room 204", amount: "$850", status: "success", time: "2m ago" },
  { id: 2, type: "complaint", user: "Sarah M.", text: "AC issue in Room 105", status: "pending", time: "1hr ago" },
  { id: 3, type: "tenant", user: "David K.", text: "Moved in to Room 302", status: "info", time: "3hrs ago" },
];

export default function DashboardPreview({ isHero = false }: { isHero?: boolean }) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: isHero ? 1.0 : 0.2 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className={`flex w-full bg-[#0a0a0a] overflow-hidden text-sm ${isHero ? 'h-[600px] pointer-events-none select-none' : 'h-screen'}`}>
      
      {/* Sidebar Navigation */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: isHero ? 0.8 : 0 }}
        className="w-64 border-r border-[#1f1f1f] bg-black p-4 flex flex-col justify-between hidden md:flex ring-1 ring-white/5"
      >
        <div>
          <div className="flex items-center gap-2 mb-8 px-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">StayEase</span>
          </div>
          
          <nav className="space-y-1">
            {sidebarLinks.map((link, idx) => (
              <div 
                key={idx} 
                className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                  link.active ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </div>
            ))}
          </nav>
        </div>
        
        <div className="p-3 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700" />
            <div>
              <p className="text-white text-xs font-semibold">John Landlord</p>
              <p className="text-zinc-500 text-[10px]">Pro Plan</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none" />
        
        {/* Top Navbar */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: isHero ? 0.9 : 0.1 }}
          className="h-16 border-b border-[#1f1f1f] flex items-center justify-between px-6 bg-black/40 backdrop-blur-md sticky top-0 z-10"
        >
          <div className="flex items-center gap-4 text-zinc-400 w-1/3">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                readOnly
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-zinc-400 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-purple-500 rounded-full" />
            </button>
          </div>
        </motion.header>

        {/* Dashboard Content */}
        <motion.main 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-6 md:p-8 flex-1 overflow-y-auto"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-2xl font-semibold text-white">Overview</h1>
            <p className="text-zinc-400 text-sm">Monitor your property statistics.</p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="glass-card rounded-xl p-5 relative overflow-hidden group hover:border-purple-500/30 transition-colors"
              >
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-white/5 rounded-full group-hover:bg-purple-500/10 transition-colors blur-xl" />
                <p className="text-zinc-400 text-xs font-medium mb-1">{card.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-bold text-white">{card.value}</h3>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    card.positive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {card.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart placeholder */}
            <motion.div variants={itemVariants} className="lg:col-span-2 glass-card rounded-xl border-white/5 p-6 h-64 flex flex-col justify-between relative overflow-hidden">
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Revenue Overview</h3>
                <div className="flex h-32 items-end gap-2 w-full pt-4">
                  {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-white/5 rounded-t-sm group-hover:bg-white/10 transition-all relative">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: isHero ? 1.5 + (i * 0.1) : 0.5 + (i * 0.1), type: "spring" }}
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-600/50 to-blue-500/80 rounded-t-sm" 
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between w-full mt-2 text-[10px] text-zinc-500 px-1">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div variants={itemVariants} className="glass-card rounded-xl border-white/5 p-6 h-64 overflow-hidden flex flex-col">
              <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
              <div className="flex-1 space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="mt-0.5 relative">
                      {activity.type === 'payment' && <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-green-400" /></div>}
                      {activity.type === 'complaint' && <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center"><AlertCircle className="w-3 h-3 text-red-400" /></div>}
                      {activity.type === 'tenant' && <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center"><Users className="w-3 h-3 text-blue-400" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{activity.user}</p>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">{activity.text}</p>
                    </div>
                    <span className="text-[9px] text-zinc-600 flex-shrink-0">{activity.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
          </div>
        </motion.main>
      </div>
    </div>
  );
}
