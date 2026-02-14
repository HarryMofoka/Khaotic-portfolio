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
import { Icon } from "@iconify/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* Ensure ScrollTrigger is registered */
gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
    /** Whether the fullscreen menu is currently open */
    isMenuOpen: boolean;
    /** Callback to toggle the menu overlay */
    onMenuToggle: () => void;
    /** Whether light mode is active */
    isLight: boolean;
    /** Callback to toggle the theme */
    toggleTheme: () => void;
}

/**
 * Navbar — The fixed pill-shaped navigation bar.
 */
const Navbar: React.FC<NavbarProps> = ({
    isMenuOpen,
    onMenuToggle,
    isLight,
    toggleTheme,
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
                    "linear-gradient(180deg, rgba(30,30,30,0.8) 0%, rgba(10,10,10,0.9) 100%)",
                backdropFilter: "blur(20px)",
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
                backgroundColor: "rgba(20, 20, 22, 0.9)",
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
                className="pointer-events-auto opacity-0 translate-y-[-20px] w-full h-20 rounded-full flex items-center justify-between px-8 relative overflow-hidden group origin-top will-change-transform z-50"
                style={{
                    background: "rgba(255, 255, 255, 0.01)",
                    backdropFilter: "blur(0px)",
                    border: "1px solid rgba(255, 255, 255, 0)",
                }}
            >
                {/* ---- LEFT: Menu Trigger ---- */}
                <div className="flex items-center z-10 w-[160px] h-full">
                    <button
                        ref={menuBtnRef}
                        onClick={handleMenuClick}
                        className="nav-link text-white hover:text-white/80 text-[16px] font-sans font-medium transition-colors duration-300 origin-left whitespace-nowrap flex items-center gap-2 group-hover:text-[#FF3D00]"
                    >
                        {/* Animated dot — accent colour when menu is open */}
                        <div
                            className="w-1.5 h-1.5 rounded-full transition-colors"
                            style={{
                                backgroundColor: isMenuOpen ? "#FF3D00" : "white",
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
                        className="antialiased origin-center whitespace-nowrap text-xl font-extrabold text-white tracking-tight font-display pt-2"
                    >
                        KHAOTIC
                    </h1>
                </div>

                {/* ---- RIGHT: Meta Info & Theme Toggle ---- */}
                <div
                    ref={rightGroupRef}
                    className="flex items-center justify-end gap-6 z-10 text-white w-[160px] h-full origin-right"
                >
                    {/* South African clock — hidden on mobile */}
                    <div className="hidden md:flex items-center gap-2 text-[14px] font-sans font-normal tracking-wide whitespace-nowrap">
                        <span>SAR</span>
                        <span ref={timeRef} className="tabular-nums">
                            --:--
                        </span>
                    </div>

                    {/* Theme toggle icon */}
                    <div className="flex items-center gap-4 h-full">
                        <button
                            onClick={toggleTheme}
                            className="nav-link hover:text-white/70 transition-colors duration-300 flex items-center justify-center p-1 rounded-full"
                        >
                            <Icon
                                icon={isLight ? "lucide:sun" : "lucide:moon"}
                                width={18}
                                height={18}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
