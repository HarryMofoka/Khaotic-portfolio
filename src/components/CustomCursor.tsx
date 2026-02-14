/* ==========================================================================
 * CustomCursor Component
 * ==========================================================================
 * Renders a custom cursor dot that smoothly follows the mouse position.
 *
 * Features:
 *   • Smooth follow — Uses requestAnimationFrame with linear interpolation
 *     (lerp factor 0.15) so the cursor trails the actual mouse position,
 *     creating a satisfying "lag" effect.
 *   • Hover expansion — When the mouse enters an interactive element
 *     (links, buttons, cards), the cursor expands into an organic blob
 *     shape via the `.hovered` CSS class.
 *   • Touch-device aware — On touch devices the cursor is hidden entirely
 *     since there's no mouse pointer to follow.
 *
 * Architecture:
 *   All animation is performed outside of React's render cycle using refs
 *   and requestAnimationFrame for maximum performance (no re-renders per
 *   mouse move).
 *
 * CSS Dependencies:
 *   `.custom-cursor` and `.custom-cursor.hovered` in `index.css`.
 * ========================================================================== */

import React, { useEffect, useRef, useCallback } from "react";

/**
 * CustomCursor — A performant custom cursor component.
 *
 * Renders a single <div> element and manages all animation imperatively
 * via refs and rAF to avoid unnecessary React re-renders.
 */
const CustomCursor: React.FC = () => {
    /* -------------------------------------------------------------------------
     * Refs
     * -------------------------------------------------------------------------
     * cursorRef       — DOM reference to the cursor <div> element
     * mousePos        — Latest raw mouse position (updated on every mousemove)
     * cursorPos       — Current interpolated cursor position (lerped toward mousePos)
     * rafId           — requestAnimationFrame ID for cleanup
     * isTouch         — Whether the device has touch capabilities
     * ----------------------------------------------------------------------- */
    const cursorRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const cursorPos = useRef({ x: 0, y: 0 });
    const rafId = useRef<number>(0);
    const isTouch = useRef(false);

    /* -------------------------------------------------------------------------
     * updateHoverTargets — Attach mouseenter/mouseleave listeners to all
     * interactive elements so the cursor knows when to expand.
     *
     * This is called on mount and can be called again if the DOM changes
     * (e.g. after the modal opens and adds new interactive elements).
     * ----------------------------------------------------------------------- */
    const updateHoverTargets = useCallback(() => {
        if (!cursorRef.current) return;
        const cursor = cursorRef.current;

        /* Query all interactive elements by class or element type */
        const targets = document.querySelectorAll(
            ".nav-link, a, button, .film-card"
        );

        targets.forEach((el) => {
            el.addEventListener("mouseenter", () => cursor.classList.add("hovered"));
            el.addEventListener("mouseleave", () =>
                cursor.classList.remove("hovered")
            );
        });
    }, []);

    useEffect(() => {
        /* Check for touch device — hide the custom cursor in that case */
        isTouch.current =
            "ontouchstart" in window || navigator.maxTouchPoints > 0;

        if (isTouch.current) {
            /* On touch devices, hide the cursor and bail out early */
            if (cursorRef.current) cursorRef.current.style.display = "none";
            return;
        }

        /* -------------------------------------------------------------------
         * Mouse-move handler — updates the raw target position.
         * This fires very frequently, so we only store the values and let
         * the rAF loop handle the DOM updates.
         * ----------------------------------------------------------------- */
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;
        };

        document.addEventListener("mousemove", handleMouseMove);

        /* -------------------------------------------------------------------
         * Animation loop — Smoothly interpolates the cursor <div> toward
         * the actual mouse position using a lerp factor of 0.15 (lower =
         * smoother but more "laggy").
         * ----------------------------------------------------------------- */
        const animate = () => {
            const dx = mousePos.current.x - cursorPos.current.x;
            const dy = mousePos.current.y - cursorPos.current.y;

            cursorPos.current.x += dx * 0.15;
            cursorPos.current.y += dy * 0.15;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) translate(-50%, -50%)`;
            }

            rafId.current = requestAnimationFrame(animate);
        };

        rafId.current = requestAnimationFrame(animate);

        /* Set up hover detection on all current interactive elements */
        updateHoverTargets();

        /* -------------------------------------------------------------------
         * MutationObserver — Re-scans the DOM for interactive elements
         * whenever child nodes are added/removed. This ensures hover
         * expansion works even for dynamically rendered content (e.g. the
         * project modal).
         * ----------------------------------------------------------------- */
        const observer = new MutationObserver(() => {
            updateHoverTargets();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        /* Cleanup on unmount */
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(rafId.current);
            observer.disconnect();
        };
    }, [updateHoverTargets]);

    return <div ref={cursorRef} className="custom-cursor" />;
};

export default CustomCursor;
