"use client";

import { motion } from "framer-motion";
import { Wifi, Coffee, Wind, Tv, BedDouble, Users, MapPin, Star } from "lucide-react";

const amenities = [
  { icon: Wifi,      label: "High-speed WiFi" },
  { icon: Coffee,    label: "Mess Included" },
  { icon: Wind,      label: "AC Rooms" },
  { icon: Tv,        label: "Common TV" },
];

const rooms = [
  {
    id: 1,
    name: "Premium Single Occupancy",
    location: "Sector 62, Noida",
    price: 9500,
    rating: 4.8,
    capacity: 1,
    occupied: true,
    color: "from-purple-500/15",
    badge: "Popular",
    badgeColor: "bg-purple-500/20 text-purple-300",
    tenants: ["bg-purple-400"],
  },
  {
    id: 2,
    name: "Sharing Double Bed",
    location: "Koramangala, Bangalore",
    price: 7000,
    rating: 4.6,
    capacity: 2,
    occupied: false,
    color: "from-blue-500/15",
    badge: "Available",
    badgeColor: "bg-green-500/20 text-green-300",
    tenants: ["bg-blue-400", "bg-indigo-400"],
  },
  {
    id: 3,
    name: "Luxury Suite — Full Floor",
    location: "Baner, Pune",
    price: 14000,
    rating: 4.9,
    capacity: 1,
    occupied: false,
    color: "from-emerald-500/15",
    badge: "Premium",
    badgeColor: "bg-amber-500/20 text-amber-300",
    tenants: [],
  },
];

export default function RoomSection() {
  return (
    <section id="rooms" className="py-28 relative overflow-hidden bg-[#06060c]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="container mx-auto px-6 max-w-6xl relative z-10">

        <div className="text-center mb-16">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold tracking-widest text-purple-400 uppercase mb-3">
            PG Listings
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-5">
            Find your perfect room
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-lg max-w-xl mx-auto">
            Browse verified PG accommodations with transparent pricing and real amenities.
          </motion.p>
        </div>

        {/* Amenities chips */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-3 mb-14">
          {amenities.map((a, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm text-white/70">
              <a.icon className="w-4 h-4 text-purple-400" />
              {a.label}
            </div>
          ))}
        </motion.div>

        {/* Room cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {rooms.map((room, i) => (
            <motion.div key={room.id}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="glass-card rounded-2xl overflow-hidden border border-white/[0.06] group cursor-pointer">

              {/* Room image placeholder */}
              <div className={`relative h-44 bg-gradient-to-br ${room.color} to-transparent flex items-end p-5 border-b border-white/5`}>
                {/* Illustration of room */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <BedDouble className="w-24 h-24 text-white" />
                </div>
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${room.badgeColor} backdrop-blur-sm border border-white/10`}>
                    {room.badge}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-medium">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {room.rating}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-white text-base mb-1">{room.name}</h3>
                <div className="flex items-center gap-1 text-xs text-white/45 mb-4">
                  <MapPin className="w-3 h-3" />{room.location}
                </div>

                {/* Tenant indicators */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Users className="w-3.5 h-3.5" />
                    <span>{room.capacity === 1 ? "Single" : `Shared (${room.capacity})`}</span>
                  </div>
                  <div className="flex -space-x-1.5">
                    {room.tenants.map((c, idx) => (
                      <div key={idx} className={`w-6 h-6 rounded-full ${c} border-2 border-[#0d0d18] ring-1 ring-white/10`} />
                    ))}
                    {room.tenants.length === 0 && (
                      <div className="text-xs text-green-400 font-medium">Open bed</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-white">₹{room.price.toLocaleString()}</span>
                    <span className="text-xs text-white/40">/month</span>
                  </div>
                  <button className="rounded-xl px-4 py-2 text-xs font-medium bg-white/5 border border-white/10 text-white hover:bg-purple-500/20 hover:border-purple-500/40 transition-all group-hover:bg-purple-500/20">
                    View Room
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
