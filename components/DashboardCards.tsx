"use client";

import { motion } from "framer-motion";

const cards = [
    { title: "Rooms", value: "42" },
    { title: "Tenants", value: "128" },
    { title: "Complaints", value: "6" },
    { title: "Revenue", value: "$12,500" },
];

export default function DashboardCards() {
    return (
        <section className="py-24 bg-[#111827]">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
                {cards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className="bg-[#1f2937] p-6 rounded-xl text-white shadow-lg"
                    >
                        <h3 className="text-lg mb-2">{card.title}</h3>
                        <p className="text-3xl font-bold">{card.value}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}