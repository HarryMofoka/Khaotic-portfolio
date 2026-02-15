import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useMood, MOODS } from "../context/MoodContext";

/** Navigation link labels */
const MENU_ITEMS = ["Index", "Work", "Lab", "About", "Contact"];

interface MenuOverlayProps {
    /** Whether the menu is currently open */
    isOpen: boolean;
    /** Callback to close the menu overlay */
    onClose: () => void;
}

/**
 * MenuOverlay — Fullscreen navigation overlay with mood switcher and magnetic links.
 */
const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose }) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<HTMLAnchorElement[]>([]);
    const infoRef = useRef<HTMLDivElement>(null);
    const moodRef = useRef<HTMLDivElement>(null);
    const { mood, setMood } = useMood();

    const setItemRef = useCallback((el: HTMLAnchorElement | null, index: number) => {
        if (el) itemsRef.current[index] = el;
    }, []);

    /* -------------------------------------------------------------------------
     * GSAP Enter / Exit Animations
     * ----------------------------------------------------------------------- */
    useEffect(() => {
        const overlay = overlayRef.current;
        if (!overlay) return;

        if (isOpen) {
            overlay.style.display = "flex";
            gsap.to(overlay, { opacity: 1, duration: 0.6, ease: "power2.out" });

            gsap.fromTo(
                itemsRef.current,
                { y: 80, opacity: 0, rotate: 2 },
                {
                    y: 0,
                    opacity: 1,
                    rotate: 0,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: "power3.out",
                    delay: 0.2,
                }
            );

            gsap.to([infoRef.current, moodRef.current], {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.5,
            });
        } else {
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => {
                    overlay.style.display = "none";
                },
            });
        }
    }, [isOpen]);

    /* -------------------------------------------------------------------------
     * Magnetic Effect for Links — Subtle pull toward cursor
     * ----------------------------------------------------------------------- */
    const handleMouseMove = useCallback((e: React.MouseEvent, index: number) => {
        const el = itemsRef.current[index];
        if (!el) return;

        const { left, top, width, height } = el.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const moveX = (e.clientX - centerX) * 0.2;
        const moveY = (e.clientY - centerY) * 0.4;

        gsap.to(el, {
            x: moveX,
            y: moveY,
            duration: 0.4,
            ease: "power2.out",
        });
    }, []);

    const handleMouseLeave = useCallback((index: number) => {
        const el = itemsRef.current[index];
        if (el) {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.3)",
            });
        }
    }, []);

    const handleLinkClick = (e: React.MouseEvent, targetId?: string) => {
        e.preventDefault();
        onClose();
        if (targetId) {
            const el = document.getElementById(targetId);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div
            id="menu-overlay"
            ref={overlayRef}
            className="fixed inset-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-2xl hidden flex-col justify-center items-center overflow-hidden"
            style={{ opacity: 0 }}
        >
            {/* ---- Background Accents ---- */}
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[var(--color-accent)] blur-[120px] rounded-full animate-pulse opacity-40" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40vw] h-[40vw] bg-[var(--color-accent)] blur-[150px] rounded-full opacity-30" />
            </div>

            <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row w-full h-full pt-40 pb-20 relative z-10">
                {/* ---- Nav Links ---- */}
                <nav className="flex-1 flex flex-col justify-center items-start gap-4 md:gap-8">
                    {MENU_ITEMS.map((label, i) => (
                        <a
                            key={label}
                            href={`#${label.toLowerCase()}`}
                            ref={(el) => setItemRef(el, i)}
                            onMouseMove={(e) => handleMouseMove(e, i)}
                            onMouseLeave={() => handleMouseLeave(i)}
                            onClick={(e) => handleLinkClick(e, label.toLowerCase())}
                            className="menu-item nav-link group block"
                        >
                            <div
                                className="menu-link-hover font-display font-medium text-[12vw] md:text-[6vw] leading-[0.9] text-[var(--color-text-dim)] group-hover:text-[var(--color-text)] transition-colors duration-500 uppercase flex items-baseline gap-4"
                                data-text={label}
                            >
                                <span className="text-[2vw] font-sans opacity-20 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
                                <span>{label}</span>
                            </div>
                        </a>
                    ))}
                </nav>

                {/* ---- Sidebar: Socials & Moods ---- */}
                <div className="md:w-1/3 flex flex-col justify-end items-start md:items-end gap-16 mt-12 md:mt-0">
                    {/* Mood Switcher (Phase 4C + 5B) */}
                    <div ref={moodRef} className="flex flex-col gap-4 text-left md:text-right opacity-0 translate-y-4">
                        <span className="text-[var(--color-text-dim)] text-[10px] uppercase tracking-[0.3em] font-sans">Switch Mood</span>
                        <div className="flex flex-wrap md:justify-end gap-3">
                            {MOODS.map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMood(m)}
                                    className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest transition-all duration-300 ${mood === m
                                        ? "bg-[var(--color-accent)] text-white"
                                        : "border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:border-[var(--color-text-dim)]"
                                        }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div
                        ref={infoRef}
                        className="flex flex-col gap-4 text-left md:text-right menu-info opacity-0 translate-y-4"
                    >
                        <span className="text-[var(--color-text-dim)] text-[10px] uppercase tracking-[0.3em] font-sans">Connect</span>
                        <div className="flex flex-col gap-2 text-2xl font-display text-[var(--color-text)]">
                            <a href="#" className="nav-link hover:text-[var(--color-accent)] transition-colors w-max md:ml-auto">Instagram</a>
                            <a href="#" className="nav-link hover:text-[var(--color-accent)] transition-colors w-max md:ml-auto">Behance</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuOverlay;
