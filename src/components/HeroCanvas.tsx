/* ==========================================================================
 * HeroCanvas Component — Generative Noise Field
 * ==========================================================================
 * A fullscreen HTML5 <canvas> element that renders an interactive,
 * real-time Perlin/Simplex noise field as the hero background.
 *
 * Visual Effect:
 *   The canvas draws a grid of dots whose brightness is driven by 3D
 *   simplex noise (x, y, time). The noise creates organic, flowing
 *   patterns that shift continuously. When the user moves their mouse,
 *   the noise field distorts MORE near the cursor — turbulence increases
 *   with proximity, reinforcing the "khaotic" brand.
 *
 * Performance:
 *   • Uses requestAnimationFrame for smooth 60fps rendering
 *   • Dot grid resolution is configurable (lower = better perf)
 *   • Mouse position is tracked via refs (zero re-renders)
 *   • Canvas auto-resizes on window resize via ResizeObserver
 *
 * Architecture:
 *   The Simplex noise implementation is embedded directly in this file
 *   to avoid external dependencies. It's a well-known algorithm based
 *   on Stefan Gustavson's optimised implementation.
 *
 * Props:
 *   None — this component is self-contained and manages its own animation.
 * ========================================================================== */

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ==========================================================================
 * Simplex Noise — Embedded Implementation
 * ==========================================================================
 * A compact 3D simplex noise function. Produces smooth, natural-looking
 * pseudo-random values in the range [-1, 1] for any (x, y, z) input.
 *
 * Based on Stefan Gustavson's paper "Simplex noise demystified".
 * We use 3D noise so the third axis (z) can serve as a "time" dimension,
 * creating flowing animation without needing to regenerate the noise field.
 * ========================================================================== */

/** Gradient vectors for 3D simplex noise — 12 directions */
const GRAD3: number[][] = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
];

/** Permutation table — shuffled integers 0-255, doubled for wrapping */
const PERM: number[] = (() => {
    const p = [
        151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
        140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148,
        247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
        57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
        74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122,
        60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
        65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169,
        200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64,
        52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212,
        207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213,
        119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
        129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104,
        218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
        81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
        184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
        222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
    ];
    /* Double the table to avoid modular indexing */
    return [...p, ...p];
})();

/**
 * dot3 — Dot product of a gradient vector and a (dx, dy, dz) offset.
 * Used to project the simplex corner contribution onto the gradient.
 */
function dot3(g: number[], x: number, y: number, z: number): number {
    return g[0] * x + g[1] * y + g[2] * z;
}

/**
 * simplex3 — Compute 3D simplex noise at coordinates (xin, yin, zin).
 *
 * @returns A value in the range [-1, 1].
 */
function simplex3(xin: number, yin: number, zin: number): number {
    /* Skewing and unskewing factors for 3D */
    const F3 = 1.0 / 3.0;
    const G3 = 1.0 / 6.0;

    /* Skew the input space to determine which simplex cell we're in */
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);

    const t = (i + j + k) * G3;

    /* Unskew the cell origin back to (x,y,z) space */
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;

    /* Distances from cell origin */
    const x0 = xin - X0;
    const y0 = yin - Y0;
    const z0 = zin - Z0;

    /* Determine which simplex we are in (3D has 6 possible simplices) */
    let i1: number, j1: number, k1: number;
    let i2: number, j2: number, k2: number;

    if (x0 >= y0) {
        if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
        else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
        else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
        if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
        else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
        else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }

    /* Offsets for the remaining corners */
    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2.0 * G3;
    const y2 = y0 - j2 + 2.0 * G3;
    const z2 = z0 - k2 + 2.0 * G3;
    const x3 = x0 - 1.0 + 3.0 * G3;
    const y3 = y0 - 1.0 + 3.0 * G3;
    const z3 = z0 - 1.0 + 3.0 * G3;

    /* Permutation table indices for hashing */
    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;

    /* Calculate contributions from each corner */
    let n0 = 0, n1 = 0, n2 = 0, n3 = 0;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 >= 0) {
        t0 *= t0;
        const gi0 = PERM[ii + PERM[jj + PERM[kk]]] % 12;
        n0 = t0 * t0 * dot3(GRAD3[gi0], x0, y0, z0);
    }

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 >= 0) {
        t1 *= t1;
        const gi1 = PERM[ii + i1 + PERM[jj + j1 + PERM[kk + k1]]] % 12;
        n1 = t1 * t1 * dot3(GRAD3[gi1], x1, y1, z1);
    }

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 >= 0) {
        t2 *= t2;
        const gi2 = PERM[ii + i2 + PERM[jj + j2 + PERM[kk + k2]]] % 12;
        n2 = t2 * t2 * dot3(GRAD3[gi2], x2, y2, z2);
    }

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 >= 0) {
        t3 *= t3;
        const gi3 = PERM[ii + 1 + PERM[jj + 1 + PERM[kk + 1]]] % 12;
        n3 = t3 * t3 * dot3(GRAD3[gi3], x3, y3, z3);
    }

    /* Scale result to [-1, 1] */
    return 32.0 * (n0 + n1 + n2 + n3);
}

/* ==========================================================================
 * HeroCanvas Component
 * ========================================================================== */

/**
 * DOT_SPACING — Distance in pixels between each dot in the noise grid.
 * Lower values = denser grid = more detail but more CPU. 18–24 is a
 * good balance between visual density and performance.
 */
const DOT_SPACING = 20;

/**
 * BASE_DOT_RADIUS — The default radius of each dot (in pixels).
 */
const BASE_DOT_RADIUS = 1.2;

/**
 * NOISE_SCALE — Controls how "zoomed in" the noise pattern is.
 * Smaller values = larger, smoother blobs. Larger = more turbulent detail.
 */
const NOISE_SCALE = 0.004;

/**
 * TIME_SPEED — How fast the noise field animates over time.
 * Controls the "flow" speed of the organic patterns.
 */
const TIME_SPEED = 0.0003;

/**
 * MOUSE_INFLUENCE_RADIUS — The radius (in pixels) within which the mouse
 * affects the noise field. Dots closer than this to the cursor get extra
 * turbulence, larger radii, and brighter intensity.
 */
const MOUSE_INFLUENCE_RADIUS = 250;

/**
 * HeroCanvas — Fullscreen generative noise field that reacts to the mouse.
 */
const HeroCanvas: React.FC = () => {
    /* -------------------------------------------------------------------------
     * Refs
     * ----------------------------------------------------------------------- */

    /** The <canvas> DOM element */
    const canvasRef = useRef<HTMLCanvasElement>(null);

    /** The container div — used by ResizeObserver to track viewport changes */
    const containerRef = useRef<HTMLDivElement>(null);

    /** The 2D rendering context (cached to avoid re-fetching each frame) */
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    /** Current mouse position in viewport coordinates */
    const mouseRef = useRef({ x: -9999, y: -9999 });

    /** requestAnimationFrame ID for cleanup */
    const rafRef = useRef<number>(0);

    /* -------------------------------------------------------------------------
     * resizeCanvas — Match the canvas pixel buffer to the container's size.
     *
     * We multiply by devicePixelRatio for crisp rendering on retina displays,
     * then scale the context so we can draw in CSS-pixel coordinates.
     * ----------------------------------------------------------------------- */
    /* -------------------------------------------------------------------------
     * Main Effect — Set up canvas, resize handling, mouse tracking, and
     * the animation loop. Everything is contained in one effect so that
     * `animate` is in scope for both the loop and the resize-restart logic.
     * ----------------------------------------------------------------------- */
    useEffect(() => {
        /* ---- Animation Loop ---- */
        const animate = () => {
            const ctx = ctxRef.current;
            const canvas = canvasRef.current;
            if (!ctx || !canvas) {
                /* Early return WITHOUT scheduling another frame.
                 * This prevents a tight spin of empty rAF callbacks.
                 * The loop will be restarted by resizeCanvas once
                 * the canvas context becomes available. */
                rafRef.current = 0;
                return;
            }

            const dpr = window.devicePixelRatio || 1;
            const w = canvas.width / dpr;
            const h = canvas.height / dpr;
            const time = Date.now() * TIME_SPEED;
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            /* Clear the canvas to fully transparent */
            ctx.clearRect(0, 0, w, h);

            /* ---------------------------------------------------------------
             * Render the dot grid
             *
             * For each dot position on a regular grid, we:
             *   1. Compute its distance to the mouse cursor
             *   2. Calculate a "proximity factor" (0 = far, 1 = on cursor)
             *   3. Sample simplex noise with extra turbulence near the cursor
             *   4. Map the noise value to brightness, size, and accent colour
             * ------------------------------------------------------------- */
            const cols = Math.ceil(w / DOT_SPACING) + 1;
            const rows = Math.ceil(h / DOT_SPACING) + 1;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * DOT_SPACING;
                    const y = row * DOT_SPACING;

                    /* Distance from this dot to the mouse cursor */
                    const dx = x - mx;
                    const dy = y - my;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    /* Proximity factor: 1.0 at cursor centre, 0.0 beyond influence radius */
                    const proximity = Math.max(0, 1 - dist / MOUSE_INFLUENCE_RADIUS);

                    /* ---- Noise sampling ----
                     * Base noise creates the flowing organic pattern.
                     * Near the cursor, we add a second, higher-frequency noise
                     * layer ("turbulence") that creates more chaotic detail. */
                    const baseNoise = simplex3(
                        x * NOISE_SCALE,
                        y * NOISE_SCALE,
                        time
                    );

                    /* Turbulence layer — only active near cursor (proximity > 0) */
                    const turbulence =
                        proximity > 0
                            ? simplex3(
                                x * NOISE_SCALE * 3,
                                y * NOISE_SCALE * 3,
                                time * 2
                            ) * proximity * 0.6
                            : 0;

                    /* Combined noise value in range [-1, 1] */
                    const noiseVal = baseNoise + turbulence;

                    /* Normalise to [0, 1] for brightness */
                    const brightness = (noiseVal + 1) * 0.5;

                    /* ---- Dot rendering ----
                     * Base alpha is subtle (0.08–0.35). Near the cursor, alpha
                     * and radius increase to create a "spotlight of chaos" effect. */
                    const baseAlpha = 0.08 + brightness * 0.27;
                    const cursorBoost = proximity * proximity * 0.6;
                    const alpha = Math.min(1, baseAlpha + cursorBoost);

                    const radius =
                        BASE_DOT_RADIUS + brightness * 0.8 + proximity * 2.5;

                    /* Colour mixing: white by default, blend to accent (#FF3D00)
                     * as proximity increases — the cursor "ignites" nearby dots */
                    const r = Math.round(255);
                    const g = Math.round(255 - proximity * (255 - 61));
                    const b = Math.round(255 - proximity * 255);

                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                    ctx.fill();
                }
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        /* ---- Local resize helper ---- */
        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;

            const dpr = window.devicePixelRatio || 1;
            const rect = container.getBoundingClientRect();

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.scale(dpr, dpr);
                ctxRef.current = ctx;

                /* If the animation loop stopped (because ctx was null),
                 * restart it now that the context is available. */
                if (!rafRef.current) {
                    rafRef.current = requestAnimationFrame(animate);
                }
            }
        };

        /* ---- Mouse tracking ---- */
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
                mouseRef.current.x = e.clientX - rect.left;
                mouseRef.current.y = e.clientY - rect.top;
            }
        };

        const handleMouseLeave = () => {
            mouseRef.current.x = -9999;
            mouseRef.current.y = -9999;
        };

        const container = containerRef.current;
        container?.addEventListener("mousemove", handleMouseMove);
        container?.addEventListener("mouseleave", handleMouseLeave);

        /* ---- Resize Observer ---- */
        const resizeObserver = new ResizeObserver(() => resizeCanvas());
        if (container) resizeObserver.observe(container);

        /* Kick off initial resize (which also starts the animation loop) */
        resizeCanvas();

        /* ---- Cleanup ---- */
        return () => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
            container?.removeEventListener("mousemove", handleMouseMove);
            container?.removeEventListener("mouseleave", handleMouseLeave);
            resizeObserver.disconnect();
        };
    }, []);

    /* -------------------------------------------------------------------------
     * Ref for the letter container — animated by GSAP ScrollTrigger
     * ----------------------------------------------------------------------- */
    const lettersRef = useRef<HTMLDivElement>(null);
    const taglineRef = useRef<HTMLParagraphElement>(null);

    /* -------------------------------------------------------------------------
     * Phase 1B — Scroll-Driven Fragmented Name Assembly
     *
     * On mount, each letter of "HARRY MOFOKA" is scattered to a random
     * position with rotation and zero opacity. As the user scrolls,
     * GSAP ScrollTrigger assembles them back to their natural position.
     * The tagline fades in after the letters settle.
     * ----------------------------------------------------------------------- */
    useEffect(() => {
        const letters = lettersRef.current?.querySelectorAll(".hero-letter");
        if (!letters || letters.length === 0) return;

        /* Scatter each letter to a random offset */
        letters.forEach((letter) => {
            gsap.set(letter, {
                x: gsap.utils.random(-300, 300),
                y: gsap.utils.random(-200, 200),
                rotation: gsap.utils.random(-45, 45),
                opacity: 0,
                scale: gsap.utils.random(0.5, 1.8),
            });
        });

        /* Also hide the tagline initially */
        gsap.set(taglineRef.current, { opacity: 0, y: 20 });

        /* Assemble letters on scroll */
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                end: "center center",
                scrub: 1.2,
            },
        });

        tl.to(letters, {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            stagger: 0.05,
            ease: "power3.out",
        });

        /* Fade in tagline after letters assemble */
        tl.to(
            taglineRef.current,
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
            },
            "-=0.3"
        );

        return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
        };
    }, []);

    /* -------------------------------------------------------------------------
     * Phase 1B — Name string split into individual characters.
     * The space between "HARRY" and "MOFOKA" is preserved as a wider gap.
     * ----------------------------------------------------------------------- */
    const NAME = "HARRY MOFOKA";

    /* -------------------------------------------------------------------------
     * Render
     *
     * Structure:
     *   container (60–70vh)
     *     ├─ <canvas>              — generative noise (1A)
     *     ├─ letter fragments      — "HARRY MOFOKA" (1B)
     *     ├─ tagline               — "curated chaos" with glitch hover (1B)
     *     └─ bottom gradient       — smooth fade into project cards (1C)
     * ----------------------------------------------------------------------- */
    return (
        <div
            ref={containerRef}
            className="h-[60vh] md:h-[70vh] w-full relative flex flex-col items-center justify-center overflow-hidden"
        >
            {/* The generative noise canvas — absolute fill, behind all text */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ display: "block" }}
            />

            {/* ============================================================
             * Phase 1B — Fragmented Name Reveal
             * ============================================================
             * Each letter is an inline-block span. GSAP scatters them on
             * mount and assembles them on scroll. The handwritten font
             * (font-display = Rock Salt) reinforces the "khaotic" brand.
             * ============================================================ */}
            <div
                ref={lettersRef}
                className="relative z-10 flex flex-wrap items-center justify-center select-none pointer-events-none"
            >
                {NAME.split("").map((char, i) =>
                    char === " " ? (
                        /* Preserve natural word gap */
                        <span key={`space-${i}`} className="w-4 md:w-6" />
                    ) : (
                        <span
                            key={`${char}-${i}`}
                            className="hero-letter inline-block text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display text-white font-bold will-change-transform"
                        >
                            {char}
                        </span>
                    )
                )}
            </div>

            {/* ============================================================
             * Phase 1B — Tagline with Glitch Hover
             * ============================================================
             * "curated chaos" in the handwritten font. On hover it plays a
             * CSS-only glitch effect via the glitch-text class.
             * ============================================================ */}
            <p
                ref={taglineRef}
                className="relative z-10 mt-4 md:mt-6 font-display text-sm md:text-base text-white/30 tracking-[0.3em] uppercase cursor-pointer transition-colors hover:text-[#FF3D00]/60 glitch-text"
                data-text="curated chaos"
            >
                curated chaos
            </p>

            {/* ============================================================
             * Phase 1C — Bottom Gradient Fade
             * ============================================================
             * A gradient overlay at the bottom of the hero that fades from
             * transparent to the page background colour, creating a smooth
             * visual transition into the first project card below.
             * ============================================================ */}
            <div
                className="hero-fade absolute bottom-0 left-0 w-full h-32 md:h-48 pointer-events-none z-20"
            />
        </div>
    );
};

export default HeroCanvas;
