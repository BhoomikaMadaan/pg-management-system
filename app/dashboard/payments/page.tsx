"use client";

import { useEffect, useMemo } from "react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TrendingUp, CreditCard, CheckCircle2, AlertCircle, Download, FileText, CalendarDays } from "lucide-react";

export default function PaymentsPage() {
  const { currentUser, payments, rooms, formatPrice } = useStore();
  const router = useRouter();

  useEffect(() => { if (!currentUser) router.replace("/login"); }, [currentUser, router]);
  const isOwner = currentUser?.role === "owner";

  // Owner only sees payments for their rooms
  const visible = useMemo(() => {
    if (!currentUser) return [];
    if (isOwner) {
      const myRooms = new Set(rooms.filter(r => r.ownerId === currentUser.id).map(r => r.id));
      return payments.filter(p => myRooms.has(p.roomId));
    } else {
      return payments.filter(p => p.tenantId === currentUser.id);
    }
  }, [isOwner, currentUser, rooms, payments]);

  if (!currentUser) return null;

  const collected = visible.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pending   = visible.filter(p => p.status !== "paid").reduce((s, p) => s + p.amount, 0);

  const statusStyle: Record<string, string> = {
    paid:    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    due:     "bg-amber-500/10  text-amber-400  border-amber-500/20",
    overdue: "bg-rose-500/10   text-rose-400   border-rose-500/20",
  };

  const monthly = [
    { month: "Oct", amount: 195000 },
    { month: "Nov", amount: 210000 },
    { month: "Dec", amount: 185000 },
    { month: "Jan", amount: 225000 },
    { month: "Feb", amount: 215000 },
    { month: "Mar", amount: 340000 },
  ];

  return (
    <div className="min-h-screen p-6 md:p-10 pb-24 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Payments</h1>
          <p className="text-[--muted] text-base font-medium mt-1">
            {isOwner ? "Revenue & transaction history across your properties" : "Your rent and transaction history"}
          </p>
        </div>
        {isOwner && (
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Download className="w-4 h-4" /> Export Report
          </motion.button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: "Collected", value: formatPrice(collected), icon: CheckCircle2, accent: "text-emerald-400", glow: "from-emerald-500/10" },
          { label: "Pending",   value: formatPrice(pending),   icon: AlertCircle,  accent: "text-amber-400",   glow: "from-amber-500/10"   },
          { label: isOwner ? "Total Revenue Generated" : "My Monthly Rent",
            value: isOwner ? formatPrice(collected + pending) : formatPrice(rooms.find(r => r.id === currentUser.roomId)?.price ?? 0),
            icon: TrendingUp, accent: "text-purple-400", glow: "from-purple-500/10" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="p-6 bg-white/[0.025] border border-white/[0.05] rounded-[28px] relative overflow-hidden flex items-center gap-4">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.glow} to-transparent opacity-50 pointer-events-none`} />
            <div className="relative h-14 w-14 rounded-2xl bg-white/[0.05] flex items-center justify-center flex-shrink-0">
              <s.icon className={`w-6 h-6 ${s.accent}`} />
            </div>
            <div className="relative">
              <p className="text-[--muted] text-xs font-black uppercase tracking-widest leading-tight mb-1">{s.label}</p>
              <p className="text-2xl font-black text-white">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Main table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white/[0.02] border border-white/[0.05] rounded-[32px] overflow-hidden">
          <div className="px-8 py-6 border-b border-white/[0.05] flex items-center gap-3">
            <FileText className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-black text-white">Transaction History</h2>
          </div>
          
          {visible.length === 0 ? (
            <div className="p-10 text-center text-[--muted] font-medium text-sm">No transactions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-black text-[--muted] uppercase tracking-widest border-b border-white/[0.05]">
                    {isOwner && <th className="px-8 py-4 whitespace-nowrap">Tenant Info</th>}
                    <th className="px-8 py-4 whitespace-nowrap">Property</th>
                    <th className="px-8 py-4 whitespace-nowrap">Amount</th>
                    <th className="px-8 py-4 whitespace-nowrap">Status</th>
                    <th className="px-8 py-4 whitespace-nowrap">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {visible.map((p, i) => (
                    <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
                      className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group">
                      {isOwner && (
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="font-black text-white">{p.tenantName}</span>
                            <span className="text-[10px] text-[--muted] font-medium uppercase tracking-widest mt-0.5">ID: {p.tenantId}</span>
                          </div>
                        </td>
                      )}
                      <td className="px-8 py-5">
                        <span className="font-semibold text-[--muted] group-hover:text-purple-300 transition-colors">
                          {rooms.find(r => r.id === p.roomId)?.title || `Room ${p.roomId}`}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-black text-white whitespace-nowrap">{formatPrice(p.amount)}</td>
                      <td className="px-8 py-5">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusStyle[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-[--muted] font-medium">
                          <CalendarDays className="w-3.5 h-3.5" />{p.date}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Chart Side */}
        {isOwner && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="bg-white/[0.02] border border-white/[0.05] rounded-[32px] p-8 space-y-8">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Revenue Trend
              </h2>
              <p className="text-xs text-[--muted] font-medium mt-1">Past 6 months growth</p>
            </div>
            
            <div className="flex items-end justify-between h-40 gap-2">
              {monthly.map((m, i) => {
                const max = Math.max(...monthly.map(x => x.amount));
                const pct = (m.amount / max) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <p className="text-[10px] font-black text-[--muted] opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0 duration-300">
                      {formatPrice(m.amount / 1000)}k
                    </p>
                    <div className="w-full flex items-end h-[120px]">
                      <motion.div initial={{ height: 0 }} animate={{ height: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1, type: "spring" }}
                        className={`w-full rounded-xl transition-all cursor-pointer ${
                          i === 5 
                            ? "bg-gradient-to-t from-emerald-600/50 to-emerald-400 border border-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.3)]" 
                            : "bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.05]"
                        }`} 
                      />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[--muted] mt-1">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
