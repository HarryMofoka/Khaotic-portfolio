/* ==========================================================================
 * Footer Component
 * ==========================================================================
 * The site footer containing a bold CTA heading, contact info, socials,
 * studio location, and copyright notice.
 *
 * Layout:
 *   ┌────────────────────────────────────────┐
 *   │  "We make Art." — Large CTA heading     │
 *   ├────────────────────────────────────────┤
 *   │  4-column grid:                         │
 *   │    Contact | Socials | Studio | ©       │
 *   └────────────────────────────────────────┘
 *
 * Design Notes:
 *   • The "Art." word is rendered in the accent colour (#FF3D00).
 *   • The CTA heading uses `font-display` (Rock Salt) with a slight
 *     rotation for brand consistency.
 *   • The 4-column grid collapses to a single column on mobile.
 *
 * This component is purely presentational with no state or side effects.
 * ========================================================================== */

import React from "react";

/**
 * Footer — Page footer with CTA, contact details, and copyright.
 */
const Footer: React.FC = () => {
    return (
        <footer className="relative z-10 w-full px-6 md:px-12 pb-12 pt-24 mt-0 border-t border-white/10">
            {/* ---- Large CTA Heading ---- */}
            <div className="flex flex-col gap-8 mb-32 items-center text-center">
                <h2 className="font-display text-[7vw] leading-[1.2] text-white hover:text-white/50 transition-all duration-500 cursor-pointer nav-link rotate-2">
                    We make
                    <br />
                    <span className="text-[#FF3D00]">Art.</span>
                </h2>
            </div>

            {/* ---- Bottom Info Grid ---- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 text-xs tracking-widest uppercase font-sans border-t border-white/10 pt-8">
                {/* Column 1: Contact */}
                <div className="flex flex-col gap-4">
                    <span className="text-secondary">Contact</span>
                    <a
                        href="mailto:contact@khaotic.com"
                        className="text-white hover:text-[#FF3D00] transition-colors nav-link flex items-center gap-2 w-max font-semibold"
                    >
                        contact@khaotic.com
                    </a>
                </div>

                {/* Column 2: Socials */}
                <div className="flex flex-col gap-4">
                    <span className="text-secondary">Socials</span>
                    <div className="flex flex-col gap-2 text-white">
                        <a
                            href="#"
                            className="hover:text-[#FF3D00] transition-colors nav-link w-max font-semibold"
                        >
                            Instagram
                        </a>
                        <a
                            href="#"
                            className="hover:text-[#FF3D00] transition-colors nav-link w-max font-semibold"
                        >
                            Twitter / X
                        </a>
                    </div>
                </div>

                {/* Column 3: Studio Location */}
                <div className="flex flex-col gap-4">
                    <span className="text-secondary">Studio</span>
                    <span className="text-white font-semibold">South Africa</span>
                </div>

                {/* Column 4: Copyright */}
                <div className="flex flex-col justify-end md:items-end gap-4">
                    <span className="text-secondary">© 2024 Khaotic</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
