/* ==========================================================================
 * Loader Component
 * ==========================================================================
 * Full-screen loading overlay displayed on initial page load.
 *
 * Features:
 *   • Animated counter — Uses GSAP to tween a number from 0 → 100 with
 *     an ease-in-out curve. The counter is displayed in the "Rock Salt"
 *     handwritten font with a slight rotation for brand personality.
 *   • Breathing status text — A secondary text label ("Loading Assets" /
 *     "Developing...") pulses (opacity yoyo) to indicate activity.
 *   • Exit animation — Once the counter reaches 100, the loader slides
 *     upward off-screen and fires the `onComplete` callback so the parent
 *     can start the intro sequence and enable scrolling.
 *
 * Props:
 *   @prop onComplete — Callback fired after the loader has fully animated
 *                      off-screen. The parent uses this to start Lenis
 *                      scrolling and trigger GSAP intro animations.
 *
 * CSS Dependencies:
 *   `#loader` clip-path and `.noise-overlay` in `index.css`.
 * ========================================================================== */

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface LoaderProps {
    /** Called when the loader has finished animating and is off-screen */
    onComplete: () => void;
}

/**
 * Loader — Full-screen branded loading overlay with animated counter.
 */
const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
    /* -------------------------------------------------------------------------
     * Refs — Direct DOM references for imperative GSAP animation
     * ----------------------------------------------------------------------- */
    const loaderRef = useRef<HTMLDivElement>(null);
    const countRef = useRef<HTMLSpanElement>(null);
    const statusRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        /* Store the DOM nodes locally so they're available in the cleanup */
        const loaderEl = loaderRef.current;
        const countEl = countRef.current;

        if (!loaderEl || !countEl) return;

        /* -------------------------------------------------------------------
         * Counter Object — GSAP tweens a plain JS object; on each update we
         * read the current value and set the DOM textContent manually.
         * This avoids React state updates (and thus re-renders) during the
         * fast 60fps tween.
         * ----------------------------------------------------------------- */
        const counter = { val: 0 };

        /* -------------------------------------------------------------------
         * Main Timeline
         *   1. Tween counter 0 → 100 over 2 seconds
         *   2. When counter > 50, change status text to "Developing..."
         *   3. On timeline complete → slide the loader upward and fire callback
         * ----------------------------------------------------------------- */
        const tl = gsap.timeline({
            onComplete: () => {
                /* Slide the loader up and off-screen */
                gsap.to(loaderEl, {
                    yPercent: -100,
                    duration: 1.2,
                    ease: "power4.inOut",
                    onComplete: () => {
                        onComplete();
                    },
                });
            },
        });

        tl.to(counter, {
            val: 100,
            duration: 2.0,
            ease: "power2.inOut",
            onUpdate: () => {
                countEl.textContent = String(Math.floor(counter.val));
            },
        });

        /* Breathing / pulsing opacity on the status text */
        gsap.fromTo(
            statusRef.current,
            { opacity: 0.5 },
            { opacity: 1, duration: 0.5, repeat: -1, yoyo: true }
        );

        /* Cleanup — kill all tweens targeting these elements on unmount */
        return () => {
            tl.kill();
            gsap.killTweensOf(loaderEl);
        };
    }, [onComplete]);

    /* -------------------------------------------------------------------------
     * Render
     * ----------------------------------------------------------------------- */
    return (
        <div
            id="loader"
            ref={loaderRef}
            className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center text-white"
        >
            {/* Noise grain texture for the loader background */}
            <div className="noise-overlay opacity-20" />

            {/* ---- Animated Counter ---- */}
            <div className="relative z-10 flex items-start overflow-hidden leading-none -rotate-2">
                <span
                    ref={countRef}
                    className="font-display text-[12vw] md:text-[8vw] tracking-tighter tabular-nums block text-[#FF3D00]"
                >
                    0
                </span>
                <span className="font-display text-[4vw] md:text-[3vw] tracking-tighter mt-[2vw] text-[#FF3D00]">
                    %
                </span>
            </div>

            {/* ---- Bottom Status Bar ---- */}
            <div className="absolute bottom-12 left-0 w-full px-8 flex justify-between items-end text-xs font-sans font-medium uppercase tracking-widest text-white/50">
                <div className="flex flex-col gap-1">
                    <span>Loading Assets</span>
                    <span ref={statusRef}>Developing...</span>
                </div>
                <div>
                    <span>Khaotic ©2024</span>
                </div>
            </div>
        </div>
    );
};

export default Loader;
