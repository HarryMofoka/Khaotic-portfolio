/* ==========================================================================
 * useTheme Hook — Light / Dark Mode Toggle
 * ==========================================================================
 * Manages the current colour-mode by toggling the `light-mode` class on
 * `document.body`.  All light-mode colour overrides are handled via CSS
 * rules in `index.css` that target `body.light-mode`.
 *
 * The hook exposes:
 *   • isLight  — boolean indicating the current mode
 *   • toggle() — function to swap between modes
 *
 * Usage:
 *   const { isLight, toggle } = useTheme();
 *   <button onClick={toggle}>{isLight ? '🌙' : '☀️'}</button>
 * ========================================================================== */

import { useState, useCallback } from "react";

/**
 * useTheme — Toggles the `light-mode` class on `document.body`.
 *
 * @returns `isLight` boolean state and a `toggle` function.
 */
export function useTheme() {
    const [isLight, setIsLight] = useState(false);

    /**
     * toggle — Swap between dark and light themes.
     * Uses `useCallback` so the reference is stable for event handlers.
     */
    const toggle = useCallback(() => {
        document.body.classList.toggle("light-mode");
        setIsLight((prev) => !prev);
    }, []);

    return { isLight, toggle };
}
