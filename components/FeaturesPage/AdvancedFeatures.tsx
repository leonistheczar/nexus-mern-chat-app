"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Activity,
  Network,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Client-Side Cryptography",
    desc: "Public-private key encryption ensures messages are encrypted before leaving your device.",
  },
  {
    icon: Activity,
    title: "Event-Driven Realtime Engine",
    desc: "Socket-based architecture enables instant message delivery, typing indicators, and presence updates.",
  },
  {
    icon: Network,
    title: "Scalable Room Architecture",
    desc: "Supports both peer-to-peer chats and mini-group conversations using efficient room models.",
  },
  {
    icon: BarChart3,
    title: "Built-in Observability",
    desc: "Track usage, monitor activity, and gain insights through admin analytics dashboards.",
  },
];

export default function AdvancedFeatures() {
  return (
    <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-8">
      {features.map((f, i) => {
        const Icon = f.icon;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{once: true}}
            className="flex flex-col items-center p-6 rounded-xl bg-accent-50 shadow-sm hover:shadow-lg transition"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-100 mb-4">
              <Icon className="w-6 h-6 text-primary-700" />
            </div>

            <h3 className="text-xl font-semibold mb-2">
              {f.title}
            </h3>

            <p className="text-primary-600 text-sm leading-relaxed">
              {f.desc}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}