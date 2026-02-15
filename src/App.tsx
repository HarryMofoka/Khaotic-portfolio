/* ==========================================================================
 * App Component — Root of the KHAOTIC Portfolio
 * ==========================================================================
 * This is the top-level component that orchestrates the entire application.
 *
 * Architecture Overview:
 *   ┌───────────────────────────────────────────────────────┐
 *   │  App                                                  │
 *   │  ├─ SVG Warp Filter (defs — used by background orbs) │
 *   │  ├─ Background Atmospheric Orbs                       │
 *   │  ├─ NoiseOverlay (decorative film grain)              │
 *   │  ├─ CustomCursor (mouse follower)                     │
 *   │  ├─ Loader (intro loading screen)                     │
 *   │  ├─ Navbar (fixed top pill)                           │
 *   │  ├─ MenuOverlay (fullscreen nav)                      │
 *   │  ├─ <main>                                            │
 *   │  │   ├─ Annotations (scattered handwritten notes)      │
 *   │  │   ├─ HeroCanvas (generative noise field)           │
 *   │  │   ├─ Project Cards feed                            │
 *   │  │   ├─ TheLab (experiments section)                  │
 *   │  │   └─ AboutCreator ("The Creator" section)          │
 *   │  ├─ Footer                                            │
 *   │  └─ ProjectModal (detail view)                        │
 *   └───────────────────────────────────────────────────────┘
 *
 * State Management:
 *   • `isMenuOpen`       — Controls the fullscreen menu overlay visibility.
 *   • `selectedProject`  — Index of the project opened in the modal, or
 *                          `null` when the modal is closed.
 *
 * Hooks:
 *   • `useLenis`  — Initialises smooth scroll; exposes start/stop controls.
 *   • `useTheme`  — Manages light/dark mode toggle.
 *
 * GSAP Intro Animation:
 *   After the `Loader` completes, `handleLoaderComplete` is called which:
 *     1. Starts Lenis smooth scrolling
 *     2. Removes the `overflow: hidden` from the body
 *     3. Animates the navbar pill sliding in from above
 *     4. Staggers the project cards in from below with rotation
 * ========================================================================== */

import React, { useState, useCallback } from "react";
import gsap from "gsap";

/* ---- Components ---- */
import NoiseOverlay from "./components/NoiseOverlay";
import CustomCursor from "./components/CustomCursor";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import MenuOverlay from "./components/MenuOverlay";
import ProjectCard from "./components/ProjectCard";
import ProjectModal from "./components/ProjectModal";
import Footer from "./components/Footer";
import HeroCanvas from "./components/HeroCanvas";
import TheLab from "./components/TheLab";
import Annotations from "./components/Annotations";
import AboutCreator from "./components/AboutCreator";

/* ---- Hooks ---- */
import { useLenis } from "./hooks/useLenis";
import AmbientSound from "./components/AmbientSound";

/* ---- Data ---- */
import { PROJECTS } from "./data/projects";

/**
 * App — The root component that composes all sections of the portfolio.
 */
const App: React.FC = () => {
    /* -----------------------------------------------------------------------
     * Hooks
     * --------------------------------------------------------------------- */

    /**
     * useLenis — Smooth scroll manager.
     * `autoStart: false` keeps scroll paused until the loader finishes.
     * We call `lenisRef.current.start()` in `handleLoaderComplete`.
     */
    const { lenisRef } = useLenis(false);



    /* -----------------------------------------------------------------------
     * State
     * --------------------------------------------------------------------- */

    /** Whether the fullscreen navigation menu overlay is visible */
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    /** Index of the currently selected project for the modal, or null */
    const [selectedProject, setSelectedProject] = useState<number | null>(null);

    /* -----------------------------------------------------------------------
     * Handlers
     * --------------------------------------------------------------------- */

    /**
     * handleLoaderComplete — Called when the Loader's exit animation finishes.
     *
     * Responsibilities:
     *   1. Re-enable Lenis smooth scrolling
     *   2. Remove the body overflow lock
     *   3. Play the intro GSAP timeline:
     *      a. Navbar pill slides in from above
     *      b. Project cards stagger in from below with a slight rotation
     */
    const handleLoaderComplete = useCallback(() => {
        /* Start smooth scrolling */
        lenisRef.current?.start();
        document.body.style.overflow = "auto";
        document.body.classList.add("ready");

        /* Intro animation timeline */
        const tl = gsap.timeline();

        /* Animate navbar pill in */
        tl.to("#nav-pill", {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
        });

        /* Animate project cards in with stagger */
        tl.from(
            ".project-wrapper",
            {
                y: 100,
                opacity: 0,
                rotate: 5,
                duration: 1.2,
                stagger: 0.15,
                ease: "power3.out",
            },
            "-=1.0" // overlap with the navbar animation by 1 second
        );
    }, [lenisRef]);

    /**
     * handleMenuToggle — Opens or closes the fullscreen menu overlay.
     *
     * When opening:  Pauses Lenis scrolling.
     * When closing:  Resumes Lenis scrolling.
     */
    const handleMenuToggle = useCallback(() => {
        setIsMenuOpen((prev) => {
            const willOpen = !prev;
            if (willOpen) {
                lenisRef.current?.stop();
            } else {
                lenisRef.current?.start();
            }
            return willOpen;
        });
    }, [lenisRef]);

    /**
     * handleMenuClose — Explicitly closes the menu (used by MenuOverlay links).
     */
    const handleMenuClose = useCallback(() => {
        setIsMenuOpen(false);
        lenisRef.current?.start();
    }, [lenisRef]);

    /**
     * handleProjectOpen — Opens the project modal for the given index.
     * Pauses Lenis scrolling while the modal is active.
     */
    const handleProjectOpen = useCallback(
        (index: number) => {
            setSelectedProject(index);
            lenisRef.current?.stop();
        },
        [lenisRef]
    );

    /**
     * handleProjectClose — Closes the project modal and resumes scrolling.
     */
    const handleProjectClose = useCallback(() => {
        setSelectedProject(null);
        lenisRef.current?.start();
    }, [lenisRef]);

    /* -----------------------------------------------------------------------
     * Render
     * --------------------------------------------------------------------- */
    return (
        <div className="w-full min-h-screen cursor-none font-sans antialiased selection:bg-[#FF3D00] selection:text-white bg-black">
            {/* ================================================================
       * SVG Filter Definitions
       * ================================================================
       * This hidden SVG defines the `warpFilter` used by the background
       * atmospheric orbs to create a wavy, organic distortion effect.
       * The filter uses fractal noise fed into a displacement map.
       * ============================================================== */}
            <svg className="hidden">
                <defs>
                    <filter id="warpFilter">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.005"
                            numOctaves={2}
                            seed={2}
                            result="noise"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale={100}
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                </defs>
            </svg>

            {/* ================================================================
       * Background Atmospheric Orbs
       * ================================================================
       * Two large, blurred circles that slowly animate (blob keyframes)
       * behind all content. They pass through the SVG warp filter to
       * create an organic, ever-shifting background atmosphere.
       * ============================================================== */}
            <div
                className="fixed inset-0 overflow-hidden pointer-events-none z-0"
                style={{ filter: "url(#warpFilter)", transform: "scale(1.1)" }}
            >
                {/* Orange orb — top-left */}
                <div className="orb w-[50vw] h-[50vw] bg-[#FF3D00] top-[-20%] left-[-10%] opacity-[0.08] animate-blob rounded-full absolute filter blur-[100px]" />
                {/* White orb — bottom-right, delayed animation */}
                <div
                    className="orb w-[60vw] h-[60vw] bg-white bottom-[-10%] right-[-10%] opacity-[0.05] animate-blob rounded-full absolute filter blur-[100px]"
                    style={{ animationDelay: "-5s" }}
                />
            </div>

            {/* ================================================================
       * Global Overlays & UI
       * ============================================================== */}
            <NoiseOverlay />
            <CustomCursor />
            <Loader onComplete={handleLoaderComplete} />

            {/* ================================================================
       * Navigation
       * ============================================================== */}
            <Navbar
                isMenuOpen={isMenuOpen}
                onMenuToggle={handleMenuToggle}
            />
            <MenuOverlay isOpen={isMenuOpen} onClose={handleMenuClose} />

            {/* ================================================================
       * Main Content — Project Cards Feed
       * ================================================================
       * A vertical feed of film-style project cards. The top spacer
       * (30-40vh) pushes the first card below the viewport top so the
       * navbar has room.
       * ============================================================== */}
            <main className="relative z-10 w-full flex flex-col items-center pb-32">
                {/* Handwritten annotations — scattered on desktop only */}
                <Annotations />

                {/* Hero — Interactive generative noise canvas */}
                <HeroCanvas />

                {/* Phase 8 — Section Header for Stories */}
                <div className="w-full max-w-7xl px-6 md:px-12 mt-32 mb-16 flex flex-col items-center">
                    <h2 className="font-display text-4xl md:text-6xl text-[var(--color-accent)] -rotate-2 select-none">
                        Stories About Harry
                    </h2>
                    <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[var(--color-text-dim)]/40 mt-4">
                        A fragmented diary of controlled chaos
                    </p>
                </div>

                {/* Render one ProjectCard per entry in the data array */}
                {PROJECTS.map((project, index) => (
                    <ProjectCard
                        key={project.title}
                        project={project}
                        index={index}
                        onClick={() => handleProjectOpen(index)}
                    />
                ))}

                {/* Phase 3A — The Lab experiments section */}
                <TheLab />

                {/* Phase 3C — About: The Creator */}
                <AboutCreator />
            </main>

            {/* ================================================================
       * Footer
       * ============================================================== */}
            <Footer />

            {/* ================================================================
       * Project Detail Modal
       * ================================================================
       * Rendered at the end of the DOM tree so it layers on top of
       * everything. When `selectedProject` is null, the modal is hidden.
       * ============================================================== */}
            <ProjectModal
                project={
                    selectedProject !== null ? PROJECTS[selectedProject] : null
                }
                onClose={handleProjectClose}
            />

            {/* Phase 4D — Ambient Sound Toggle */}
            <AmbientSound isMenuOpen={isMenuOpen} />
        </div>
    );
};

export default App;
