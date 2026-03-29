"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import {
  Plus, X, AlertCircle, Clock, CheckCircle2, Filter,
  ChevronDown, MessageSquareWarning, Zap
} from "lucide-react";

const STATUS_CONFIG = {
  open:        { label: "Open",        color: "text-rose-400",   bg: "bg-rose-500/10",    border: "border-rose-500/20"   },
  "in-progress":{ label: "In Progress",color: "text-amber-400",  bg: "bg-amber-500/10",   border: "border-amber-500/20"  },
  resolved:    { label: "Resolved",    color: "text-emerald-400",bg: "bg-emerald-500/10", border: "border-emerald-500/20"},
};
const PRIORITY_CONFIG = {
  high:   { color: "text-rose-400",   bg: "bg-rose-500/10",    border: "border-rose-500/20"   },
  medium: { color: "text-amber-400",  bg: "bg-amber-500/10",   border: "border-amber-500/20"  },
  low:    { color: "text-blue-400",   bg: "bg-blue-500/10",    border: "border-blue-500/20"   },
};
const CATEGORIES  = ["Maintenance", "Plumbing", "Electrical", "Hygiene", "Security", "WiFi", "Other"];
const PRIORITIES  = ["high", "medium", "low"] as const;

export default function ComplaintsPage() {
  const { currentUser, rooms, complaints, addComplaint, updateComplaintStatus } = useStore();
  const router = useRouter();

  const isOwner = currentUser?.role === "owner";

  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "in-progress" | "resolved">("all");
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "Maintenance", priority: "medium" as "high" | "medium" | "low" });
  const [formErr, setFormErr] = useState("");

  // ── Access control ─────────────────────────────────────
  // Owner: only sees complaints from rooms THEY own
  // Tenant: only sees their OWN complaints
  const visibleComplaints = useMemo(() => {
    if (!currentUser) return [];

    const myRoomIds = rooms.filter(r => r.ownerId === currentUser.id).map(r => r.id);

    const list = isOwner
      ? complaints.filter(c => c.roomId && myRoomIds.includes(c.roomId))
      : complaints.filter(c => c.userId === currentUser.id);

    if (statusFilter === "all") return list;
    return list.filter(c => c.status === statusFilter);
  }, [complaints, currentUser, isOwner, rooms, statusFilter]);

  const stats = useMemo(() => ({
    total:      visibleComplaints.length,
    open:       visibleComplaints.filter(c => c.status === "open").length,
    inProgress: visibleComplaints.filter(c => c.status === "in-progress").length,
    resolved:   visibleComplaints.filter(c => c.status === "resolved").length,
  }), [visibleComplaints]);

  // ── Rooms the tenant is in (for complaint reference) ───
  const myRoom = !isOwner ? rooms.find(r => r.id === currentUser?.roomId) : null;

  const handleSubmit = () => {
    if (!form.title.trim() || !form.description.trim()) {
      setFormErr("Title and description are required."); return;
    }
    addComplaint({
      userId:      currentUser!.id,
      userName:    currentUser!.name,
      roomId:      myRoom?.id,
      title:       form.title.trim(),
      description: form.description.trim(),
      category:    form.category,
      priority:    form.priority,
      status:      "open",
    });
    setShowModal(false);
    setForm({ title: "", description: "", category: "Maintenance", priority: "medium" });
    setFormErr("");
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen p-6 md:p-10 space-y-8 max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Complaints</h1>
          <p className="text-[--muted] text-base font-medium mt-1">
            {isOwner ? "Issues raised in your properties" : "Your submitted issues"}
          </p>
        </div>
        {!isOwner && (
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-purple-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Raise Complaint
          </motion.button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total",       value: stats.total,      icon: MessageSquareWarning, color: "from-purple-500/20", accent: "text-purple-400" },
          { label: "Open",        value: stats.open,        icon: AlertCircle,          color: "from-rose-500/20",   accent: "text-rose-400"   },
          { label: "In Progress", value: stats.inProgress,  icon: Clock,                color: "from-amber-500/20",  accent: "text-amber-400"  },
          { label: "Resolved",    value: stats.resolved,    icon: CheckCircle2,         color: "from-emerald-500/20",accent: "text-emerald-400"},
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-5 bg-white/[0.025] border border-white/[0.05] rounded-[24px] relative overflow-hidden`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} to-transparent opacity-40 pointer-events-none`} />
            <div className="relative flex items-center gap-4">
              <div className="h-10 w-10 rounded-2xl bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                <s.icon className={`w-5 h-5 ${s.accent}`} />
              </div>
              <div>
                <p className="text-[--muted] text-xs font-black uppercase tracking-widest">{s.label}</p>
                <p className="text-2xl font-black text-white">{s.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1.5 bg-white/[0.03] border border-white/[0.05] rounded-2xl w-fit">
        {(["all", "open", "in-progress", "resolved"] as const).map(f => (
          <button key={f} onClick={() => setStatusFilter(f)}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              statusFilter === f ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "text-[--muted] hover:text-white"
            }`}>
            {f === "all" ? "All" : f === "in-progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Owner note if no rooms */}
      {isOwner && rooms.filter(r => r.ownerId === currentUser.id).length === 0 && (
        <div className="p-6 bg-amber-500/5 border border-amber-500/15 rounded-2xl flex items-start gap-4">
          <Zap className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-black text-amber-300 text-sm">No properties listed yet</p>
            <p className="text-amber-400/70 text-xs mt-0.5 font-medium">Complaints from your tenants will appear here once you list a room.</p>
          </div>
        </div>
      )}

      {/* Complaint Cards */}
      <div className="space-y-3">
        {visibleComplaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center space-y-4">
            <div className="h-20 w-20 rounded-3xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center">
              <MessageSquareWarning className="w-10 h-10 text-purple-400/40" />
            </div>
            <h3 className="text-xl font-black text-white">All clear!</h3>
            <p className="text-[--muted] font-medium text-sm max-w-xs">
              {isOwner ? "No complaints from your tenants." : "You haven't raised any complaints yet."}
            </p>
          </div>
        ) : (
          visibleComplaints.map((complaint, i) => {
            const { label, color, bg, border } = STATUS_CONFIG[complaint.status];
            const pConf = PRIORITY_CONFIG[complaint.priority];
            const isExpanded = expandedId === complaint.id;

            return (
              <motion.div key={complaint.id}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`bg-white/[0.025] border border-white/[0.05] hover:border-purple-500/20 rounded-[24px] overflow-hidden transition-all`}
              >
                {/* Card header */}
                <div
                  className="flex items-start justify-between gap-4 p-6 cursor-pointer group"
                  onClick={() => setExpandedId(isExpanded ? null : complaint.id)}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className={`h-10 w-10 rounded-2xl ${bg} border ${border} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <AlertCircle className={`w-5 h-5 ${color}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-black text-white leading-tight">{complaint.title}</p>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${pConf.bg} ${pConf.color} border ${pConf.border}`}>{complaint.priority}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[--muted] font-semibold flex-wrap">
                        {isOwner && <span className="text-purple-400 font-black">👤 {complaint.userName}</span>}
                        <span>{complaint.category}</span>
                        <span>·</span>
                        <span>{new Date(complaint.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`hidden sm:inline-flex text-xs font-black px-3 py-1.5 rounded-xl ${bg} ${color} border ${border}`}>{label}</span>
                    <ChevronDown className={`w-4 h-4 text-[--muted] transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </div>

                {/* Accordion body */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 space-y-5 pt-0">
                        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
                        <p className="text-sm text-[--muted] leading-relaxed font-medium">{complaint.description}</p>

                        {/* Owner: update status */}
                        {isOwner && (
                          <div className="flex flex-wrap gap-2">
                            <p className="w-full text-xs font-black uppercase tracking-widest text-[--muted] mb-1">Update Status</p>
                            {(["open", "in-progress", "resolved"] as const).map(st => {
                              const c = STATUS_CONFIG[st];
                              return (
                                <button key={st} onClick={() => updateComplaintStatus(complaint.id, st)}
                                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${
                                    complaint.status === st
                                      ? `${c.bg} ${c.color} ${c.border} shadow-sm`
                                      : "bg-white/[0.04] border-white/[0.05] text-[--muted] hover:text-white hover:bg-white/[0.07]"
                                  }`}>
                                  {c.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Raise Complaint Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            style={{ backdropFilter: "blur(20px)", background: "rgba(0,0,0,0.7)" }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-[#0c0c14] border border-white/[0.07] rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-7 border-b border-white/[0.05] flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black text-white">Raise a Complaint</h2>
                  {myRoom && <p className="text-[--muted] text-xs mt-1 font-semibold">Regarding: <span className="text-purple-400">{myRoom.title}</span></p>}
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl bg-white/[0.04] text-[--muted] hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-7 space-y-5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[--muted] mb-2">Title *</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                    placeholder="e.g. AC not working, Water leakage..."
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/40 transition-all font-medium" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[--muted] mb-2">Category</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/40 transition-all appearance-none font-medium">
                      {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0c0c14]">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[--muted] mb-2">Priority</label>
                    <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value as "high"|"medium"|"low"})}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/40 transition-all appearance-none font-medium">
                      {PRIORITIES.map(p => <option key={p} value={p} className="bg-[#0c0c14]">{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[--muted] mb-2">Description *</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4}
                    placeholder="Please describe the issue in detail..."
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/40 transition-all font-medium resize-none" />
                </div>

                {formErr && <p className="text-rose-400 text-xs font-black uppercase tracking-widest">{formErr}</p>}

                <div className="flex gap-3 pt-1">
                  <button onClick={() => setShowModal(false)} className="flex-1 py-4 bg-white/[0.04] border border-white/[0.05] text-[--muted] rounded-2xl font-black text-sm hover:text-white hover:bg-white/[0.07] transition-all">Cancel</button>
                  <button onClick={handleSubmit} className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-purple-500/20 transition-all">
                    Submit Complaint
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
