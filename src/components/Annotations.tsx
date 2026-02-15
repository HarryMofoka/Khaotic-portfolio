/* ==========================================================================
 * Annotations Component — Phase 3B: Handwritten Annotations
 * ==========================================================================
 * Decorative handwritten notes scattered around the page content.
 * These reinforce the "khaotic" brand by adding a personal, messy,
 * sketchbook-like layer over the clean digital design.
 *
 * Each annotation is absolutely positioned within its parent, using
 * the handwritten font (Rock Salt). They fade in on scroll via
 * GSAP ScrollTrigger.
 *
 * Usage:
 *   Wrap a section with <Annotations> to sprinkle notes around it.
 *   The annotations are non-interactive (pointer-events: none).
 * ========================================================================== */

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ---- Annotation data ---- */
interface Annotation {
    text: string;
    /** CSS positioning — top, bottom, left, right */
    position: React.CSSProperties;
    /** Rotation in degrees */
    rotation: number;
    /** Optional size class override */
    sizeClass?: string;
}

const ANNOTATIONS: Annotation[] = [
    {
        text: "this one hit different →",
        position: { top: "8%", right: "3%" },
        rotation: -5,
        sizeClass: "text-[10px] md:text-xs",
    },
    {
        text: "break everything.",
        position: { top: "35%", left: "2%" },
        rotation: 12,
        sizeClass: "text-xs md:text-sm",
    },
    {
        text: "⚡ yes",
        position: { top: "55%", right: "5%" },
        rotation: -8,
    },
    {
        text: "chaos is a feature,\nnot a bug",
        position: { top: "72%", left: "4%" },
        rotation: 3,
        sizeClass: "text-[10px] md:text-xs",
    },
    {
        text: "// TODO: sleep",
        position: { top: "90%", right: "8%" },
        rotation: -2,
        sizeClass: "text-[10px]",
    },
];

/**
 * Annotations — Scattered handwritten notes that appear on scroll.
 */
const Annotations: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const notes = containerRef.current?.querySelectorAll(".annotation");
        if (!notes || notes.length === 0) return;

        gsap.set(notes, { opacity: 0, scale: 0.8 });

        notes.forEach((note) => {
            gsap.to(note, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: note,
                    start: "top 90%",
                    toggleActions: "play none none reverse",
                },
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach((st) => {
                if (
                    notes &&
                    Array.from(notes).some((n) => st.trigger === n)
                ) {
                    st.kill();
                }
            });
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 pointer-events-none z-30 overflow-hidden hidden md:block"
            aria-hidden="true"
        >
            {ANNOTATIONS.map((note, i) => (
                <span
                    key={i}
                    className={`annotation absolute font-display text-white/[0.07] whitespace-pre-line select-none ${note.sizeClass || "text-xs"
                        }`}
                    style={{
                        ...note.position,
                        transform: `rotate(${note.rotation}deg)`,
                    }}
                >
                    {note.text}
                </span>
            ))}
        </div>
    );
};

export default Annotations;
