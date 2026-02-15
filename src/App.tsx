import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";

/* Components */
import Navbar from "./components/Navbar";
import MenuOverlay from "./components/MenuOverlay";
import CustomCursor from "./components/CustomCursor";
import NoiseOverlay from "./components/NoiseOverlay";
import ProjectModal from "./components/ProjectModal";
import AmbientSound from "./components/AmbientSound";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

/* Views */
import HomeView from "./views/HomeView";
import WorkPage from "./views/WorkPage";
import LabPage from "./views/LabPage";
import AboutPage from "./views/AboutPage";
import ContactPage from "./views/ContactPage";

/**
 * ScrollToTop Component — Resets window scroll position on every route change.
 * Essential for the 'multi-page' feel in an SPA.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const App: React.FC = () => {
    /* -------------------------------------------------------------------------
     * State
     * ----------------------------------------------------------------------- */
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    /* -------------------------------------------------------------------------
     * Smooth Scroll (Lenis)
     * ----------------------------------------------------------------------- */
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        lenisRef.current = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time: number) {
            lenisRef.current?.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenisRef.current?.destroy();
        };
    }, []);

    // Stop/Start scroll based on overlay states
    useEffect(() => {
        if (isMenuOpen || isModalVisible) {
            lenisRef.current?.stop();
        } else {
            lenisRef.current?.start();
        }
    }, [isMenuOpen, isModalVisible]);

    /* -------------------------------------------------------------------------
     * Handlers
     * ----------------------------------------------------------------------- */
    const handleLoaderComplete = useCallback(() => {
        setIsLoaded(true);
        // Reveal Navbar after loader completes
        gsap.to("#nav-pill", {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out",
            delay: 0.2
        });
    }, []);

    const handleProjectOpen = useCallback((index: number) => {
        setSelectedProjectIndex(index);
        setIsModalVisible(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setIsModalVisible(false);
        setTimeout(() => setSelectedProjectIndex(null), 800);
    }, []);

    const handleMenuToggle = useCallback(() => {
        setIsMenuOpen((prev) => !prev);
    }, []);

    const handleMenuClose = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    /* -------------------------------------------------------------------------
     * Render
     * ----------------------------------------------------------------------- */
    return (
        <div className="w-full min-h-screen cursor-none font-sans antialiased selection:bg-[var(--color-accent)] selection:text-white bg-[var(--color-bg)] text-[var(--color-text)] overflow-x-hidden">
            <ScrollToTop />

            {/* Global Distortion Overlay — static noise layer */}
            <NoiseOverlay />

            {/* Custom Interactive Cursor */}
            <CustomCursor />

            {/* Ambient Soundscape Controller */}
            <AmbientSound />

            {/* Navigation Bar */}
            <Navbar isMenuOpen={isMenuOpen} onMenuToggle={handleMenuToggle} />

            {/* Fullscreen Menu Overlay */}
            <MenuOverlay
                isOpen={isMenuOpen}
                onClose={handleMenuClose}
            />

            {/* Intro Loader */}
            <Loader onComplete={handleLoaderComplete} />

            {/* Page Transitions & Content — only show if loaded */}
            <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <Routes>
                    <Route path="/" element={<HomeView onProjectOpen={handleProjectOpen} />} />
                    <Route path="/work" element={<WorkPage />} />
                    <Route path="/lab" element={<LabPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
            </div>

            {/* Global Project Detail Modal — renders over any page */}
            <ProjectModal
                isVisible={isModalVisible}
                projectIndex={selectedProjectIndex}
                onClose={handleModalClose}
            />

            {/* Global Footer */}
            <Footer />
        </div>
    );
};

export default App;
