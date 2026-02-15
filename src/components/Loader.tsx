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
    const loaderRef = useRef<HTMLDivElement>(null);
    const countRef = useRef<HTMLSpanElement>(null);
    const statusRef = useRef<HTMLSpanElement>(null);
    const countContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loaderEl = loaderRef.current;
        const countEl = countRef.current;
        const countContainer = countContainerRef.current;

        if (!loaderEl || !countEl || !countContainer) return;

        const counter = { val: 0 };

        const tl = gsap.timeline({
            onComplete: () => {
                /* Exit Sequence: Glitch then slide */
                const exitTl = gsap.timeline({
                    onComplete: () => onComplete()
                });

                /* Glitch Jitter */
                exitTl.to(countContainer, {
                    x: () => (Math.random() - 0.5) * 20,
                    y: () => (Math.random() - 0.5) * 20,
                    skewX: () => (Math.random() - 0.5) * 10,
                    duration: 0.1,
                    repeat: 5,
                    ease: "none",
                });

                exitTl.to(loaderEl, {
                    yPercent: -100,
                    duration: 1.2,
                    ease: "power4.inOut",
                });
            },
        });

        tl.to(counter, {
            val: 100,
            duration: 2.2,
            ease: "power4.inOut",
            onUpdate: () => {
                const floorVal = Math.floor(counter.val);
                countEl.textContent = String(floorVal);

                /* Subtle scale up as it reaches 100 */
                if (countContainer) {
                    const scale = 1 + (counter.val / 100) * 0.1;
                    countContainer.style.transform = `scale(${scale}) rotate(-2deg)`;
                }
            },
        });

        /* Breathing status text */
        gsap.fromTo(statusRef.current, { opacity: 0.3 }, { opacity: 1, duration: 0.8, repeat: -1, yoyo: true });

        return () => {
            tl.kill();
        };
    }, [onComplete]);

    return (
        <div
            id="loader"
            ref={loaderRef}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white overflow-hidden"
        >
            <div className="noise-overlay opacity-30" />

            {/* ---- Animated Counter ---- */}
            <div
                ref={countContainerRef}
                className="relative z-10 flex items-start overflow-hidden leading-none -rotate-2 will-change-transform"
            >
                <span
                    ref={countRef}
                    className="font-display text-[15vw] md:text-[10vw] tracking-tighter tabular-nums block text-[#FF3D00]"
                >
                    0
                </span>
                <span className="font-display text-[5vw] md:text-[4vw] tracking-tighter mt-[3vw] text-[#FF3D00]">
                    %
                </span>
            </div>

            {/* ---- Bottom Status Bar ---- */}
            <div className="absolute bottom-12 left-0 w-full px-8 md:px-24 flex justify-between items-end text-[10px] font-sans font-medium uppercase tracking-[0.4em] text-white/30">
                <div className="flex flex-col gap-1">
                    <span>Authenticating Reality</span>
                    <span ref={statusRef}>Developing Khaos...</span>
                </div>
                <div>
                    <span>©2024 HM</span>
                </div>
            </div>
        </div>
    );
};

export default Loader;
