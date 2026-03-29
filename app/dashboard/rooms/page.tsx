"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import {
  Search, MapPin, Plus, Trash2, BedDouble, Wifi, Wind,
  Utensils, Lock, Star, SlidersHorizontal, X, Check,
  ShieldCheck, Zap, Home, ChevronDown
} from "lucide-react";

const CITIES = ["All Cities", "Bengaluru", "Mumbai", "Pune", "Delhi", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad"];
const TYPES  = ["All Types", "Single", "Double", "Suite", "Triple"];
const SORT   = ["Newest", "Price: Low to High", "Price: High to Low", "Popular"];

const iconMap: Record<string, React.ElementType> = {
  "AC": Wind, "WiFi": Wifi, "Mess": Utensils, "Locker": Lock,
  "All Meals": Utensils, "Attached Bath": Home, "Common Kitchen": Utensils,
};

const AMENITY_IMAGES = [
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&auto=format&fit=crop",
];

export default function RoomsPage() {
  const { currentUser, rooms, addRoom, deleteRoom, bookRoom, formatPrice } = useStore();
  const router = useRouter();

  const isOwner  = currentUser?.role === "owner";
  const isTenant = currentUser?.role === "tenant";

  // Filters
  const [search,   setSearch]   = useState("");
  const [cityFilter, setCity]   = useState("All Cities");
  const [typeFilter, setType]   = useState("All Types");
  const [sortBy,   setSort]     = useState("Newest");
  const [showAvailable, setAvailable] = useState(false);

  // Add-room modal
  const [showModal, setShowModal] = useState(false);
  const [pickedImg, setPickedImg] = useState(0);
  const [form, setForm] = useState({ title: "", price: "", description: "", type: "Single", location: "Bengaluru", floor: "1" });
  const [formErr, setFormErr] = useState("");

  // Book confirmation
  const [bookingRoomId,  setBookingRoomId]  = useState<string | null>(null);
  const [bookMsg,        setBookMsg]        = useState<string | null>(null);
  const [bookSuccess,    setBookSuccess]    = useState(false);

  const filtered = useMemo(() => {
    let list = [...rooms];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r => r.title.toLowerCase().includes(q) || r.location?.toLowerCase().includes(q));
    }
    if (cityFilter !== "All Cities") list = list.filter(r => r.location === cityFilter);
    if (typeFilter !== "All Types")  list = list.filter(r => r.type    === typeFilter);
    if (showAvailable)               list = list.filter(r => !r.isBooked);

    // Owner: only see their own rooms in the management view — but for marketplace all are visible
    // Sort
    if (sortBy === "Price: Low to High")  list.sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low")  list.sort((a, b) => b.price - a.price);

    return list;
  }, [rooms, search, cityFilter, typeFilter, showAvailable, sortBy]);

  const handleAddRoom = () => {
    if (!form.title || !form.price || !form.description || !form.location) {
      setFormErr("Please fill all required fields."); return;
    }
    if (isNaN(Number(form.price)) || Number(form.price) < 1000) {
      setFormErr("Price must be at least ₹1,000."); return;
    }
    addRoom({
      title: form.title, price: Number(form.price),
      description: form.description, type: form.type as "Single" | "Double" | "Suite" | "Triple",
      location: form.location, floor: Number(form.floor),
      image: AMENITY_IMAGES[pickedImg], ownerId: currentUser!.id, isBooked: false,
      amenities: ["WiFi"],
    });
    setShowModal(false);
    setForm({ title: "", price: "", description: "", type: "Single", location: "Bengaluru", floor: "1" });
    setFormErr("");
  };

  const handleBook = (roomId: string) => {
    const err = bookRoom(roomId);
    if (err) { setBookMsg(err); setBookSuccess(false); }
    else      { setBookMsg("Room booked successfully! 🎉"); setBookSuccess(true); }
    setBookingRoomId(null);
    setTimeout(() => setBookMsg(null), 4000);
  };

  if (!currentUser) return null;

  const Select = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) => (
    <div className="relative group">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] text-white text-sm font-semibold rounded-xl pl-4 pr-10 py-2.5 cursor-pointer focus:outline-none focus:border-purple-500/40 transition-all"
      >
        {options.map(o => <option key={o} value={o} className="bg-[#0a0a14] text-white">{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050508]">
      {/* Hero Search Bar */}
      <div className="relative overflow-hidden py-14 px-6 md:px-10">
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/[0.12] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-[11px] font-black uppercase tracking-widest mb-5">
              <Zap className="w-3 h-3 fill-purple-400" />
              {rooms.filter(r => !r.isBooked).length} PGs Available Now
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
              Find Your <span className="text-gradient">Perfect PG</span>
            </h1>
            <p className="text-[--muted] mt-3 text-base font-medium">
              Search across {rooms.length} verified PG listings in top Indian cities
            </p>
          </motion.div>

          {/* Main Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-2 p-2 bg-white/[0.04] border border-white/[0.07] backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/40"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by city, area, or room name..."
                className="w-full bg-transparent pl-11 pr-4 py-3.5 text-white placeholder:text-white/25 text-sm font-medium focus:outline-none"
              />
            </div>
            <div className="flex gap-2 items-center px-2">
              <div className="w-px h-8 bg-white/[0.06] hidden sm:block" />
              <Select value={cityFilter} onChange={setCity} options={CITIES} />
              <Select value={typeFilter} onChange={setType} options={TYPES} />
              <button
                onClick={() => setAvailable(!showAvailable)}
                className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all ${showAvailable ? "bg-purple-600 text-white" : "bg-white text-black hover:bg-gray-100"}`}
              >
                {showAvailable ? "Available ✓" : "Search"}
              </button>
            </div>
          </motion.div>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {CITIES.slice(1).map(city => (
              <button
                key={city}
                onClick={() => setCity(cityFilter === city ? "All Cities" : city)}
                className={`px-4 py-1.5 rounded-full text-xs font-black transition-all border ${
                  cityFilter === city
                    ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/20"
                    : "bg-white/[0.03] border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                📍 {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 md:px-10 pb-6">
        <p className="text-sm font-semibold text-[--muted]">
          Showing <span className="text-white font-black">{filtered.length}</span> PG{filtered.length !== 1 ? "s" : ""}
          {cityFilter !== "All Cities" && <span> in <span className="text-purple-400 font-black">{cityFilter}</span></span>}
        </p>

        <div className="flex items-center gap-3">
          <Select value={sortBy} onChange={setSort} options={SORT} />
          {isOwner && (
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-black text-sm shadow-lg shadow-purple-500/20 transition-all"
            >
              <Plus className="w-4 h-4" /> List Your PG
            </motion.button>
          )}
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {bookMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm shadow-2xl ${
              bookSuccess ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
            }`}
          >
            {bookSuccess ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            {bookMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Room Grid */}
      <div className="px-6 md:px-10 pb-20">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
            <div className="h-20 w-20 rounded-3xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05]">
              <MapPin className="w-10 h-10 text-purple-400/50" />
            </div>
            <h3 className="text-2xl font-black text-white">No PGs found</h3>
            <p className="text-[--muted] font-medium">Try a different city or clear the filters</p>
            <button onClick={() => { setSearch(""); setCity("All Cities"); setType("All Types"); setAvailable(false); }}
              className="px-8 py-3 bg-white/[0.05] border border-white/[0.06] text-white rounded-xl font-bold text-sm hover:bg-white/[0.08] transition-all">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((room, i) => {
              const isMyRoom       = room.ownerId === currentUser.id;
              const alreadyBooked  = room.tenantId === currentUser.id;
              const canBook        = isTenant && !room.isBooked && !currentUser.roomId;
              const showBookBtn    = isTenant && !room.isBooked;

              return (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className="group relative bg-white/[0.025] border border-white/[0.05] hover:border-purple-500/25 rounded-[28px] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/[0.08]"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img src={room.image} alt={room.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${
                        room.isBooked
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      }`}>
                        {room.isBooked ? "Occupied" : "Available"}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-black/40 text-white/80 border border-white/[0.08] backdrop-blur-md">
                        {room.type}
                      </span>
                    </div>

                    {isMyRoom && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-500/30 text-purple-300 border border-purple-500/30 backdrop-blur-md">
                        Your Listing
                      </div>
                    )}
                    {alreadyBooked && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-500/30 text-blue-300 border border-blue-500/30 backdrop-blur-md">
                        Your Room
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-[--muted] text-xs font-semibold mb-2">
                        <MapPin className="w-3 h-3 text-purple-400" />
                        {room.location ?? "India"}
                        <span className="mx-1 text-white/10">·</span>
                        <span>Floor {room.floor}</span>
                      </div>
                      <h3 className="font-black text-white text-lg leading-tight group-hover:text-purple-200 transition-colors">
                        {room.title}
                      </h3>
                      <p className="text-xs text-[--muted] mt-1.5 leading-relaxed line-clamp-2">
                        {room.description}
                      </p>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1.5">
                      {room.amenities.slice(0, 4).map(a => {
                        const Icon = iconMap[a] || ShieldCheck;
                        return (
                          <span key={a} className="flex items-center gap-1 px-2.5 py-1 bg-white/[0.04] border border-white/[0.05] rounded-lg text-[10px] font-bold text-[--muted]">
                            <Icon className="w-3 h-3" />{a}
                          </span>
                        );
                      })}
                    </div>

                    {/* Rating row */}
                    <div className="flex items-center gap-1 text-[10px] text-amber-400 font-black">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400" />)}
                      <span className="text-[--muted] font-semibold ml-1">(4.8 · 24 reviews)</span>
                    </div>

                    {/* soft divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

                    {/* Price + Action */}
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-2xl font-black text-white">{formatPrice(room.price)}</span>
                        <span className="text-xs text-[--muted] font-semibold ml-1">/month</span>
                      </div>

                      <div className="flex gap-2">
                        {/* Delete btn for owner */}
                        {isMyRoom && (
                          <button onClick={() => deleteRoom(room.id)}
                            className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Book btn for tenant */}
                        {showBookBtn && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { if (canBook) setBookingRoomId(room.id); else setBookMsg(currentUser.roomId ? "You already have a room booked." : "Please log in as a tenant."); setBookSuccess(false); setTimeout(() => setBookMsg(null), 3000); }}
                            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-black text-xs shadow-lg shadow-purple-500/20 transition-all flex items-center gap-1.5"
                          >
                            <BedDouble className="w-3.5 h-3.5" />
                            Book Now
                          </motion.button>
                        )}

                        {alreadyBooked && (
                          <div className="px-5 py-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-xl font-black text-xs flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" /> Living Here
                          </div>
                        )}

                        {/* Tenant already has a room but this one is available */}
                        {isTenant && !room.isBooked && !canBook && !alreadyBooked && (
                          <div className="px-4 py-2.5 bg-white/[0.04] border border-white/[0.05] text-[--muted] rounded-xl font-bold text-xs">
                            Already booked
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Book Confirmation Modal */}
      <AnimatePresence>
        {bookingRoomId && (() => {
          const room = rooms.find(r => r.id === bookingRoomId)!;
          return (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] flex items-center justify-center p-4"
              style={{ backdropFilter: "blur(20px)", background: "rgba(0,0,0,0.7)" }}
              onClick={() => setBookingRoomId(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-md bg-[#0c0c14] border border-white/[0.07] rounded-[32px] overflow-hidden shadow-2xl"
              >
                <div className="relative h-40">
                  <img src={room.image} alt={room.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14] to-transparent" />
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-white">{room.title}</h2>
                    <p className="text-[--muted] text-sm mt-1 flex items-center gap-1"><MapPin className="w-3 h-3 text-purple-400" />{room.location}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-[--muted] font-semibold">Monthly Rent</span><span className="text-white font-black">{formatPrice(room.price)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[--muted] font-semibold">Security Deposit</span><span className="text-white font-black">{formatPrice(room.price * 2)}</span></div>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
                    <div className="flex justify-between text-sm"><span className="text-[--muted] font-semibold">First Month Total</span><span className="text-purple-400 font-black text-lg">{formatPrice(room.price * 3)}</span></div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setBookingRoomId(null)} className="flex-1 py-3.5 bg-white/[0.04] border border-white/[0.06] text-[--muted] rounded-2xl font-black text-sm hover:text-white hover:bg-white/[0.07] transition-all">
                      Cancel
                    </button>
                    <button onClick={() => handleBook(bookingRoomId)} className="flex-1 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-purple-500/20 hover:from-purple-500 hover:to-indigo-500 transition-all">
                      Confirm Booking
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Add Room Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            style={{ backdropFilter: "blur(20px)", background: "rgba(0,0,0,0.75)" }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#0c0c14] border border-white/[0.07] rounded-[32px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 border-b border-white/[0.05] flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-white">List Your PG Room</h2>
                  <p className="text-[--muted] text-sm mt-0.5 font-medium">Fill in the details to create your listing</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl bg-white/[0.04] text-[--muted] hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                {/* Image Pick */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[--muted] mb-4">Choose a Photo</label>
                  <div className="grid grid-cols-3 gap-3">
                    {AMENITY_IMAGES.map((src, i) => (
                      <div key={i} onClick={() => setPickedImg(i)}
                        className={`relative h-24 rounded-2xl overflow-hidden cursor-pointer transition-all border-2 ${pickedImg === i ? "border-purple-500 shadow-lg shadow-purple-500/30" : "border-transparent"}`}>
                        <img src={src} alt={`Option ${i+1}`} className="w-full h-full object-cover" />
                        {pickedImg === i && <div className="absolute inset-0 bg-purple-500/30 flex items-center justify-center"><Check className="w-6 h-6 text-white" /></div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[--muted] mb-2">Room Title *</label>
                    <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Premium Single Suite"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/40 transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[--muted] mb-2">Monthly Price (₹) *</label>
                    <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} type="number" placeholder="e.g. 12000"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/40 transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[--muted] mb-2">City / Location *</label>
                    <select value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/40 transition-all font-medium appearance-none">
                      {CITIES.slice(1).map(c => <option key={c} value={c} className="bg-[#0c0c14]">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[--muted] mb-2">Room Type</label>
                    <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/40 transition-all font-medium appearance-none">
                      {TYPES.slice(1).map(t => <option key={t} value={t} className="bg-[#0c0c14]">{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-[--muted] mb-2">Description *</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                    placeholder="Describe your PG room, facilities, rules..." rows={3}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/40 transition-all font-medium resize-none" />
                </div>

                {formErr && <p className="text-rose-400 text-xs font-black uppercase tracking-wider">{formErr}</p>}

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowModal(false)} className="flex-1 py-4 bg-white/[0.04] border border-white/[0.05] text-[--muted] rounded-2xl font-black text-sm hover:text-white hover:bg-white/[0.07] transition-all">Cancel</button>
                  <button onClick={handleAddRoom} className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-purple-500/20 transition-all">
                    Publish Listing
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
