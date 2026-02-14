/* ==========================================================================
 * NoiseOverlay Component
 * ==========================================================================
 * Renders a fixed, full-viewport SVG noise texture over the entire page.
 *
 * Purpose:
 *   Adds a subtle film-grain / analog feel to the portfolio. The noise is
 *   purely decorative — `pointer-events: none` ensures it never interferes
 *   with user interactions.
 *
 * Implementation:
 *   Uses the `.noise-overlay` CSS class defined in `index.css` which embeds
 *   an inline SVG fractalNoise filter as a `background-image` data URI.
 *   The opacity is set very low (6%) so it's a barely-visible texture.
 * ========================================================================== */

import React from "react";

/**
 * NoiseOverlay — A decorative full-screen film-grain texture.
 *
 * This component has no props, no state, and no side effects.
 * It's a pure presentational component that simply renders a <div>
 * with the `.noise-overlay` class.
 */
const NoiseOverlay: React.FC = () => {
    return <div className="noise-overlay" />;
};

export default NoiseOverlay;
