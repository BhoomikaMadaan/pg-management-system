"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-card rounded-3xl p-10 md:p-16 text-center border border-white/[0.06] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 to-blue-600/5 pointer-events-none" />
          <div className="relative">
            <p className="text-sm font-semibold tracking-widest text-purple-400 uppercase mb-4">Get Started Today</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to modernize<br />your PG management?
            </h2>
            <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of landlords who've left behind spreadsheets and WhatsApp chaos. Start free, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 font-semibold shadow-xl shadow-purple-500/30 text-base">
                  Start for Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/login">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 font-medium text-white text-base hover:bg-white/10 transition-colors">
                  Sign in to your account
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
