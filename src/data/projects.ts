/* ==========================================================================
 * Project Data — KHAOTIC Portfolio
 * ==========================================================================
 * All portfolio project entries live here as a single typed array.
 * This acts as a mock data layer — in production you might fetch from a CMS
 * or API, but the shape stays the same thanks to the `Project` interface.
 * ========================================================================== */

import type { Project } from "../types";

/**
 * PROJECTS — Static array of portfolio entries.
 *
 * Each entry contains:
 *   • Card-level info  → title, category, techDetails, cardImage, rotation
 *   • Modal-level info → subtitle, modalImage, description, credits
 *
 * The `rotation` string is applied directly via inline `style` on the card
 * to give each one a unique tilted film-still aesthetic.
 */
export const PROJECTS: Project[] = [
    {
        title: "Geekin' MV",
        subtitle: "Director's Cut • 2023",
        category: "Director's Cut",
        techDetails: "Sony Venice 2 • Anamorphic",
        cardImage:
            "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg",
        modalImage:
            "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=3270&auto=format&fit=crop",
        description:
            "We aimed to visualize the auditory distortion through physical means. Instead of relying solely on post-production VFX, we constructed a rig of shattered mirrors and prisms attached to a motion-control arm. The 'Rock Salt' aesthetic of the typography in the video was physically written on acetate and scanned in, layering the digital with the analog.",
        credits: [
            { role: "Director", name: "Sarah Vae" },
            { role: "DoP", name: "Marcus Lin" },
            { role: "Editor", name: "Cut Masters" },
            { role: "Color", name: "Prism Labs" },
        ],
        rotation: "-2deg",
    },
    {
        title: "Chrome Hearts",
        subtitle: "Brand Campaign • 2024",
        category: "Campaign",
        techDetails: "16mm Film • Kodak 500T",
        cardImage:
            "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg",
        modalImage:
            "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2550&auto=format&fit=crop",
        description:
            "A study in texture and grain. Shot on 16mm Kodak 500T, processed with a bleach bypass to retain a high-contrast, silver-rich look. The campaign focused on the tactile nature of the jewelry, juxtaposing cold metal against soft skin and rough concrete. Hand-written notes by the designer were overlaid to create a personal diary feel.",
        credits: [
            { role: "Director", name: "Alex Ray" },
            { role: "DoP", name: "Jane Doe" },
            { role: "Set Design", name: "Build It" },
            { role: "Sound", name: "Echo Space" },
        ],
        rotation: "1deg",
    },
    {
        title: "Night Walk",
        subtitle: "Editorial • 2023",
        category: "Editorial",
        techDetails: "Digital • Natural Light",
        cardImage:
            "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2874&auto=format&fit=crop",
        modalImage:
            "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2874&auto=format&fit=crop",
        description:
            "Tokyo at midnight is a canvas of neon and shadow. Using the Sony Venice 2's dual ISO, we captured the city without supplemental lighting. The goal was to find the 'messy' within the organized chaos of the metropolis. The final edit moves to a erratic beat, mimicking the heartbeat of an insomniac wandering the streets.",
        credits: [
            { role: "Director", name: "K. Tanaka" },
            { role: "Photo", name: "Visuals By K" },
            { role: "Stylist", name: "Mode Noir" },
            { role: "Talent", name: "Yuki M." },
        ],
        rotation: "-1deg",
    },
];
