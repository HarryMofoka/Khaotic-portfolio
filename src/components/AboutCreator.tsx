/* ==========================================================================
 * AboutCreator Component — Phase 3C: "The Creator"
 * ==========================================================================
 * A personal about section for Harry Mofoka. Designed to feel like a
 * page torn from a notebook — raw, personal, and slightly chaotic.
 *
 * Structure:
 *   ┌──────────────────────────────────────┐
 *   │  Section Header ("The Creator")      │
 *   │  ┌────────────┐  ┌────────────────┐  │
 *   │  │  Portrait   │  │  Bio + Quote   │  │
 *   │  │  Placeholder│  │  + Philosophy  │  │
 *   │  └────────────┘  └────────────────┘  │
 *   │  Skills / Tools marquee              │
 *   └──────────────────────────────────────┘
 *
 * Animations:
 *   - Content fades in with GSAP ScrollTrigger
 *   - Portrait placeholder has a noise grain effect
 *   - Skills marquee scrolls infinitely via CSS
 * ========================================================================== */

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Skills / tools for the infinite marquee */
const SKILLS = [
    "React",
    "TypeScript",
    "GSAP",
    "Figma",
    "Three.js",
    "Blender",
    "After Effects",
    "Photography",
    "UI/UX",
    "Creative Direction",
    "Webflow",
    "Node.js",
];

/**
 * AboutCreator — Personal about section.
 */
const AboutCreator: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const els = sectionRef.current?.querySelectorAll(".about-reveal");
        if (!els || els.length === 0) return;

        gsap.set(els, { opacity: 0, y: 40 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
                end: "center center",
                scrub: 1.5,
            },
        });

        tl.to(els, {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 1,
            ease: "power3.out",
        });

        return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="about"
            className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-40"
        >
            {/* ---- Section Header ---- */}
            <div className="about-reveal mb-16 md:mb-24">
                <p className="font-sans text-xs uppercase tracking-[0.3em] text-[#FF3D00] mb-3">
                    About
                </p>
                <h2 className="font-display text-4xl md:text-6xl text-white leading-tight">
                    The Creator
                </h2>
            </div>

            {/* ---- Content Grid ---- */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16">
                {/* Left — Portrait placeholder */}
                <div className="about-reveal md:col-span-2">
                    <div
                        className="aspect-[3/4] w-full rounded-sm bg-white/[0.03] border border-white/5 relative overflow-hidden"
                        style={{ transform: "rotate(-2deg)" }}
                    >
                        {/* Noise grain placeholder overlay */}
                        <div className="absolute inset-0 opacity-20 noise-overlay" />

                        {/* Initials placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-display text-6xl md:text-8xl text-white/[0.06]">
                                HM
                            </span>
                        </div>

                        {/* Handwritten label */}
                        <span
                            className="absolute bottom-4 left-4 font-display text-xs text-white/20"
                            style={{ transform: "rotate(3deg)" }}
                        >
                            Harry Mofoka, 2024
                        </span>
                    </div>
                </div>

                {/* Right — Bio + Philosophy */}
                <div className="about-reveal md:col-span-3 flex flex-col justify-center">
                    <h3 className="font-display text-2xl md:text-3xl text-white mb-6">
                        Harry Mofoka
                    </h3>

                    <p className="font-sans text-sm md:text-base text-white/50 leading-relaxed mb-6">
                        I design in controlled disorder. Every project starts as
                        a thought — raw, unfiltered, sometimes chaotic — and I
                        paint the picture right there and then. No overthinking.
                        No second-guessing. Just pure creative instinct meeting
                        digital craft.
                    </p>

                    <p className="font-sans text-sm md:text-base text-white/50 leading-relaxed mb-8">
                        Khaotic isn't just a portfolio. It's a window into how I
                        think — where noise becomes signal, where disorder
                        reveals pattern, and where every pixel carries intention
                        even when it looks accidental.
                    </p>

                    {/* Pull quote */}
                    <blockquote className="border-l-2 border-[#FF3D00]/30 pl-6 mb-8">
                        <p className="font-display text-lg md:text-xl text-white/70 italic">
                            "The best ideas look like mistakes at first."
                        </p>
                    </blockquote>

                    {/* Contact CTA */}
                    <a
                        href="mailto:hello@harrymofoka.com"
                        className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-[#FF3D00] hover:text-white transition-colors duration-300 nav-link"
                    >
                        <span>Get in touch</span>
                        <span className="text-lg">→</span>
                    </a>
                </div>
            </div>

            {/* ---- Skills Marquee ---- */}
            <div className="about-reveal mt-20 md:mt-32 overflow-hidden border-t border-b border-white/5 py-6">
                <div className="skills-marquee flex whitespace-nowrap gap-8">
                    {/* Duplicate the list for seamless infinite scroll */}
                    {[...SKILLS, ...SKILLS].map((skill, i) => (
                        <span
                            key={`${skill}-${i}`}
                            className="font-sans text-xs uppercase tracking-[0.2em] text-white/15 flex-shrink-0"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutCreator;
