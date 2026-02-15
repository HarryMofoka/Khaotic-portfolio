/* ==========================================================================
 * CustomCursor Component — Phase 4A + 4B: Context-Aware Cursor + Ink Trail
 * ==========================================================================
 * An enhanced custom cursor with:
 *
 *   4A · Context-Aware States
 *        The cursor changes shape/label based on what it hovers:
 *          • Default     → small accent dot
 *          • Links/cards → expanded organic blob (existing)
 *          • Images      → "VIEW" text label
 *          • Lab cards   → pulsing ring
 *          • Text        → thin vertical bar (I-beam)
 *
 *   4B · Ink Trail
 *        A secondary <canvas> renders a fading ink trail behind the cursor.
 *        Each frame, a small dot is painted at the cursor position with low
 *        opacity. The canvas slowly fades, creating an organic ink-bleed feel.
 *
 * Architecture:
 *   All animation is performed outside React's render cycle using refs
 *   and requestAnimationFrame for maximum performance.
 * ========================================================================== */

import React, { useEffect, useRef, useCallback } from "react";

/**
 * CustomCursor — Context-aware cursor with ink trail.
 */
const CustomCursor: React.FC = () => {
    /* -------------------------------------------------------------------------
     * Refs
     * ----------------------------------------------------------------------- */
    const cursorRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const trailCanvasRef = useRef<HTMLCanvasElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const cursorPos = useRef({ x: 0, y: 0 });
    const rafId = useRef<number>(0);
    const isTouch = useRef(false);
    const currentState = useRef<string>("default");

    /* -------------------------------------------------------------------------
     * setCursorState — Applies a CSS class + optional label to the cursor.
     * ----------------------------------------------------------------------- */
    const setCursorState = useCallback((state: string, label?: string) => {
        if (!cursorRef.current || !labelRef.current) return;
        const cursor = cursorRef.current;
        const labelEl = labelRef.current;

        /* Remove all state classes */
        cursor.className = "custom-cursor";

        /* Apply the new state */
        if (state !== "default") {
            cursor.classList.add(`cursor-${state}`);
        }

        /* Update label */
        labelEl.textContent = label || "";
        currentState.current = state;
    }, []);

    /* -------------------------------------------------------------------------
     * updateHoverTargets — Attach context-aware listeners to elements.
     * ----------------------------------------------------------------------- */
    const updateHoverTargets = useCallback(() => {
        if (!cursorRef.current) return;

        const reset = () => setCursorState("default");

        /* Nav links, buttons, film cards → blob */
        document.querySelectorAll(".nav-link, a, button, .film-card").forEach((el) => {
            el.addEventListener("mouseenter", () => setCursorState("hovered"));
            el.addEventListener("mouseleave", reset);
        });

        /* Images → "VIEW" label */
        document.querySelectorAll(".project-wrapper img, .project-wrapper video").forEach((el) => {
            el.addEventListener("mouseenter", () => setCursorState("view", "VIEW"));
            el.addEventListener("mouseleave", reset);
        });

        /* Lab cards → pulsing ring */
        document.querySelectorAll(".lab-card").forEach((el) => {
            el.addEventListener("mouseenter", () => setCursorState("lab"));
            el.addEventListener("mouseleave", reset);
        });
    }, [setCursorState]);

    useEffect(() => {
        /* Check for touch device */
        isTouch.current =
            "ontouchstart" in window || navigator.maxTouchPoints > 0;

        if (isTouch.current) {
            if (cursorRef.current) cursorRef.current.style.display = "none";
            if (trailCanvasRef.current) trailCanvasRef.current.style.display = "none";
            return;
        }

        /* ---- Ink trail canvas setup ---- */
        const trailCanvas = trailCanvasRef.current;
        const trailCtx = trailCanvas?.getContext("2d");

        const resizeTrailCanvas = () => {
            if (!trailCanvas) return;
            trailCanvas.width = window.innerWidth;
            trailCanvas.height = window.innerHeight;
        };
        resizeTrailCanvas();
        window.addEventListener("resize", resizeTrailCanvas);

        /* ---- Mouse-move handler ---- */
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;
        };
        document.addEventListener("mousemove", handleMouseMove);

        /* ---- Animation loop ---- */
        let frameCount = 0;
        const animate = () => {
            const dx = mousePos.current.x - cursorPos.current.x;
            const dy = mousePos.current.y - cursorPos.current.y;

            cursorPos.current.x += dx * 0.15;
            cursorPos.current.y += dy * 0.15;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) translate(-50%, -50%)`;
            }

            /* Phase 4B — Ink trail: paint a dot every 2nd frame */
            if (trailCtx && trailCanvas && frameCount % 2 === 0) {
                /* Set the blend mode on the canvas element style for better results in dark mode */
                if (trailCanvasRef.current) {
                    trailCanvasRef.current.style.mixBlendMode = "screen";
                }

                /* Fade the trail to blackish (source-over with low alpha) */
                trailCtx.globalCompositeOperation = "source-over";
                trailCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
                trailCtx.fillRect(0, 0, trailCanvas.width, trailCanvas.height);

                /* Draw ink dot at cursor position */
                const speed = Math.sqrt(dx * dx + dy * dy);
                const radius = Math.min(3 + speed * 0.08, 8);

                trailCtx.beginPath();
                trailCtx.arc(
                    cursorPos.current.x,
                    cursorPos.current.y,
                    radius,
                    0,
                    Math.PI * 2
                );
                trailCtx.fillStyle = "rgba(255, 61, 0, 0.12)";
                trailCtx.fill();
            }

            frameCount++;
            rafId.current = requestAnimationFrame(animate);
        };

        rafId.current = requestAnimationFrame(animate);

        /* Set up hover detection */
        updateHoverTargets();

        /* MutationObserver for dynamic content */
        const observer = new MutationObserver(() => {
            updateHoverTargets();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", resizeTrailCanvas);
            cancelAnimationFrame(rafId.current);
            observer.disconnect();
        };
    }, [updateHoverTargets]);

    return (
        <>
            {/* Ink trail canvas — fixed behind cursor, in front of content */}
            <canvas
                ref={trailCanvasRef}
                className="fixed inset-0 pointer-events-none z-[9998]"
            />

            {/* The cursor dot + state label */}
            <div ref={cursorRef} className="custom-cursor">
                <span
                    ref={labelRef}
                    className="absolute inset-0 flex items-center justify-center text-[8px] font-sans uppercase tracking-widest text-[var(--color-bg)] mix-blend-difference font-bold"
                />
            </div>
        </>
    );
};

export default CustomCursor;
