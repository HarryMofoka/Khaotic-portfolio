/* ==========================================================================
 * ProjectCard Component — Phase 2: "Projects That Breathe"
 * ==========================================================================
 * A film-still / Polaroid-style card for displaying a single portfolio
 * project in the main scrollable feed.
 *
 * Phase 2 Features:
 *   2A · Video Thumbnails on Hover
 *        When a project has a `hoverVideo` URL, a muted <video> element
 *        loads lazily behind the image. On hover, the video fades in and
 *        auto-plays, creating a "living thumbnail" effect. On leave, it
 *        pauses and fades back to the still image.
 *
 *   2B · Parallax Depth on Scroll
 *        Each card is wrapped in a GSAP ScrollTrigger that shifts the card
 *        vertically based on scroll position — odd cards move slightly up,
 *        even cards slightly down — creating a subtle depth/stagger feel.
 *
 *   2C · Randomised Micro-Rotations
 *        Instead of a fixed `rotation` string, each card gets a slight
 *        random rotation on mount (±3°) using useMemo. Hover still snaps
 *        the card to 0° for the tactile "picking up a photo" feel.
 *
 * Props:
 *   @prop project — The full `Project` data object.
 *   @prop index   — 0-based index used for two-digit number + parallax direction.
 *   @prop onClick — Callback fired when the card is clicked (opens modal).
 * ========================================================================== */

import React, { useCallback, useRef, useEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon } from "@iconify/react";
import type { Project } from "../types";

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
    /** The project data object */
    project: Project;
    /** 0-based index for display number (01, 02, 03, …) */
    index: number;
    /** Callback fired when the card is clicked */
    onClick: () => void;
}

/**
 * ProjectCard — A single portfolio project displayed as a film-still card.
 */
const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    index,
    onClick,
}) => {
    /* -------------------------------------------------------------------------
     * Refs
     * ----------------------------------------------------------------------- */

    /** The outer wrapper — target for GSAP ScrollTrigger parallax */
    const wrapperRef = useRef<HTMLDivElement>(null);

    /** The hover video element — controlled via play/pause */
    const videoRef = useRef<HTMLVideoElement>(null);

    /* -------------------------------------------------------------------------
     * State
     * ----------------------------------------------------------------------- */

    /** Whether the card is being hovered — drives video play/fade */
    const [isHovered, setIsHovered] = useState(false);

    /* -------------------------------------------------------------------------
     * Phase 2C — Randomised Micro-Rotation
     *
     * Computed once per mount. Each card gets a slight random tilt between
     * -3° and +3° (or uses the project.rotation if present). This creates
     * a natural "scattered photos on a desk" feel.
     * ----------------------------------------------------------------------- */
    const microRotation = useMemo(() => {
        const base = parseFloat(project.rotation) || 0;
        const jitter = (Math.random() - 0.5) * 2; // ±1° random offset
        return base + jitter;
    }, [project.rotation]);

    /* -------------------------------------------------------------------------
     * Phase 2B — Parallax Depth on Scroll
     *
     * Each card shifts vertically as the user scrolls past it. Odd-indexed
     * cards move upward (negative y), even-indexed cards move downward,
     * creating a staggered depth effect that makes the feed feel alive.
     * ----------------------------------------------------------------------- */
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;

        /* Parallax direction alternates — odd cards float up, even float down */
        const direction = index % 2 === 0 ? 1 : -1;
        const distance = 40 + Math.random() * 20; // 40–60px range

        const tween = gsap.to(el, {
            y: direction * distance,
            ease: "none",
            scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });

        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
        };
    }, [index]);

    /* -------------------------------------------------------------------------
     * Phase 2A — Video Hover Handlers
     * ----------------------------------------------------------------------- */
    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {
                /* Autoplay might be blocked — fail silently */
            });
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
        }
    }, []);

    /* -------------------------------------------------------------------------
     * handleClick — Prevent default and delegate to parent.
     * ----------------------------------------------------------------------- */
    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            onClick();
        },
        [onClick]
    );

    /* -------------------------------------------------------------------------
     * Derived values
     * ----------------------------------------------------------------------- */
    const displayNumber = String(index + 1).padStart(2, "0");
    const titleRotation = project.rotation;
    const hasVideo = Boolean(project.hoverVideo);

    /* -------------------------------------------------------------------------
     * Render
     * ----------------------------------------------------------------------- */
    return (
        <div
            ref={wrapperRef}
            className="project-wrapper group relative w-full flex flex-col items-center mb-[15vh]"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="relative w-[85vw] md:w-[60vw] p-4 bg-[var(--color-surface)] film-card rounded-sm hover:rotate-0 transition-transform duration-500 ease-out cursor-pointer nav-link"
                style={{ transform: `rotate(${microRotation}deg)` }}
            >
                {/* ---- Image / Video Container ---- */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-[var(--color-bg)] mb-4 border border-[var(--color-border)]">
                    {/* Dark overlay that clears on hover */}
                    <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition-colors duration-500" />

                    {/* Still image — always present as fallback */}
                    <img
                        src={project.cardImage}
                        alt={project.title}
                        className={`w-full h-full object-cover grayscale-[30%] contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out ${hasVideo && isHovered ? "opacity-0" : "opacity-100"
                            }`}
                    />

                    {/* Phase 2A — Hover video (only rendered if project has one) */}
                    {hasVideo && (
                        <video
                            ref={videoRef}
                            src={project.hoverVideo}
                            muted
                            loop
                            playsInline
                            preload="none"
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-0"
                                }`}
                        />
                    )}

                    {/* Handwritten title overlay with mix-blend-mode: difference */}
                    <div className="absolute bottom-4 left-6 z-20 pointer-events-none mix-blend-difference">
                        <h2
                            className="font-display text-3xl md:text-5xl text-white group-hover:scale-110 transition-transform duration-300 origin-bottom-left"
                            style={{ transform: `rotate(${titleRotation})` }}
                        >
                            {project.title}
                        </h2>
                    </div>
                </div>

                {/* ---- Clean Meta Data Row ---- */}
                <div className="flex justify-between items-end px-2 pb-1">
                    {/* Left: category + tech details */}
                    <div className="flex flex-col gap-1">
                        <span className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                            {project.category}
                        </span>
                        <span className="font-sans text-[10px] text-[var(--color-text-dim)]/70">
                            {project.techDetails}
                        </span>
                    </div>

                    {/* Right: project number + arrow icon */}
                    <div className="flex items-center gap-2">
                        <span className="font-display text-xl text-[var(--color-accent)]">
                            {displayNumber}
                        </span>
                        <Icon
                            icon="lucide:arrow-up-right"
                            className="text-[var(--color-text)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
