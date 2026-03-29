"use client";

import { motion } from "framer-motion";
import {
  Building2, Users, MessageSquareWarning, CreditCard,
  ArrowRight, ShieldCheck, Star, MapPin, Zap, Heart
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useStore } from "@/lib/store";

export default function LandingPage() {
  const { rooms, formatPrice } = useStore();

  // Showcase rooms (limit to 3 for the preview)
  const featuredRooms = rooms.slice(0, 3);

  return (
    <div className="bg-[#050508] text-white selection:bg-purple-500/30">
      <Navbar />

      <main>
        {/* Hero Section */}
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
                THE NEXT GEN PG MANAGEMENT
              </div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight mb-8">
                Find & Manage Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500">
                  Perfect PG Home.
                </span>
              </h1>

              <p className="text-[--muted] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                StayEase streamlines PG life for both owners and tenants. Smart bookings, instant complaints, and automated payments.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-white text-black rounded-2xl font-black text-lg shadow-2xl shadow-white/10 hover:bg-gray-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Get Started Free <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
                <Link href="/login">
                  <div className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md cursor-pointer flex items-center justify-center">
                    Explore Rooms
                  </div>
                </Link>
              </div>
            </motion.div>

            {/* Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
              className="mt-20 relative mx-auto max-w-5xl group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[40px] blur opacity-25 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-[#0a0a0f] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1555854817-5b2738f7514d?w=1200" alt="Dashboard Preview" className="w-full h-auto opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3D Property Experience Visual */}
        <section className="py-32 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <h2 className="text-4xl md:text-6xl font-black leading-tight">
                  A real-world <br />
                  <span className="text-purple-500">Property Engine.</span>
                </h2>
                <p className="text-[--muted] text-xl leading-relaxed">
                  We don't just manage data; we manage experiences. From high-def room visuals to seamless tenant onboarding, StayEase is built for the modern real-estate market.
                </p>
                <ul className="space-y-4">
                  {[
                    "Virtual Room Tours (coming soon)",
                    "Real-time Inventory Tracking",
                    "Automated Digital Agreements",
                    "Integrated Utility Management"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-bold text-white/80">
                      <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-purple-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-square"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-[40px] rotate-6 scale-95 blur-xl" />
                <img
                  src="https://images.unsplash.com/photo-1626178732047-3965ff0a2835?w=800"
                  alt="Modern Building"
                  className="relative z-10 w-full h-full object-cover rounded-[40px] border border-white/10 shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Room Showcase */}
        <section className="py-32 bg-white/[0.02]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl md:text-6xl font-black">Featured Listings</h2>
              <p className="text-[--muted] text-lg max-w-xl mx-auto font-medium">
                Live available rooms across prime locations. Book your stay in seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRooms.map((room, i) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-[#0a0a0f] border border-white/5 rounded-[32px] overflow-hidden group hover:border-purple-500/30 transition-all"
                >
                  <div className="h-64 relative overflow-hidden">
                    <img src={room.image} alt={room.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.9
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-black text-white leading-tight">{room.title}</h3>
                        <div className="flex items-center gap-1 text-[--muted] text-sm mt-1">
                          <MapPin className="w-4 h-4 text-purple-400" /> Sector 44, Bengaluru
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-purple-400">{formatPrice(room.price)}</span>
                        <p className="text-[10px] text-[--muted] uppercase font-bold tracking-widest">monthly</p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap pb-4">
                      {room.amenities.slice(0, 3).map((a, j) => (
                        <span key={j} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white/60">
                          {a}
                        </span>
                      ))}
                    </div>

                    <Link href="/login">
                      <div className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 cursor-pointer">
                        View Details <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-20 text-center">
              <Link href="/signup">
                <div className="inline-block px-12 py-5 border border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400 rounded-2xl font-black transition-all cursor-pointer">
                  View All {rooms.length} Rooms
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-32 relative">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Users, title: "Tenant Management", desc: "Digital verification & rapid onboarding." },
                { icon: CreditCard, title: "Smart Payments", desc: "Automated rent collection & invoices." },
                { icon: MessageSquareWarning, title: "Complaint Desk", desc: "Ticketing system for maintenance issues." },
                { icon: ShieldCheck, title: "KYC Verified", desc: "Secure environment with background checks." }
              ].map((f, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px] group"
                >
                  <div className="h-16 w-16 rounded-3xl bg-purple-500/10 flex items-center justify-center mb-8 group-hover:bg-purple-500/20 transition-all">
                    <f.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-4 leading-tight">{f.title}</h3>
                  <p className="text-[--muted] font-medium leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
