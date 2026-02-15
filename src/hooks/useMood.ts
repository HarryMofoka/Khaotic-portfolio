/* ==========================================================================
 * useMood Hook — Phase 4C: Mood System (Multi-Theme)
 * ==========================================================================
 * Extends the simple light/dark toggle into a multi-mood system.
 * Each "mood" is a named theme that applies a CSS class to the body,
 * changing the entire colour palette, accent colour, and atmosphere.
 *
 * Available Moods:
 *   • "default"  — Dark mode (original Khaotic palette)
 *   • "light"    — Light mode (existing light-mode)
 *   • "midnight" — Deep blue-black with cool blue accents
 *   • "ember"    — Warm dark with amber/orange tones
 *
 * Usage:
 *   const { mood, setMood, cycleMood } = useMood();
 *   <button onClick={cycleMood}>{mood}</button>
 * ========================================================================== */

import { useState, useCallback, useEffect } from "react";

/** All available mood/theme names */
export const MOODS = ["default", "light", "midnight", "ember"] as const;
export type Mood = (typeof MOODS)[number];

/**
 * useMood — Multi-theme mood system.
 *
 * Manages a `data-mood` attribute on `document.body` and the existing
 * `light-mode` class for backward compatibility.
 */
export function useMood() {
    const [mood, setMoodState] = useState<Mood>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("khaotic-mood") as Mood;
            return MOODS.includes(saved) ? saved : "default";
        }
        return "default";
    });

    /**
     * setMood — Apply a specific mood.
     */
    const setMood = useCallback((newMood: Mood) => {
        /* Remove all mood classes + the legacy light-mode class */
        document.body.classList.remove("light-mode");
        document.body.removeAttribute("data-mood");

        if (newMood === "light") {
            document.body.classList.add("light-mode");
        }

        document.body.setAttribute("data-mood", newMood);
        localStorage.setItem("khaotic-mood", newMood);
        setMoodState(newMood);
    }, []);

    /**
     * cycleMood — Cycle through moods in order.
     */
    const cycleMood = useCallback(() => {
        setMoodState((prev) => {
            const currentIndex = MOODS.indexOf(prev);
            const nextIndex = (currentIndex + 1) % MOODS.length;
            const next = MOODS[nextIndex];

            document.body.classList.remove("light-mode");
            if (next === "light") {
                document.body.classList.add("light-mode");
            }
            document.body.setAttribute("data-mood", next);
            localStorage.setItem("khaotic-mood", next);

            return next;
        });
    }, []);

    /* Initial effect to apply mood on mount */
    useEffect(() => {
        document.body.classList.remove("light-mode");
        if (mood === "light") {
            document.body.classList.add("light-mode");
        }
        document.body.setAttribute("data-mood", mood);
    }, []);

    /** Whether current mood is a light-background mood */
    const isLight = mood === "light";

    return { mood, setMood, cycleMood, isLight };
}
