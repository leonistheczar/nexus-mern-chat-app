"use client";
import Features from "./Features";
import { HeroLeft } from "./HeroLeft";
import HeroRight from "./HeroRight";

export default function HomeClient () {
    return(
        <>
        {/* Hero  */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 items-center py-4 justify-between">
        <HeroLeft />
        <HeroRight />
        </section>
        {/* Features */}
        <section className="w-full py-12 px-6 bg-primary-200/10 rounded-lg shadow-lg">
          <Features />
        </section>
        </>
    )
}