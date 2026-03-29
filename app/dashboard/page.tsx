"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useStore, useGreeting } from "@/lib/store";
import {
  Building2, Users, MessageSquareWarning, TrendingUp,
  ArrowRight, Zap, BedDouble, MapPin, Plus, Check, Star
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { currentUser, rooms, complaints, users, payments, formatPrice } = useStore();
  const greeting = useGreeting(currentUser?.name ?? "User");
  const isOwner = currentUser?.role === "owner";

  // ── Scoped data ──────────────────────────────────────────
  const myRooms = useMemo(() =>
    rooms.filter(r => r.ownerId === currentUser?.id), [rooms, currentUser]);
  const myRoomIds = useMemo(() => new Set(myRooms.map(r => r.id)), [myRooms]);

  // Owner stats — scoped to their listings only
  const ownerTenantCount = useMemo(() =>
    users.filter(u => u.role === "tenant" && u.roomId && myRoomIds.has(u.roomId)).length,
  [users, myRoomIds]);
  const ownerOpenComplaints = useMemo(() =>
    complaints.filter(c => c.status !== "resolved" && c.roomId && myRoomIds.has(c.roomId)).length,
  [complaints, myRoomIds]);
  const ownerRevenue = useMemo(() =>
    payments.filter(p => myRoomIds.has(p.roomId)).reduce((s, p) => s + p.amount, 0),
  [payments, myRoomIds]);

  // Tenant stats
  const myRoom = useMemo(() =>
    rooms.find(r => r.id === currentUser?.roomId), [rooms, currentUser]);
  const myComplaints = useMemo(() =>
    complaints.filter(c => c.userId === currentUser?.id), [complaints, currentUser]);
  const myPayments = useMemo(() =>
    payments.filter(p => p.tenantId === currentUser?.id), [payments, currentUser]);

  const hasRooms = myRooms.length > 0;

  if (!currentUser) return null;

  return (
    <div className="min-h-screen p-6 md:p-10 pb-24 space-y-10 max-w-[1400px] mx-auto">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/15 rounded-full text-purple-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <Zap className="w-3 h-3 fill-purple-400" />
            {isOwner ? "Owner Dashboard" : "Tenant Portal"}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-tight">{greeting}</h1>
          <p className="text-[--muted] text-lg font-medium mt-1.5">
            {isOwner
              ? hasRooms ? `Managing ${myRooms.length} ${myRooms.length === 1 ? "property" : "properties"} across India` : "Ready to list your first property?"
              : myRoom ? `You're living at ${myRoom.title}` : "Browse the marketplace to find your perfect PG"}
          </p>
        </div>
        {isOwner && (
          <Link href="/dashboard/rooms">
            <motion.div
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-7 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-black text-sm shadow-2xl shadow-purple-500/20 hover:from-purple-500 hover:to-indigo-500 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {hasRooms ? "Add Property" : "List First Room"}
            </motion.div>
          </Link>
        )}
        {!isOwner && !myRoom && (
          <Link href="/dashboard/rooms">
            <motion.div
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-7 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-black text-sm shadow-2xl shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-500 transition-all cursor-pointer"
            >
              <BedDouble className="w-4 h-4" />
              Browse Rooms
            </motion.div>
          </Link>
        )}
      </motion.div>

      {/* ── OWNER VIEW ── */}
      {isOwner && !hasRooms ? (
        /* Empty state for owner with no rooms */
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden p-10 md:p-16 bg-white/[0.02] border border-white/[0.05] rounded-[40px]"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/[0.08] rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10 max-w-lg space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Start your PG <br />
              <span className="text-gradient">business today.</span>
            </h2>
            <p className="text-[--muted] text-lg leading-relaxed">
              List rooms in any city across India. Tenants search and book directly. Manage everything from one dashboard.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Building2, label: "List Rooms", desc: "In any Indian city" },
                { icon: Users,     label: "Get Tenants", desc: "Auto-matched booking" },
                { icon: TrendingUp, label: "Track Revenue", desc: "Per property analytics" },
                { icon: MessageSquareWarning, label: "Handle Issues", desc: "Smart complaint desk" },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/[0.04] rounded-[20px]">
                  <div className="h-10 w-10 rounded-2xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-black text-white text-sm">{f.label}</p>
                    <p className="text-[10px] text-[--muted] font-semibold">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : isOwner ? (
        /* Owner WITH rooms */
        <div className="space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { label: "My Properties", value: myRooms.length,     icon: Building2,          link: "/dashboard/rooms",      from: "from-purple-500", to: "to-indigo-600" },
              { label: "My Tenants",    value: ownerTenantCount,    icon: Users,               link: "/dashboard/tenants",    from: "from-blue-500",   to: "to-cyan-600"   },
              { label: "Open Issues",   value: ownerOpenComplaints, icon: MessageSquareWarning,link: "/dashboard/complaints", from: "from-rose-500",   to: "to-pink-600"   },
              { label: "Total Revenue", value: formatPrice(ownerRevenue), icon: TrendingUp,    link: "/dashboard/payments",   from: "from-emerald-500",to: "to-teal-600"   },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link href={s.link}>
                  <div className="group p-7 bg-white/[0.025] border border-white/[0.05] hover:border-purple-500/20 rounded-[28px] flex flex-col gap-5 transition-all hover:shadow-xl hover:shadow-purple-500/[0.07] h-full">
                    <div className="flex justify-between items-start">
                      <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${s.from} ${s.to} flex items-center justify-center shadow-lg`}>
                        <s.icon className="w-6 h-6 text-white" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors" />
                    </div>
                    <div>
                      <p className="text-[--muted] text-xs font-black uppercase tracking-widest mb-1">{s.label}</p>
                      <p className="text-2xl md:text-3xl font-black text-white">{s.value}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Properties list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">Your Listings</h2>
              <Link href="/dashboard/rooms">
                <div className="inline-block text-xs text-purple-400 font-black hover:text-purple-300 transition-colors uppercase tracking-wider cursor-pointer">View All →</div>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {myRooms.slice(0, 3).map((room, i) => (
                <motion.div key={room.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                  className="group bg-white/[0.025] border border-white/[0.05] hover:border-purple-500/20 rounded-[24px] overflow-hidden transition-all"
                >
                  <div className="h-40 relative overflow-hidden">
                    <img src={room.image} alt={room.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/20 to-transparent" />
                    <span className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-full border backdrop-blur-md ${room.isBooked ? "bg-rose-500/20 text-rose-300 border-rose-500/20" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/20"}`}>
                      {room.isBooked ? "Occupied" : "Available"}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-white text-base leading-tight mb-1">{room.title}</h3>
                    <div className="flex items-center gap-1 text-[--muted] text-xs font-semibold mb-3">
                      <MapPin className="w-3 h-3 text-purple-400" />{room.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-white">{formatPrice(room.price)}<span className="text-xs text-[--muted] font-normal">/mo</span></span>
                      <span className="text-xs text-[--muted] font-bold">Floor {room.floor}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── TENANT VIEW ── */
        <div className="space-y-8">
          {myRoom ? (
            /* Tenant with room */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[
                  { label: "Monthly Rent",  value: formatPrice(myRoom.price), icon: TrendingUp,          link: "/dashboard/payments",   from: "from-purple-500", to: "to-indigo-600" },
                  { label: "My Complaints", value: myComplaints.length,        icon: MessageSquareWarning, link: "/dashboard/complaints", from: "from-rose-500",   to: "to-pink-600"   },
                  { label: "Payments Made", value: myPayments.filter(p => p.status === "paid").length, icon: Check, link: "/dashboard/payments", from: "from-emerald-500", to: "to-teal-600" },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <Link href={s.link}>
                      <div className="group p-7 bg-white/[0.025] border border-white/[0.05] hover:border-purple-500/20 rounded-[28px] flex flex-col gap-5 transition-all h-full">
                        <div className="flex justify-between items-start">
                          <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${s.from} ${s.to} flex items-center justify-center shadow-lg`}>
                            <s.icon className="w-6 h-6 text-white" />
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors" />
                        </div>
                        <div>
                          <p className="text-[--muted] text-xs font-black uppercase tracking-widest mb-1">{s.label}</p>
                          <p className="text-2xl font-black text-white">{s.value}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Room card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white/[0.025] border border-white/[0.05] rounded-[28px] overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="h-52 md:h-auto md:w-64 relative overflow-hidden flex-shrink-0">
                    <img src={myRoom.image} alt={myRoom.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050508] hidden md:block" />
                  </div>
                  <div className="p-8 flex flex-col justify-center space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/15 px-3 py-1 rounded-full">Your Room</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30 bg-white/[0.04] border border-white/[0.05] px-3 py-1 rounded-full">{myRoom.type}</span>
                      </div>
                      <h2 className="text-2xl font-black text-white">{myRoom.title}</h2>
                      <p className="text-[--muted] text-sm font-medium flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-purple-400" />{myRoom.location} · Floor {myRoom.floor}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {myRoom.amenities.map(a => (
                        <span key={a} className="text-[10px] font-black bg-white/[0.04] border border-white/[0.05] px-3 py-1 rounded-lg text-[--muted]">{a}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-5">
                      <div>
                        <p className="text-xs text-[--muted] font-black uppercase tracking-widest">Monthly Rent</p>
                        <p className="text-2xl font-black text-purple-400">{formatPrice(myRoom.price)}</p>
                      </div>
                      <Link href="/dashboard/complaints">
                        <div className="px-5 py-2.5 bg-white/[0.05] border border-white/[0.06] text-white text-sm font-black rounded-xl hover:bg-white/[0.09] transition-all cursor-pointer inline-flex">
                          Report Issue
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            /* Tenant without room — CTA to browse */
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden p-10 md:p-16 bg-white/[0.02] border border-white/[0.05] rounded-[40px] text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.08] to-purple-600/[0.08] pointer-events-none" />
              <div className="relative z-10 space-y-6 max-w-lg mx-auto">
                <div className="h-20 w-20 rounded-3xl bg-blue-500/10 flex items-center justify-center mx-auto border border-blue-500/15">
                  <BedDouble className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-3xl font-black text-white">Find your perfect PG</h2>
                <p className="text-[--muted] text-base leading-relaxed">
                  Browse thousands of verified PG rooms across Indian cities. Filter by location, type, and budget.
                </p>
                <Link href="/dashboard/rooms">
                  <div className="inline-block px-10 py-4 bg-white text-black rounded-2xl font-black text-base hover:bg-gray-100 transition-all cursor-pointer">
                    Browse All Rooms →
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
