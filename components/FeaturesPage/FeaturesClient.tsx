"use client";
import Link from "next/link";
import ScrollRevealSection from "../SharedComponents/ScrollRevelation";
import AdvancedFeatures from "./AdvancedFeatures";
import ChatSimulation from "./ChatSimulation";
import FeatureTabs from "./FeaturesTab";

export default function FeaturesClient(){
    return(
        <div className="flex flex-col gap-y-12">
      {/* 🔹 HERO */}
      <section className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Messaging. Reimagined.
        </h1>
        <p className="mt-6 text-lg text-primary-800/50 max-w-2xl mx-auto">
          Nexus blends real-time speed, end-to-end encryption, and modern UI
          into a seamless communication experience.
        </p>
      </section>

      {/* 🔹 FEATURE EXPLORATION (TABS) */}
      <ScrollRevealSection>
        <section className="max-w-5xl mx-auto text-center space-y-6 bg-primary-300/20 p-4 rounded-lg">
          <h2 className="text-3xl font-semibold">Explore Core Features</h2>
          <p className="text-primary-600">
            Dive into what makes Nexus powerful
          </p>

          <FeatureTabs />
        </section>
      </ScrollRevealSection>

      {/* 🔹 CHAT SIMULATION */}
      <ScrollRevealSection>
        <section className="max-w-5xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-3xl font-semibold">
              Experience Real-Time Messaging
            </h2>
            <p className="text-primary-600">
              Messages appear instantly with typing awareness
            </p>
          </div>

          <ChatSimulation />
        </section>
      </ScrollRevealSection>
      {/* 🔹 ADVANCED CORE FEATURES */}
      <ScrollRevealSection>
        <section className="max-w-6xl mx-auto text-center space-y-10 bg-background-50 p-6 rounded-lg shadow-sm">
          <div>
            <h2 className="text-3xl font-semibold">
              Engineered for Modern Messaging
            </h2>
            <p className="text-primary-600">
              Built with real-world scalability, security, and performance in
              mind
            </p>
          </div>

          <AdvancedFeatures />
        </section>
      </ScrollRevealSection>

      {/* 🔹 CTA */}
      <ScrollRevealSection>
        <section className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to experience Nexus?</h2>
          <p className="text-primary-600">
            Start chatting securely and instantly today.
          </p>

          <Link href="/auth?mode=signup" className="px-8 py-3 rounded-xl bg-primary-400/90 hover:bg-primary-300 text-white font-medium transition hover:cursor-pointer">
            Get Started
          </Link>
        </section>
      </ScrollRevealSection>
    </div>
    )
}