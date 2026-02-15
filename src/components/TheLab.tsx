/* ==========================================================================
 * TheLab Component — Phase 3A: "The Lab" Experiments Section
 * ==========================================================================
 * A section showcasing experimental / side projects in a freeform,
 * chaotic grid layout. Each experiment is a small card with a title,
 * a description stub, and a "status" badge (WIP, LIVE, ARCHIVED).
 *
 * The layout uses CSS grid with intentional overlap and varied sizes,
 * reinforcing the "controlled chaos" brand. Cards animate in with
 * GSAP ScrollTrigger stagger.
 *
 * Data is kept inline since experiments are lightweight and few.
 * ========================================================================== */

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ---- Experiment data ---- */
interface Experiment {
    title: string;
    description: string;
    status: "WIP" | "LIVE" | "ARCHIVED";
    tags: string[];
}

const EXPERIMENTS: Experiment[] = [
    {
        title: "Noise Typography",
        description:
            "Rendering text through generative noise fields. Each glyph is a living, breathing particle system.",
        status: "WIP",
        tags: ["canvas", "typography", "generative"],
    },
    {
        title: "Colour Mood Engine",
        description:
            "An adaptive palette system that shifts based on time of day, cursor speed, and scroll depth.",
        status: "LIVE",
        tags: ["CSS", "theming", "adaptive"],
    },
    {
        title: "Glitch Portraits",
        description:
            "Pixel-sorted portraits with WebGL displacement. Hover to destroy, release to rebuild.",
        status: "WIP",
        tags: ["WebGL", "GLSL", "interactive"],
    },
    {
        title: "Ink Physics",
        description:
            "Simulating ink spreading on parchment using cellular automata. Organic, unrepeatable patterns.",
        status: "ARCHIVED",
        tags: ["simulation", "canvas", "procedural"],
    },
    {
        title: "Audio Geometry",
        description:
            "Translating audio frequencies into 3D mesh deformations. Sound you can see and feel.",
        status: "WIP",
        tags: ["Web Audio", "three.js", "realtime"],
    },
];

/** Status badge colour mapping */
const STATUS_COLOURS: Record<Experiment["status"], string> = {
    WIP: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    LIVE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    ARCHIVED: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

/**
 * TheLab — Freeform experiments showcase section.
 */
const TheLab: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const cards = sectionRef.current?.querySelectorAll(".lab-card");
        if (!cards || cards.length === 0) return;

        gsap.set(cards, { opacity: 0, y: 60, scale: 0.95 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                end: "center center",
                scrub: 1,
            },
        });

        tl.to(cards, {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
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
            id="the-lab"
            className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-40"
        >
            {/* ---- Section Header ---- */}
            <div className="mb-16 md:mb-24">
                <p className="font-sans text-xs uppercase tracking-[0.3em] text-[#FF3D00] mb-3">
                    Experiments
                </p>
                <h2 className="font-display text-4xl md:text-6xl text-white leading-tight">
                    The Lab
                </h2>
                <p className="mt-4 font-sans text-sm md:text-base text-white/40 max-w-md">
                    Unfinished thoughts. Broken prototypes. Ideas that might
                    become something, or might stay beautifully incomplete.
                </p>
            </div>

            {/* ---- Experiment Cards Grid ---- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {EXPERIMENTS.map((exp, i) => (
                    <div
                        key={exp.title}
                        className={`lab-card group relative p-6 rounded-sm border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] transition-all duration-500 cursor-pointer ${i === 0
                            ? "sm:col-span-2 lg:col-span-2"
                            : ""
                            }`}
                        style={{
                            /* Use a stable random seed based on index to prevent shifts on re-render */
                            transform: `rotate(${((i * 123) % 4) - 2}deg)`,
                        }}
                    >
                        {/* Status badge */}
                        <span
                            className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full border mb-4 ${STATUS_COLOURS[exp.status]}`}
                        >
                            {exp.status}
                        </span>

                        {/* Title */}
                        <h3 className="font-display text-xl md:text-2xl text-white mb-2 group-hover:text-[#FF3D00] transition-colors duration-300">
                            {exp.title}
                        </h3>

                        {/* Description */}
                        <p className="font-sans text-xs md:text-sm text-white/40 leading-relaxed mb-4">
                            {exp.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {exp.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="font-mono text-[10px] text-white/20 border border-white/5 px-2 py-0.5 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Hover line accent */}
                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#FF3D00] group-hover:w-full transition-all duration-500" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TheLab;
