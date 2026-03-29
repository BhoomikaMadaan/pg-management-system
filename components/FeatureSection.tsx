"use client";

import { motion, Variants } from "framer-motion";
import { DoorClosed, Users, MessageSquareWarning, CreditCard, ArrowRight } from "lucide-react";

const features = [
  {
    icon: DoorClosed,
    title: "Manage Rooms",
    description: "Track every room — occupancy status, bed allocation, maintenance schedules, and pricing from one panel.",
    color: "from-blue-500/25 to-transparent",
    iconBg: "bg-blue-500/15 border-blue-500/30",
    iconColor: "text-blue-400",
    accent: "group-hover:border-blue-500/40",
    items: ["Bed allocation", "Maintenance tracking", "Pricing per room"],
  },
  {
    icon: Users,
    title: "Track Tenants",
    description: "Full tenant lifecycle from onboarding to exit — KYC, agreements, deposits, and emergency contacts.",
    color: "from-purple-500/25 to-transparent",
    iconBg: "bg-purple-500/15 border-purple-500/30",
    iconColor: "text-purple-400",
    accent: "group-hover:border-purple-500/40",
    items: ["KYC & documents", "Rent history", "Check-in / out"],
  },
  {
    icon: MessageSquareWarning,
    title: "Handle Complaints",
    description: "Tenants raise issues directly. You assign to staff, track resolution, and notify via real-time push.",
    color: "from-rose-500/25 to-transparent",
    iconBg: "bg-rose-500/15 border-rose-500/30",
    iconColor: "text-rose-400",
    accent: "group-hover:border-rose-500/40",
    items: ["Real-time notifications", "Priority labelling", "Resolution timeline"],
  },
  {
    icon: CreditCard,
    title: "Monitor Payments",
    description: "Automated rent reminders, invoice generation, UPI payment links, and a clean payment ledger.",
    color: "from-emerald-500/25 to-transparent",
    iconBg: "bg-emerald-500/15 border-emerald-500/30",
    iconColor: "text-emerald-400",
    accent: "group-hover:border-emerald-500/40",
    items: ["Auto-reminders", "Invoice PDF", "Revenue analytics"],
  },
];

export default function FeatureSection() {
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const card: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section id="features" className="py-28 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="container mx-auto px-6 max-w-6xl">

        <div className="text-center mb-16">
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold tracking-widest text-indigo-400 uppercase mb-3">
            Platform Features
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-5">
            Everything you need,<br />
            <span className="text-gradient">nothing you don't.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-lg max-w-xl mx-auto">
            Purpose-built for PG owners, landlords, and property managers who are serious about scale.
          </motion.p>
        </div>

        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div key={i} variants={card}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`group glass-card rounded-2xl p-7 border border-white/[0.06] ${f.accent} transition-colors relative overflow-hidden`}>
              <div className={`absolute inset-0 bg-gradient-to-b ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.iconBg} border mb-6`}>
                  <f.icon className={`h-6 w-6 ${f.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed mb-5">{f.description}</p>
                <ul className="space-y-1.5">
                  {f.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-white/40">
                      <ArrowRight className={`w-3 h-3 ${f.iconColor}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
