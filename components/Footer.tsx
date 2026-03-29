"use client";

import { motion } from "framer-motion";
import { 
  Building2, Twitter, Github, Linkedin, Mail, MapPin, Phone
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: "Product",
      links: [
        { name: "Explore Rooms", href: "/#rooms" },
        { name: "Features", href: "/#features" },
        { name: "Sitemap", href: "#" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Carrers", href: "#" },
        { name: "Contact", href: "#" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
      ]
    }
  ];

  return (
    <footer className="bg-[#050508] border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">StayEase</span>
            </Link>
            
            <p className="text-[--muted] text-sm leading-relaxed max-w-sm">
              The smartest platform for modern PG owners and tenants. Automating the living experience through design and technology.
            </p>
            
            <div className="flex items-center gap-4">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <Link key={i} href="#" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-purple-400 hover:border-purple-500/30 transition-all">
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-white/40">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm font-bold text-[--muted] hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-xs font-bold text-white/30 tracking-wide">
            &copy; {currentYear} STAYEASE INC. ALL RIGHTS RESERVED.
          </p>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-white/30 text-xs font-bold">
              <MapPin className="w-3 h-3 text-purple-600" /> Bengaluru, India
            </div>
            <div className="flex items-center gap-2 text-white/30 text-xs font-bold">
              <Phone className="w-3 h-3 text-purple-600" /> 1800 200 1234
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
