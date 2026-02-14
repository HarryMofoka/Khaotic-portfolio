/* ==========================================================================
 * MenuOverlay Component
 * ==========================================================================
 * A fullscreen navigation overlay that slides over the page content.
 *
 * Features:
 *   • GSAP animated entrance — Menu items fly in from below with stagger,
 *     the info section fades in with a delay.
 *   • GSAP animated exit — The overlay fades out, then fires `onClose`.
 *   • Hover effect — Each menu link has a CSS-driven effect that slides
 *     the clean font text up and reveals a "Rock Salt" handwritten version
 *     of the same text sliding in from below (in accent colour).
 *   • Socials sidebar — Links to Instagram and Twitter/X.
 *
 * Props:
 *   @prop isOpen  — Controls visibility and triggers GSAP enter/exit.
 *   @prop onClose — Callback to close the overlay (resets parent state).
 *
 * CSS Dependencies:
 *   `.menu-link-hover` and `::after` pseudo-element styles in `index.css`.
 * ========================================================================== */

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

/** Navigation link labels — the `data-text` attribute mirrors the label
 *  so the CSS `::after` pseudo-element can render the handwritten copy. */
const MENU_ITEMS = ["Index", "Work", "Studio", "Contact"];

interface MenuOverlayProps {
    /** Whether the menu is currently open */
    isOpen: boolean;
    /** Callback to close the menu overlay */
    onClose: () => void;
}

/**
 * MenuOverlay — Fullscreen navigation overlay with animated menu items.
 */
const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose }) => {
    /* Ref for the overlay container — used by GSAP for fade in/out */
    const overlayRef = useRef<HTMLDivElement>(null);

    /* Refs for the staggered animation targets */
    const itemsRef = useRef<HTMLAnchorElement[]>([]);
    const infoRef = useRef<HTMLDivElement>(null);

    /* -------------------------------------------------------------------------
     * setItemRef — Helper to collect refs in an array for stagger animation.
     * Used as the `ref` callback on each menu <a> element.
     * ----------------------------------------------------------------------- */
    const setItemRef = useCallback(
        (el: HTMLAnchorElement | null, index: number) => {
            if (el) itemsRef.current[index] = el;
        },
        []
    );

    /* -------------------------------------------------------------------------
     * GSAP Enter / Exit Animations
     *
     * When `isOpen` transitions to `true`:
     *   1. Show the overlay (display: flex)
     *   2. Fade in the overlay background
     *   3. Stagger-animate each menu item from below (y:100, opacity:0 → 0,1)
     *   4. Fade in the socials info section with a delay
     *
     * When `isOpen` transitions to `false`:
     *   1. Fade out the overlay background
     *   2. On complete, hide the overlay (display: none) and fire `onClose`
     *      (note: onClose may also re-enable Lenis scrolling)
     * ----------------------------------------------------------------------- */
    useEffect(() => {
        const overlay = overlayRef.current;
        if (!overlay) return;

        if (isOpen) {
            /* ---- ENTER ---- */
            overlay.style.display = "flex";

            gsap.to(overlay, { opacity: 1, duration: 0.5 });

            gsap.fromTo(
                itemsRef.current,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    delay: 0.2,
                }
            );

            gsap.to(infoRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.5,
            });
        } else {
            /* ---- EXIT ---- */
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    overlay.style.display = "none";
                },
            });
        }
    }, [isOpen]);

    /* -------------------------------------------------------------------------
     * handleLinkClick — Close the menu when a nav link is clicked.
     * In a real SPA, this would also trigger route navigation.
     * ----------------------------------------------------------------------- */
    const handleLinkClick = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            onClose();
        },
        [onClose]
    );

    /* -------------------------------------------------------------------------
     * Render
     * ----------------------------------------------------------------------- */
    return (
        <div
            id="menu-overlay"
            ref={overlayRef}
            className="fixed inset-0 z-40 bg-[#050505] hidden flex-col justify-center items-center overflow-hidden"
            style={{ opacity: 0 }}
        >
            {/* ---- Atmospheric background orb ---- */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] bg-[#FF3D00] blur-[150px] rounded-full" />
            </div>

            {/* ---- Content Container ---- */}
            <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row w-full h-full pt-32 pb-12 relative z-10">
                {/* ---- Nav Links ---- */}
                <nav className="flex-1 flex flex-col justify-center items-start gap-4 md:gap-6">
                    {MENU_ITEMS.map((label, i) => (
                        <a
                            key={label}
                            href="#"
                            ref={(el) => setItemRef(el, i)}
                            onClick={handleLinkClick}
                            className="menu-item nav-link group block overflow-hidden"
                        >
                            <div
                                className="menu-link-hover font-sans font-semibold text-[10vw] md:text-[5vw] leading-[1] tracking-tight text-white uppercase"
                                data-text={label}
                            >
                                <span>{label}</span>
                            </div>
                        </a>
                    ))}
                </nav>

                {/* ---- Socials Info (Right Side) ---- */}
                <div className="md:w-1/3 flex flex-col justify-end items-start md:items-end gap-12 mt-12 md:mt-0">
                    <div
                        ref={infoRef}
                        className="flex flex-col gap-4 text-left md:text-right menu-info opacity-0 translate-y-4"
                    >
                        <span className="text-secondary text-xs uppercase tracking-widest font-sans font-medium">
                            Socials
                        </span>
                        <div className="flex flex-col gap-2 text-xl font-display text-white">
                            <a
                                href="#"
                                className="nav-link hover:text-[#FF3D00] transition-colors w-max md:ml-auto"
                            >
                                Instagram
                            </a>
                            <a
                                href="#"
                                className="nav-link hover:text-[#FF3D00] transition-colors w-max md:ml-auto"
                            >
                                Twitter / X
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuOverlay;
