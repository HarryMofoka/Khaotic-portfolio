import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { useMood, MOODS } from "../context/MoodContext";
import { Icon } from "@iconify/react";

/** Navigation link labels and paths */
const MENU_ITEMS = [
    { label: "Index", path: "/" },
    { label: "Work", path: "/work" },
    { label: "Lab", path: "/lab" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" }
];

interface MenuOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose }) => {
    const { mood, setMood } = useMood();
    const overlayRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

    /* -------------------------------------------------------------------------
     * GSAP Entrance / Exit Animations
     * ----------------------------------------------------------------------- */
    useEffect(() => {
        if (!overlayRef.current) return;

        if (isOpen) {
            const tl = gsap.timeline();
            tl.set(overlayRef.current, { visibility: "visible", display: "flex" })
                .to(overlayRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" })
                .fromTo(menuItemsRef.current.filter(Boolean),
                    { y: 50, opacity: 0, rotateX: 20 },
                    { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.1, ease: "power4.out" },
                    "-=0.3"
                );
        } else {
            gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => {
                    if (overlayRef.current) {
                        overlayRef.current.style.visibility = "hidden";
                        overlayRef.current.style.display = "none";
                    }
                }
            });
        }
    }, [isOpen]);

    /* -------------------------------------------------------------------------
     * Magnetic Effect for Links — Subtle pull toward cursor
     * ----------------------------------------------------------------------- */
    const handleMouseMove = useCallback((e: React.MouseEvent, index: number) => {
        const el = menuItemsRef.current[index];
        if (!el) return;

        const { left, top, width, height } = el.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const deltaX = (e.clientX - centerX) * 0.3;
        const deltaY = (e.clientY - centerY) * 0.3;

        gsap.to(el, {
            x: deltaX,
            y: deltaY,
            duration: 0.4,
            ease: "power2.out"
        });
    }, []);

    const handleMouseLeave = useCallback((index: number) => {
        const el = menuItemsRef.current[index];
        if (el) {
            gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
        }
    }, []);

    const handleLinkClick = () => {
        onClose();
    };

    return (
        <div
            ref={overlayRef}
            className={`fixed inset-0 z-[100] bg-[var(--color-bg)]/98 backdrop-blur-3xl flex flex-col overflow-hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none opacity-0 invisible'}`}
        >
            {/* Close Button - Explicit Toggle */}
            <button
                onClick={onClose}
                className="absolute top-8 right-8 z-[110] p-4 group flex items-center gap-2 hover:text-[var(--color-accent)] transition-colors"
                aria-label="Close Menu"
            >
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Close</span>
                <Icon icon="lucide:x" className="text-3xl rotate-0 group-hover:rotate-90 transition-transform duration-500" />
            </button>

            {/* Scrollable Content Area */}
            <div
                ref={scrollContainerRef}
                className="flex-1 w-full overflow-y-auto overflow-x-hidden pt-32 pb-48 px-6 md:px-24 scrollbar-hide"
            >
                <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-start">

                    {/* Navigation Links */}
                    <div className="flex flex-col gap-6 md:gap-10 items-start w-full md:w-auto">
                        {MENU_ITEMS.map((item, i) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                ref={(el) => {
                                    if (el) menuItemsRef.current[i] = el as unknown as HTMLAnchorElement;
                                }}
                                onMouseMove={(e) => handleMouseMove(e, i)}
                                onMouseLeave={() => handleMouseLeave(i)}
                                onClick={handleLinkClick}
                                className="group relative block"
                            >
                                <div className="flex items-baseline gap-6">
                                    <span className="font-mono text-[10px] md:text-sm text-[var(--color-accent)] opacity-20 group-hover:opacity-100 transition-opacity translate-y-[-20%] md:translate-y-[-40%]">
                                        0{i + 1}
                                    </span>
                                    <span className="font-display text-6xl md:text-8xl lg:text-9xl text-[var(--color-text)] hover:text-[var(--color-accent)] transition-all duration-500 uppercase leading-[0.8] select-none hover:tracking-widest">
                                        {item.label}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Meta Info - Displays next to links on desktop, below on mobile */}
                    <div className="flex flex-col gap-12 mt-12 md:mt-0 md:ml-auto md:text-right w-full md:w-auto">
                        {/* Social Links */}
                        <div className="flex flex-col gap-4">
                            <span className="font-sans text-[10px] uppercase tracking-widest text-[var(--color-accent)]">Manifesto</span>
                            <div className="flex gap-6 justify-start md:justify-end">
                                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-[var(--color-text-dim)] hover:text-[var(--color-accent)] transition-colors">
                                    <Icon icon="lucide:instagram" width={24} />
                                </a>
                                <a href="https://behance.net" target="_blank" rel="noreferrer" className="text-[var(--color-text-dim)] hover:text-[var(--color-accent)] transition-colors">
                                    <Icon icon="lucide:behance" width={24} />
                                </a>
                                <a href="https://github.com" target="_blank" rel="noreferrer" className="text-[var(--color-text-dim)] hover:text-[var(--color-accent)] transition-colors">
                                    <Icon icon="lucide:github" width={24} />
                                </a>
                            </div>
                        </div>

                        {/* Mood Switcher */}
                        <div className="flex flex-col gap-4">
                            <span className="font-sans text-[10px] uppercase tracking-widest text-[var(--color-accent)]">Vibe Check</span>
                            <div className="flex flex-wrap md:justify-end gap-3 max-w-sm ml-auto relative z-[120]">
                                {MOODS.map((m) => (
                                    <button
                                        key={m}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMood(m);
                                        }}
                                        className={`px-4 py-1.5 border rounded-full text-[10px] uppercase tracking-widest font-mono transition-all pointer-events-auto ${mood === m
                                            ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-black font-bold"
                                            : "border-[var(--color-border)] text-[var(--color-text-dim)] hover:border-[var(--color-text)] hover:text-[var(--color-text)]"
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Texture Overlay - Non-blocking */}
            <div className="absolute inset-0 pointer-events-none bg-noise opacity-[0.03]" />
        </div>
    );
};

export default MenuOverlay;
