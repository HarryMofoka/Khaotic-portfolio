/* ==========================================================================
 * ProjectCard Component
 * ==========================================================================
 * A film-still / Polaroid-style card for displaying a single portfolio
 * project in the main scrollable feed.
 *
 * Visual Design:
 *   • A dark card with a subtle border and heavy shadow (`.film-card` class)
 *   • The image has a partial grayscale and high contrast that clears on
 *     hover, plus a subtle scale-up — mimicking the experience of focusing
 *     on a print under a loupe.
 *   • The title is overlaid on the bottom-left of the image in the "Rock
 *     Salt" handwritten font with `mix-blend-mode: difference`.
 *   • Each card is slightly rotated (via the `rotation` prop) and snaps
 *     to 0° on hover for a tactile "picking up a photo" feel.
 *
 * Props:
 *   @prop project — The full `Project` data object.
 *   @prop index   — 0-based index used for the two-digit project number.
 *   @prop onClick — Callback fired when the card is clicked (opens modal).
 *
 * GSAP Note:
 *   The entrance animation (fly-in from below with rotation) is applied
 *   by the parent via a class selector on `.project-wrapper`.
 * ========================================================================== */

import React, { useCallback } from "react";
import { Icon } from "@iconify/react";
import type { Project } from "../types";

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
     * handleClick — Prevent default anchor behaviour and delegate to parent.
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

    /** Two-digit display number (01, 02, 03, …) */
    const displayNumber = String(index + 1).padStart(2, "0");

    /** Counter-rotation on the title to keep it slightly off-axis even when
     *  the card itself is rotated — adds to the handwritten aesthetic. */
    const titleRotation = project.rotation;

    return (
        <div
            className="project-wrapper group relative w-full flex flex-col items-center mb-[15vh]"
            onClick={handleClick}
        >
            <div
                className="relative w-[85vw] md:w-[60vw] p-4 bg-[#0a0a0a] film-card rounded-sm hover:rotate-0 transition-transform duration-500 ease-out cursor-pointer nav-link"
                style={{ transform: `rotate(${project.rotation})` }}
            >
                {/* ---- Image Container ---- */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#111] mb-4 border border-white/5">
                    {/* Dark overlay that clears on hover */}
                    <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition-colors duration-500" />

                    {/* Project image — grayscale + contrast, clears + scales on hover */}
                    <img
                        src={project.cardImage}
                        alt={project.title}
                        className="w-full h-full object-cover grayscale-[30%] contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    />

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
                        <span className="font-sans text-xs uppercase tracking-[0.2em] text-gray-400">
                            {project.category}
                        </span>
                        <span className="font-sans text-[10px] text-gray-500">
                            {project.techDetails}
                        </span>
                    </div>

                    {/* Right: project number + arrow icon */}
                    <div className="flex items-center gap-2">
                        <span className="font-display text-xl text-[#FF3D00]">
                            {displayNumber}
                        </span>
                        <Icon
                            icon="lucide:arrow-up-right"
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
