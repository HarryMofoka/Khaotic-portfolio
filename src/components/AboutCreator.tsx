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

import portraitImg from "../assets/harry_portrait.jpg";

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
                <p className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-3">
                    About
                </p>
                <h2 className="font-display text-4xl md:text-6xl text-[var(--color-text)] leading-tight">
                    The Creator
                </h2>
            </div>

            {/* ---- Content Grid ---- */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16">
                {/* Left — Portrait */}
                <div className="about-reveal md:col-span-2">
                    <div
                        className="aspect-[3/4] w-full rounded-sm bg-black border border-white/5 relative overflow-hidden"
                        style={{ transform: "rotate(-2deg)" }}
                    >
                        {/* Portrait Image */}
                        <img
                            src={portraitImg}
                            alt="Harry Mofoka"
                            className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 opacity-70"
                        />

                        {/* Noise grain overlay */}
                        <div className="absolute inset-0 opacity-20 noise-overlay pointer-events-none" />

                        {/* Name hint (only shows if image fails) */}
                        <span className="sr-only">Harry Mofoka</span>

                        {/* Handwritten label */}
                        <span
                            className="absolute bottom-4 left-4 font-display text-xs text-white/40 bg-black/40 px-2 py-1 backdrop-blur-sm"
                            style={{ transform: "rotate(3deg)" }}
                        >
                            Harry Mofoka, 2024
                        </span>
                    </div>
                </div>

                {/* Right — Bio + Philosophy */}
                <div className="about-reveal md:col-span-3 flex flex-col justify-center">
                    <h3 className="font-display text-2xl md:text-3xl text-[var(--color-text)] mb-2">
                        Harry Mofoka
                    </h3>
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)] mb-6">
                        De Deur, South Africa
                    </p>

                    <p className="font-sans text-sm md:text-base text-[var(--color-text-dim)] leading-relaxed mb-6">
                        I design in controlled disorder. Every project starts as
                        a thought — raw, unfiltered, sometimes chaotic — and I
                        paint the picture right there and then. No overthinking.
                        No second-guessing. Just pure creative instinct meeting
                        digital craft.
                    </p>

                    <p className="font-sans text-sm md:text-base text-[var(--color-text-dim)] leading-relaxed mb-8">
                        Khaotic isn't just a portfolio. It's a window into how I
                        think — where noise becomes signal, where disorder
                        reveals pattern, and where every pixel carries intention
                        even when it looks accidental.
                    </p>

                    {/* Pull quote */}
                    <blockquote className="border-l-2 border-[var(--color-accent)]/30 pl-6 mb-8">
                        <p className="font-display text-lg md:text-xl text-[var(--color-text-dim)] italic">
                            "The best ideas look like mistakes at first."
                        </p>
                    </blockquote>

                    {/* Contact CTA */}
                    <div className="flex flex-wrap items-center gap-6 mt-4">
                        <a
                            href="mailto:hello@harrymofoka.com"
                            className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] hover:text-[var(--color-text)] transition-colors duration-300 nav-link"
                        >
                            <span>Get in touch</span>
                            <span className="text-lg">→</span>
                        </a>

                        <a
                            href="https://www.instagram.com/kalm.harry/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-dim)] hover:text-[var(--color-accent)] transition-colors"
                        >
                            Instagram
                        </a>

                        <a
                            href="https://www.linkedin.com/in/harry-mofoka"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-dim)] hover:text-[var(--color-accent)] transition-colors"
                        >
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>

            {/* ---- Skills Marquee ---- */}
            <div className="about-reveal mt-20 md:mt-32 overflow-hidden border-t border-b border-[var(--color-border)] py-6">
                <div className="skills-marquee flex whitespace-nowrap gap-8">
                    {/* Duplicate the list for seamless infinite scroll */}
                    {[...SKILLS, ...SKILLS].map((skill, i) => (
                        <span
                            key={`${skill}-${i}`}
                            className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--color-text-dim)]/30 flex-shrink-0"
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
