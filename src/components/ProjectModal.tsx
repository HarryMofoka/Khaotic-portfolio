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
     *
     * When `project` changes from null → object:
     *   1. Reset GSAP position to y: 100% (below viewport)
     *   2. Display the modal
     *   3. Animate y to 0%
     *   4. Stagger-animate title, subtitle, and content from below
     *   5. Reset inner scroll to top
     *
     * When `project` changes from object → null:
     *   The close is handled imperatively via `handleClose` below.
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

    /* -------------------------------------------------------------------------
     * Render
     *
     * The modal is always in the DOM (display: none when closed) so we can
     * animate it in/out smoothly without React mounting/unmounting delays.
     * ----------------------------------------------------------------------- */
    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-[100] w-full h-full bg-[#050505] translate-y-[100%] will-change-transform"
            style={{ display: "none" }}
        >
            {/* ---- Fixed Close Button ---- */}
            <div className="fixed top-0 left-0 w-full p-6 md:p-8 flex justify-between z-[110] pointer-events-none">
                <span className="text-white/50 font-display text-xl rotate-3 pointer-events-auto">
                    Project View
                </span>
                <button
                    onClick={handleClose}
                    className="group flex items-center gap-2 text-white/70 hover:text-[#FF3D00] transition-colors cursor-pointer pointer-events-auto bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
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
                className="absolute inset-0 w-full h-full overflow-y-auto overscroll-contain z-[105] bg-[#050505]"
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
                    {/* Gradient overlay fading to background colour at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />

                    {/* Title + Subtitle overlay on image */}
                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 pb-12">
                        <div className="overflow-hidden">
                            <h1
                                ref={titleRef}
                                className="font-display text-5xl md:text-8xl text-white transform -rotate-1 origin-bottom-left drop-shadow-2xl"
                            >
                                {project?.title}
                            </h1>
                        </div>
                        <div className="mt-4 flex gap-4 items-center">
                            <span
                                ref={subtitleRef}
                                className="px-3 py-1 border border-white/30 rounded-full text-xs font-sans uppercase tracking-widest text-white/80 backdrop-blur-sm"
                            >
                                {project?.subtitle}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ==== Content Grid ==== */}
                <div
                    ref={contentRef}
                    className="max-w-7xl mx-auto px-6 md:px-12 py-24 grid grid-cols-1 md:grid-cols-12 gap-16 text-white"
                >
                    {/* ---- Left Column (7/12): Story + Gallery Stubs ---- */}
                    <div className="md:col-span-7 flex flex-col gap-8">
                        <h3 className="font-display text-3xl text-[#FF3D00] -rotate-1">
                            The Story
                        </h3>
                        <p className="font-sans text-lg md:text-xl leading-relaxed text-gray-300 font-light">
                            {project?.description}
                        </p>

                        {/* Gallery grid placeholder */}
                        <div className="grid grid-cols-2 gap-4 mt-12 w-full">
                            <div className="aspect-[4/5] bg-[#111] rounded border border-white/10" />
                            <div className="aspect-[4/5] bg-[#111] rounded border border-white/10 mt-12" />
                        </div>
                    </div>

                    {/* ---- Right Column (5/12): Credits + Tech Specs ---- */}
                    <div className="md:col-span-5 flex flex-col gap-8 sticky top-24 h-fit">
                        <h3 className="font-display text-3xl text-white rotate-1">
                            Credits
                        </h3>

                        {/* Credits list — each entry is a row with role on the left, name on the right */}
                        <div className="flex flex-col border-t border-white/10">
                            {project?.credits.map((credit, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center py-4 border-b border-white/10 group hover:bg-white/5 transition-colors px-2"
                                >
                                    <span className="text-secondary text-xs uppercase tracking-widest font-sans">
                                        {credit.role}
                                    </span>
                                    <span className="text-white font-display text-lg tracking-wide">
                                        {credit.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Tech Specs panel */}
                        <div className="mt-12 p-6 border border-white/10 rounded-lg bg-[#0a0a0a]">
                            <span className="font-display text-xl block mb-2 text-[#FF3D00]">
                                Tech Specs
                            </span>
                            <ul className="font-sans text-sm text-gray-400 space-y-2 font-mono">
                                <li>Camera: Sony Venice 2</li>
                                <li>Lens: Cookie S4/i</li>
                                <li>Grade: DaVinci Resolve</li>
                                <li>Output: 4K DCP</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ==== "Next Project" CTA ==== */}
                <div className="w-full py-32 flex justify-center border-t border-white/10 mt-12 bg-[#050505]">
                    <button onClick={handleClose} className="group relative">
                        <span className="font-display text-4xl md:text-6xl text-white group-hover:text-[#FF3D00] transition-colors">
                            Next Project
                        </span>
                        <div className="h-1 w-0 bg-[#FF3D00] group-hover:w-full transition-all duration-300 mt-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
