"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Users, Mail, BedDouble, AlertCircle, MapPin, Building2, Zap } from "lucide-react";

export default function TenantsPage() {
  const { currentUser, users, rooms, payments, formatPrice } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) { router.replace("/login"); return; }
    if (currentUser.role !== "owner") router.replace("/dashboard");
  }, [currentUser, router]);

  // Only rooms this owner owns
  const myRooms = useMemo(() => rooms.filter(r => r.ownerId === currentUser?.id), [rooms, currentUser]);
  const myRoomIds = useMemo(() => new Set(myRooms.map(r => r.id)), [myRooms]);

  // Only tenants living in this owner's rooms
  const myTenants = useMemo(() =>
    users.filter(u => u.role === "tenant" && u.roomId && myRoomIds.has(u.roomId)),
    [users, myRoomIds]
  );

  if (!currentUser || currentUser.role !== "owner") return null;

  const getRentStatus = (tenantId: string) => {
    const p = payments.find(p => p.tenantId === tenantId);
    return p?.status ?? "—";
  };

  const avatarGradients = [
    "from-purple-500 to-indigo-600",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-500",
    "from-indigo-500 to-purple-600",
  ];

  const statusStyle: Record<string, string> = {
    paid:    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    due:     "bg-amber-500/10  text-amber-400  border-amber-500/20",
    overdue: "bg-rose-500/10   text-rose-400   border-rose-500/20",
  };

  return (
    <div className="min-h-screen p-6 md:p-10 pb-24 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Tenants</h1>
          <p className="text-[--muted] text-base font-medium mt-1">
            People living in your {myRooms.length} listed {myRooms.length === 1 ? "property" : "properties"}
          </p>
        </div>
      </div>

      {/* Owner has no rooms yet */}
      {myRooms.length === 0 && (
        <div className="p-8 bg-amber-500/5 border border-amber-500/15 rounded-[28px] flex items-start gap-5">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="font-black text-amber-300 text-lg">No properties listed yet</p>
            <p className="text-amber-400/70 text-sm mt-1 font-medium leading-relaxed">
              Once you list rooms and tenants book them, they will appear here. Each owner can only see tenants in their own properties.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      {myRooms.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Your Rooms",      value: myRooms.length,  icon: Building2,  accent: "text-purple-400", glow: "from-purple-500/10" },
            { label: "Tenants",         value: myTenants.length, icon: Users,      accent: "text-blue-400",   glow: "from-blue-500/10"   },
            { label: "Pending Payments",value: payments.filter(p => myRoomIds.has(p.roomId) && p.status !== "paid").length, icon: AlertCircle, accent: "text-rose-400", glow: "from-rose-500/10" },
          ].map((s, i) => (
            <div key={i} className={`p-5 bg-white/[0.025] border border-white/[0.05] rounded-[24px] relative overflow-hidden flex items-center gap-4`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${s.glow} to-transparent opacity-50 pointer-events-none`} />
              <div className="relative h-11 w-11 rounded-2xl bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                <s.icon className={`w-5 h-5 ${s.accent}`} />
              </div>
              <div className="relative">
                <p className="text-[--muted] text-xs font-black uppercase tracking-widest">{s.label}</p>
                <p className="text-2xl font-black text-white">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Room-by-room view */}
      {myRooms.length > 0 && myRooms.map((room, ri) => {
        const roomTenants = myTenants.filter(t => t.roomId === room.id);
        return (
          <div key={room.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-purple-500/20 to-transparent" />
              <div className="flex items-center gap-2 px-4 py-1.5 bg-white/[0.03] border border-white/[0.05] rounded-full">
                <BedDouble className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-black text-[--muted]">{room.title}</span>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-wider ml-1">·</span>
                <MapPin className="w-3 h-3 text-purple-400" />
                <span className="text-xs font-black text-[--muted]">{room.location}</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-purple-500/20 to-transparent" />
            </div>

            {roomTenants.length === 0 ? (
              <div className="p-6 bg-white/[0.02] border border-white/[0.04] rounded-[24px] text-center">
                <p className="text-[--muted] text-sm font-bold">No tenants in this room yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {roomTenants.map((tenant, ti) => {
                  const rentStatus = getRentStatus(tenant.id);
                  return (
                    <motion.div key={tenant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (ri * 0.1) + (ti * 0.08) }}
                      className="p-6 bg-white/[0.025] border border-white/[0.05] hover:border-purple-500/20 rounded-[24px] space-y-4 transition-all"
                    >
                      {/* Tenant header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${avatarGradients[ti % avatarGradients.length]} flex items-center justify-center font-black text-white text-sm shadow-lg`}>
                            {tenant.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-white leading-tight">{tenant.name}</p>
                            <p className="text-xs text-[--muted] font-semibold flex items-center gap-1">
                              <Mail className="w-3 h-3" />{tenant.email}
                            </p>
                          </div>
                        </div>
                        {rentStatus !== "—" && (
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl border ${statusStyle[rentStatus]}`}>
                            {rentStatus}
                          </span>
                        )}
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

                      {/* Room details */}
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-[--muted] font-semibold">{room.type} Room</p>
                        <p className="font-black text-white">{formatPrice(room.price)}<span className="text-xs text-[--muted] font-normal">/mo</span></p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {myRooms.length > 0 && myTenants.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="h-20 w-20 rounded-3xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center">
            <Users className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-xl font-black text-white">No tenants yet</h3>
          <p className="text-[--muted] font-medium text-sm max-w-xs">Your rooms are listed but no tenants have booked them yet.</p>
        </div>
      )}
    </div>
  );
}
