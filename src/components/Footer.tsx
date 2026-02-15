import React, { useRef, useEffect } from "react";
import gsap from "gsap";

/**
 * Footer — Page footer with CTA, contact details, and copyright.
 * Enhanced with a magnetic CTA interaction (Phase 5A).
 */
const Footer: React.FC = () => {
    const ctaRef = useRef<HTMLHeadingElement>(null);
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const cta = ctaRef.current;
        if (!cta) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = cta.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;

            /* Calculate distance from center (magnetic pull) */
            const dx = clientX - centerX;
            const dy = clientY - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 400) {
                /* Pull factor: closer = stronger */
                const pullX = dx * 0.15;
                const pullY = dy * 0.15;

                gsap.to(cta, {
                    x: pullX,
                    y: pullY,
                    rotate: 2 + pullX * 0.05,
                    duration: 0.6,
                    ease: "power2.out",
                });
            } else {
                /* Return to original position */
                gsap.to(cta, {
                    x: 0,
                    y: 0,
                    rotate: 2,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.3)",
                });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer
            ref={containerRef}
            className="relative z-10 w-full px-6 md:px-12 pb-12 pt-32 mt-0 border-t border-white/5 overflow-hidden"
        >
            {/* ---- Large CTA Heading (Magnetic) ---- */}
            <div className="flex flex-col gap-8 mb-40 items-center text-center">
                <h2
                    ref={ctaRef}
                    onClick={scrollToTop}
                    className="font-display text-[8vw] md:text-[6vw] leading-[1.1] text-white hover:text-white/80 transition-colors duration-500 cursor-pointer nav-link select-none"
                    style={{ transform: "rotate(2deg)" }}
                >
                    We make
                    <br />
                    <span className="text-[#FF3D00] inline-block hover:scale-110 transition-transform duration-500">
                        Art.
                    </span>
                </h2>
                <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-white/20 mt-4">
                    Click to restart the loop
                </p>
            </div>

            {/* ---- Bottom Info Grid ---- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 text-[10px] tracking-widest uppercase font-sans border-t border-white/5 pt-12">
                {/* Column 1: Contact */}
                <div className="flex flex-col gap-4">
                    <span className="text-white/30">Get in touch</span>
                    <a
                        href="mailto:hello@harrymofoka.com"
                        className="text-white hover:text-[#FF3D00] transition-colors nav-link flex items-center gap-2 w-max font-medium"
                    >
                        hello@harrymofoka.com
                    </a>
                </div>

                {/* Column 2: Socials */}
                <div className="flex flex-col gap-4">
                    <span className="text-white/30">Connect</span>
                    <div className="flex flex-col gap-2 text-white">
                        <a
                            href="#"
                            className="hover:text-[#FF3D00] transition-colors nav-link w-max font-medium"
                        >
                            Instagram
                        </a>
                        <a
                            href="#"
                            className="hover:text-[#FF3D00] transition-colors nav-link w-max font-medium"
                        >
                            Behance
                        </a>
                    </div>
                </div>

                {/* Column 3: Studio */}
                <div className="flex flex-col gap-4">
                    <span className="text-white/30">Studio</span>
                    <span className="text-white font-medium">Pretoria, ZA</span>
                </div>

                {/* Column 4: Copyright */}
                <div className="flex flex-col justify-end md:items-end gap-1">
                    <span className="text-white/20">© 2024 Harry Mofoka</span>
                    <span className="text-[8px] text-white/10 lowercase">
                        Built with chaos.
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
