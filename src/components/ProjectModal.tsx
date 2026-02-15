/* ==========================================================================
 * ProjectModal Component
 * ==========================================================================
 * A fullscreen scrollable modal that displays detailed information about
 * a selected portfolio project.
 *
 * Layout:
 *   ┌────────────────────────────────────────┐
 *   │  Hero Image (80vh)                      │
 *   │    └─ Title + Subtitle overlay          │
 *   ├────────────────────────────────────────┤
 *   │  Content Grid (7 col + 5 col)           │
 *   │    ├─ Left: "The Story" + Description   │
 *   │    │         + Gallery stubs            │
 *   │    └─ Right: "Credits" + Tech Specs     │
 *   ├────────────────────────────────────────┤
 *   │  "Next Project" CTA                     │
 *   └────────────────────────────────────────┘
 *
 * Features:
 *   • GSAP slide-up entrance (y: 100% → 0%)
 *   • GSAP slide-down exit (y: 0% → 100%)
 *   • Content stagger animation (title, subtitle, body fade in)
 *   • Internal scroll resets to top on open
 *   • Close button (fixed, top-right) with glassmorphism background
 *
 * Props:
 *   @prop project — The `Project` data to display, or `null` if closed.
 *   @prop onClose — Callback to close the modal.
 *
 * CSS Dependencies:
 *   No custom classes beyond Tailwind utilities.
 * ========================================================================== */

import React, { useEffect, useRef, useCallback } from "react";
import { Icon } from "@iconify/react";
import gsap from "gsap";
import type { Project } from "../types";

interface ProjectModalProps {
    /** The project data to display, or null when modal is closed */
    project: Project | null;
    /** Callback fired to close the modal */
    onClose: () => void;
}

/**
 * ProjectModal — Fullscreen scrollable detail view for a portfolio project.
 */
const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
    /* -------------------------------------------------------------------------
     * Refs
     * ----------------------------------------------------------------------- */

    /** The outermost modal container (animated via GSAP translate) */
    const modalRef = useRef<HTMLDivElement>(null);

    /** The scrollable inner container (scroll position resets on open) */
    const scrollRef = useRef<HTMLDivElement>(null);

    /** The title element (animated on content stagger) */
    const titleRef = useRef<HTMLHeadingElement>(null);

    /** The subtitle badge (animated on content stagger) */
    const subtitleRef = useRef<HTMLSpanElement>(null);

    /** The content grid container (animated on content stagger) */
    const contentRef = useRef<HTMLDivElement>(null);

    /* -------------------------------------------------------------------------
     * Open / Close Animation
     * ----------------------------------------------------------------------- */
    useEffect(() => {
        const modal = modalRef.current;
        if (!modal) return;

        if (project) {
            /* ---- OPEN ---- */
            gsap.set(modal, { y: "100%" });
            modal.style.display = "block";

            /* Slide up from below */
            gsap.to(modal, { y: "0%", duration: 0.8, ease: "power3.inOut" });

            /* Stagger content fade-in */
            gsap.fromTo(
                [titleRef.current, subtitleRef.current, contentRef.current],
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: 0.4,
                    stagger: 0.1,
                    ease: "power3.out",
                }
            );

            /* Reset scroll position to top */
            if (scrollRef.current) scrollRef.current.scrollTop = 0;
        }
    }, [project]);

    /* -------------------------------------------------------------------------
     * handleClose — Animate the modal down and then hide it.
     * ----------------------------------------------------------------------- */
    const handleClose = useCallback(() => {
        const modal = modalRef.current;
        if (!modal) return;

        gsap.to(modal, {
            y: "100%",
            duration: 0.7,
            ease: "power3.inOut",
            onComplete: () => {
                modal.style.display = "none";
                onClose();
            },
        });
    }, [onClose]);

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-[100] w-full h-full bg-[var(--color-bg)] translate-y-[100%] will-change-transform transition-colors duration-500"
            style={{ display: "none" }}
        >
            {/* ---- Fixed Close Button ---- */}
            <div className="fixed top-0 left-0 w-full p-6 md:p-8 flex justify-between z-[110] pointer-events-none">
                <span className="text-[var(--color-text-dim)] font-display text-xl rotate-3 pointer-events-auto">
                    Project View
                </span>
                <button
                    onClick={handleClose}
                    className="group flex items-center gap-2 text-[var(--color-text-dim)] hover:text-[var(--color-accent)] transition-colors cursor-pointer pointer-events-auto bg-[var(--color-surface)]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--color-border)]"
                >
                    <span className="uppercase tracking-widest text-xs font-sans font-semibold">
                        Close
                    </span>
                    <Icon
                        icon="lucide:x"
                        width={16}
                        className="group-hover:rotate-90 transition-transform duration-300"
                    />
                </button>
            </div>

            {/* ---- Scrollable Content Container ---- */}
            <div
                ref={scrollRef}
                className="absolute inset-0 w-full h-full overflow-y-auto overscroll-contain z-[105] bg-[var(--color-bg)]"
            >
                {/* ==== Hero Image (80vh) ==== */}
                <div className="w-full h-[80vh] relative">
                    {project?.modalImage && (
                        <img
                            src={project.modalImage}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent opacity-95" />

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 pb-12">
                        <div className="overflow-hidden">
                            <h1
                                ref={titleRef}
                                className="font-display text-5xl md:text-8xl text-[var(--color-text)] transform -rotate-1 origin-bottom-left drop-shadow-2xl"
                            >
                                {project?.title}
                            </h1>
                        </div>
                        <div className="mt-4 flex gap-4 items-center">
                            <span
                                ref={subtitleRef}
                                className="px-3 py-1 border border-[var(--color-border)] rounded-full text-xs font-sans uppercase tracking-widest text-[var(--color-text-dim)] backdrop-blur-sm"
                            >
                                {project?.subtitle}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ==== Content Grid ==== */}
                <div
                    ref={contentRef}
                    className="max-w-7xl mx-auto px-6 md:px-12 py-24 grid grid-cols-1 md:grid-cols-12 gap-16 text-[var(--color-text)]"
                >
                    <div className="md:col-span-7 flex flex-col gap-8">
                        <h3 className="font-display text-3xl text-[var(--color-accent)] -rotate-1">
                            The Story
                        </h3>
                        <p className="font-sans text-lg md:text-xl leading-relaxed text-[var(--color-text-dim)] font-light whitespace-pre-wrap">
                            {project?.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-12 w-full">
                            <div className="aspect-[4/5] bg-[var(--color-surface)] rounded border border-[var(--color-border)]" />
                            <div className="aspect-[4/5] bg-[var(--color-surface)] rounded border border-[var(--color-border)] mt-12" />
                        </div>
                    </div>

                    <div className="md:col-span-5 flex flex-col gap-8 sticky top-24 h-fit">
                        <h3 className="font-display text-3xl text-[var(--color-text)] rotate-1">
                            Credits
                        </h3>

                        <div className="flex flex-col border-t border-[var(--color-border)]">
                            {project?.credits.map((credit, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center py-4 border-b border-[var(--color-border)] group hover:bg-[var(--color-surface)] transition-colors px-2"
                                >
                                    <span className="text-[var(--color-text-dim)] text-xs uppercase tracking-widest font-sans">
                                        {credit.role}
                                    </span>
                                    <span className="text-[var(--color-text)] font-display text-lg tracking-wide">
                                        {credit.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]">
                            <span className="font-display text-xl block mb-2 text-[var(--color-accent)]">
                                Tech Specs
                            </span>
                            <ul className="font-sans text-sm text-[var(--color-text-dim)] space-y-2 font-mono">
                                <li>Origin: De Deur, SA</li>
                                <li>Status: Always Chaotic</li>
                                <li>Frequency: High Speed</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ==== "Next Project" CTA ==== */}
                <div className="w-full py-32 flex justify-center border-t border-[var(--color-border)] mt-12 bg-[var(--color-bg)]">
                    <button onClick={handleClose} className="group relative">
                        <span className="font-display text-4xl md:text-6xl text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                            Next Story
                        </span>
                        <div className="h-1 w-0 bg-[var(--color-accent)] group-hover:w-full transition-all duration-300 mt-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
