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
        title: "The De Deur Protocol",
        subtitle: "Origin Story • De Deur, SA",
        category: "Origin Story",
        techDetails: "Analog Memories • 35mm Grain",
        cardImage:
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2940&auto=format&fit=crop",
        modalImage:
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2940&auto=format&fit=crop",
        description:
            "Growing up in De Deur, South Africa, is like living in a slow-motion film where someone accidentally left the 'Vivid' filter on. The town is quiet—so quiet you can hear your own creative insecurities whispering. \n\nI started designing because the silence was too loud. I wanted to create something that broke the peace. My first 'distortion' wasn't digital; it was just me trying to draw a straight line and failing so beautifully that it became a philosophy. De Deur taught me that you don't need a skyscraper to have big thoughts, just a lot of space and a very stable internet connection (mostly).",
        credits: [
            { role: "Location", name: "De Deur, SA" },
            { role: "Instagram", name: "@kalm.harry" },
            { role: "Director", name: "Harry Mofoka" },
        ],
        rotation: "-2deg",
    },
    {
        title: "Controlled Chaos Theory",
        subtitle: "Work Philosophy • 2024",
        category: "Philosophy",
        techDetails: "Perlin Noise • Creative Instinct",
        cardImage:
            "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2940&auto=format&fit=crop",
        modalImage:
            "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2940&auto=format&fit=crop",
        description:
            "Some people plan. I paint. Not with actual paint (that's messy and my landlord would kill me), but with pixels and noise. My process is simple: I have a thought, I open a blank canvas, and I start breaking things until they look intentional. \n\nI call it 'Controlled Chaos.' It's the art of knowing exactly when to stop before the whole thing collapses. If you look closely at my work, you'll see a lot of 'happy accidents' that I've spent three hours perfecting to make them look accidental. It's a sickness, really, but it makes for great UI.",
        credits: [
            { role: "Tools", name: "React & Caffeine" },
            { role: "Process", name: "Raw Instinct" },
            { role: "Mood", name: "Aggressively Creative" },
        ],
        rotation: "1deg",
    },
    {
        title: "The Digital Nomad",
        subtitle: "Connection • Worldwide",
        category: "Socials",
        techDetails: "Fiber Optic • Global Network",
        cardImage:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2940&auto=format&fit=crop",
        modalImage:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2940&auto=format&fit=crop",
        description:
            "When I'm not in my room in De Deur breaking React components, I'm haunting the digital halls of Instagram and LinkedIn. I use Instagram to post the aesthetics (the 'Art') and LinkedIn to tell people I'm professional enough to actually finish the Art (the 'Business'). \n\nFind me on Instagram where my feed is probably more curated than my actual life, or hit me up on LinkedIn if you want to talk about how we can make something chaotic together. I'm always looking for the next 'mistake' that changes everything.",
        credits: [
            { role: "Instagram", name: "@kalm.harry" },
            { role: "LinkedIn", name: "Harry Mofoka" },
            { role: "Status", name: "Always Online" },
        ],
        rotation: "-1deg",
    },
];
