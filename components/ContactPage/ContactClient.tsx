"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactClient() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="bg-background-50 text-primary-900 px-6 py-12 rounded-lg shadow-md mt-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto space-y-16"
      >
        {/* Heading */}
        <motion.div variants={item} className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Get in <span className="text-primary-500">Touch</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions, ideas, or feedback about Nexus. Reach out and let’s
            build something better together.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Contact Info */}
          <motion.div variants={item} className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary-100">
                <Mail className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm text-muted-foreground">
                  youremail@example.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary-100">
                <Phone className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-sm text-muted-foreground">
                  +92 300 0000000
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary-100">
                <MapPin className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-sm text-muted-foreground">
                  Multan, Pakistan
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            action={"https://formspree.io/f/moeagykb"}
            method="POST"
            variants={item}
            className="p-6 bg-primary-100 rounded-2xl shadow-md space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="Name"
                placeholder="Your Name"
                className="bg-background-50 w-full px-4 py-2 rounded-lg border border-primary-200 focus:outline-none focus:ring-1 focus:ring-primary-300"
              />
              <input
                type="email"
                name="Email"
                placeholder="Your Email"
                className="bg-background-50 w-full px-4 py-2 rounded-lg border border-primary-200 focus:outline-none focus:ring-1 focus:ring-primary-300"
              />
            </div>

            <input
              type="text"
              name="Subject"
              placeholder="Subject"
              className="bg-background-50 w-full px-4 py-2 rounded-lg border border-primary-200 focus:outline-none focus:ring-1 focus:ring-primary-300"
            />

            <textarea
              rows={5}
              name="Message"
              placeholder="Your Message"
              className="bg-background-50 w-full px-4 py-2 rounded-lg border border-primary-200 focus:outline-none focus:ring-1 focus:ring-primary-300 resize-none"
            />

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition hover:cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </motion.form>
        </div>
      </motion.div>
    </section>
  );
}
