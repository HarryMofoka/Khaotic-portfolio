import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

/** All available mood/theme names */
export const MOODS = ["default", "midnight", "ember", "toxic", "ghost"] as const;
export type Mood = (typeof MOODS)[number];

interface MoodContextType {
    mood: Mood;
    setMood: (newMood: Mood) => void;
    cycleMood: () => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

/**
 * MoodProvider — Managed a `data-mood` attribute on `document.body`.
 * Centralizes theme state for the entire application.
 */
export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
        /* Remove data-mood attribute first to trigger clear transition if needed */
        document.body.removeAttribute("data-mood");

        /* Apply new mood */
        document.body.setAttribute("data-mood", newMood);
        localStorage.setItem("khaotic-mood", newMood);
        setMoodState(newMood);
    }, []);

    /**
     * cycleMood — Cycle through all available moods.
     */
    const cycleMood = useCallback(() => {
        setMoodState((prev) => {
            const currentIndex = MOODS.indexOf(prev);
            const nextIndex = (currentIndex + 1) % MOODS.length;
            const next = MOODS[nextIndex];

            document.body.setAttribute("data-mood", next);
            localStorage.setItem("khaotic-mood", next);
            return next;
        });
    }, []);

    /* Sync body and html attribute on mount and state change */
    useEffect(() => {
        document.documentElement.setAttribute("data-mood", mood);
        document.body.setAttribute("data-mood", mood);
    }, [mood]);

    return (
        <MoodContext.Provider value={{ mood, setMood, cycleMood }}>
            {children}
        </MoodContext.Provider>
    );
};

/**
 * useMood — Hook to consume the global mood context.
 */
export const useMood = () => {
    const context = useContext(MoodContext);
    if (!context) {
        throw new Error("useMood must be used within a MoodProvider");
    }
    return context;
};
