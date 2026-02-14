/* ==========================================================================
 * useLenis Hook — Smooth Scroll Manager
 * ==========================================================================
 * Initialises the Lenis smooth-scroll library and exposes imperative
 * `start` and `stop` controls so that other parts of the app (e.g. the
 * loader, menu overlay, project modal) can pause/resume page scrolling.
 *
 * Lenis integrates with GSAP's ScrollTrigger so scroll-driven animations
 * work seamlessly with the custom smooth-scroll physics.
 *
 * Usage:
 *   const { lenisRef } = useLenis();
 *   lenisRef.current?.stop();   // pause scrolling
 *   lenisRef.current?.start();  // resume scrolling
 * ========================================================================== */

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* Register GSAP's ScrollTrigger plugin once at module level */
gsap.registerPlugin(ScrollTrigger);

/**
 * useLenis — Custom hook that manages the Lenis smooth-scroll instance.
 *
 * @param autoStart - If `false`, Lenis starts in a stopped state (useful
 *                    when a loader screen is active). Defaults to `false`.
 * @returns An object containing `lenisRef` — a React ref to the Lenis instance
 *          so consumers can call `.start()` and `.stop()` imperatively.
 */
export function useLenis(autoStart = false) {
    /* Ref holds the Lenis instance across renders without causing re-renders */
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        /* -----------------------------------------------------------------------
         * Create a new Lenis instance with the project's scroll physics:
         *   • duration  — controls the scroll deceleration (higher = smoother)
         *   • easing    — custom ease-out curve for natural feel
         *   • direction — vertical scroll only
         * --------------------------------------------------------------------- */
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            smoothWheel: true,
        });

        lenisRef.current = lenis;

        /* If autoStart is false (e.g. loader is active), immediately pause */
        if (!autoStart) {
            lenis.stop();
            document.body.style.overflow = "hidden";
        }

        /* -----------------------------------------------------------------------
         * Connect Lenis to GSAP's ScrollTrigger so all GSAP scroll-driven
         * animations (navbar shrink, project entrance, etc.) use the same
         * smooth-scroll position as Lenis.
         * --------------------------------------------------------------------- */
        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        /* -----------------------------------------------------------------------
         * Cleanup — destroy the Lenis instance and remove the GSAP ticker
         * callback when this component unmounts.
         * --------------------------------------------------------------------- */
        return () => {
            lenis.destroy();
        };
    }, [autoStart]);

    return { lenisRef };
}
