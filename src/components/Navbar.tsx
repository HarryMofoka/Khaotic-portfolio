/* ==========================================================================
 * Navbar Component
 * ==========================================================================
 * Fixed pill-shaped navigation bar at the top of the page.
 *
 * Features:
 *   • Scroll-driven shrink — On desktop, GSAP + ScrollTrigger animates
 *     the pill from full width → compact (600px) with a glassmorphism
 *     background as the user scrolls past the first 150px.
 *   • Mobile responsive — On mobile, the pill shrinks to 92% width with
 *     a simpler dark background.
 *   • Clock — Displays current time in South African timezone, updated every
 *     second via `setInterval`.
 *   • Theme toggle — Renders a moon/sun icon button that calls the
 *     parent's `toggleTheme` handler.
 *   • Menu trigger — Clicking "Menu" / "Close" calls the parent's
 *     `onMenuToggle` handler.
 *
 * Props:
 *   @prop isMenuOpen    — Whether the fullscreen menu overlay is open.
 *   @prop onMenuToggle  — Callback to open/close the menu overlay.
 *   @prop isLight       — Current light/dark theme state (for icon swap).
 *   @prop toggleTheme   — Callback to toggle the colour theme.
 *
 * GSAP Animation Notes:
 *   The intro animation (slide-in from top) is handled by the parent's
 *   `startIntro` function after the loader completes. This component only
 *   sets up the scroll-driven shrink animation.
 * ========================================================================== */

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* Ensure ScrollTrigger is registered */
gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
    /** Whether the fullscreen menu is currently open */
    isMenuOpen: boolean;
    /** Callback to toggle the menu overlay */
    onMenuToggle: () => void;
}

/**
 * Navbar — The fixed pill-shaped navigation bar.
 */
const Navbar: React.FC<NavbarProps> = ({
    isMenuOpen,
    onMenuToggle,
}) => {
    /* Ref for the pill container — animated by GSAP */
    const pillRef = useRef<HTMLDivElement>(null);

    /* Refs for elements that scale down on scroll */
    const menuBtnRef = useRef<HTMLButtonElement>(null);
    const logoRef = useRef<HTMLHeadingElement>(null);
    const rightGroupRef = useRef<HTMLDivElement>(null);

    /* Ref for the time display element */
    const timeRef = useRef<HTMLSpanElement>(null);

    /* -------------------------------------------------------------------------
     * Clock — Update every second to show current South African time
     * ----------------------------------------------------------------------- */
    useEffect(() => {
        /** Format and display the current time */
        const update = () => {
            const now = new Date();
            const str = now.toLocaleTimeString("en-US", {
                timeZone: "Africa/Johannesburg",
                hour: "numeric",
                minute: "2-digit",
            });
            if (timeRef.current) timeRef.current.textContent = str;
        };

        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, []);

    /* -------------------------------------------------------------------------
     * GSAP Scroll Animations — Shrink pill + scale inner elements on scroll
     *
     * Desktop (≥768px):
     *   • Pill shrinks from full width to 600px, height 80→44px
     *   • Background shifts to a dark glassmorphism gradient
     *   • Logo, menu button, and right group scale down to 0.85
     *
     * Mobile (<768px):
     *   • Pill shrinks to 92% width, height 48px
     *   • Simple dark background with blur
     * ----------------------------------------------------------------------- */
    useEffect(() => {
        const mm = gsap.matchMedia();

        /* Desktop breakpoint */
        mm.add("(min-width: 768px)", () => {
            const scrollConfig: ScrollTrigger.Vars = {
                trigger: "body",
                start: "top top",
                end: "150px top",
                scrub: true,
            };

            gsap.to(pillRef.current, {
                scrollTrigger: scrollConfig,
                width: "600px",
                height: "44px",
                background:
                    "var(--color-bg)", // We'll assume a fallback or just use variables
                /* Note: Tailwind v4 variables might need a different approach for RGBA in JS.
                   We'll use a CSS-based approach or just rely on the variable directly if opacity isn't critical.
                   Actually, let's use a simpler solid color variable with alpha if possible, 
                   or just trust the CSS variable is defined for background. */
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-border)",
                backdropFilter: "blur(24px)",
                borderRadius: "9999px",
                marginTop: "12px",
                ease: "power2.inOut",
            });

            gsap.to(
                [menuBtnRef.current, logoRef.current, rightGroupRef.current],
                {
                    scrollTrigger: scrollConfig,
                    scale: 0.85,
                    ease: "power2.inOut",
                }
            );
        });

        /* Mobile breakpoint */
        mm.add("(max-width: 767px)", () => {
            gsap.to(pillRef.current, {
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "100px top",
                    scrub: true,
                },
                width: "92%",
                height: "48px",
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-border)",
                backdropFilter: "blur(20px)",
                marginTop: "8px",
                ease: "power2.out",
            });
        });

        return () => {
            mm.revert();
        };
    }, []);

    /* -------------------------------------------------------------------------
     * handleMenuClick — Wrapped in useCallback for stable reference
     * ----------------------------------------------------------------------- */
    const handleMenuClick = useCallback(() => {
        onMenuToggle();
    }, [onMenuToggle]);

    /* -------------------------------------------------------------------------
     * Render
     * ----------------------------------------------------------------------- */
    return (
        <header className="fixed top-0 left-0 w-full z-50 pointer-events-none flex justify-center pt-8 px-4 md:px-6">
            <div
                id="nav-pill"
                ref={pillRef}
                className="pointer-events-auto opacity-0 translate-y-[-20px] w-full h-20 rounded-full flex items-center justify-between px-8 relative overflow-hidden group origin-top will-change-transform z-50 transition-colors"
                style={{
                    backgroundColor: "transparent",
                    backdropFilter: "blur(0px)",
                    border: "1px solid transparent",
                }}
            >
                {/* ---- LEFT: Menu Trigger ---- */}
                <div className="flex items-center z-10 w-[160px] h-full">
                    <button
                        ref={menuBtnRef}
                        onClick={handleMenuClick}
                        className="nav-link text-[var(--color-text)] hover:text-[var(--color-accent)] text-[16px] font-sans font-medium transition-colors duration-300 origin-left whitespace-nowrap flex items-center gap-2"
                    >
                        {/* Animated dot — accent colour when menu is open */}
                        <div
                            className="w-1.5 h-1.5 rounded-full transition-colors"
                            style={{
                                backgroundColor: isMenuOpen ? "var(--color-accent)" : "var(--color-text)",
                            }}
                        />
                        <span className="translate-y-[1px]">
                            {isMenuOpen ? "Close" : "Menu"}
                        </span>
                    </button>
                </div>

                {/* ---- CENTER: Brand Logo ---- */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 nav-link cursor-pointer h-full flex items-center justify-center">
                    <h1
                        ref={logoRef}
                        id="nav-logo"
                        className="antialiased origin-center whitespace-nowrap text-xl font-extrabold text-[var(--color-text)] tracking-tight font-display pt-2"
                    >
                        KHAOTIC
                    </h1>
                </div>

                {/* ---- RIGHT: Meta Info ---- */}
                <div
                    ref={rightGroupRef}
                    className="flex items-center justify-end gap-6 z-10 text-[var(--color-text)] w-[160px] h-full origin-right"
                >
                    {/* South African clock — hidden on mobile */}
                    <div className="hidden md:flex items-center gap-2 text-[14px] font-sans font-normal tracking-wide whitespace-nowrap text-[var(--color-text-dim)]">
                        <span>SAR</span>
                        <span ref={timeRef} className="tabular-nums">
                            --:--
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
