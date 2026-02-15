import React from "react";
import { Icon } from "@iconify/react";

const WorkPage: React.FC = () => {
    return (
        <main className="relative z-10 w-full min-h-screen pt-40 pb-32 px-6 md:px-12 flex flex-col items-center">
            {/* Header */}
            <div className="w-full max-w-7xl mb-24">
                <h1 className="font-display text-6xl md:text-9xl text-[var(--color-text)] -rotate-1">
                    The Grind & <br />
                    <span className="text-[var(--color-accent)]">The Glory</span>
                </h1>
                <p className="font-sans text-xs uppercase tracking-[0.5em] text-[var(--color-text-dim)] mt-8 max-w-md leading-loose">
                    Architecting digital chaos since I found out that Ctrl+Z doesn't work in real life.
                </p>
            </div>

            {/* Experience Grid */}
            <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-12">

                {/* Current Role */}
                <div className="md:col-span-12 border-y border-[var(--color-border)] py-16 group hover:bg-[var(--color-surface)]/30 transition-colors px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex flex-col gap-4">
                        <span className="font-sans text-[10px] uppercase tracking-widest text-[var(--color-accent)]">Currently Manifesting</span>
                        <h2 className="font-display text-4xl md:text-6xl text-[var(--color-text)]">Nexlink Solutions</h2>
                        <a href="https://www.nexlinksolutionsza.co.za" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-dim)] hover:text-[var(--color-accent)] transition-colors">
                            <Icon icon="lucide:external-link" width={12} />
                            nexlinksolutionsza.co.za
                        </a>
                    </div>
                    <div className="flex flex-col gap-2 md:text-right">
                        <span className="text-2xl font-display text-[var(--color-text)]">Web & UI/UX Developer</span>
                        <p className="max-w-md md:ml-auto text-[var(--color-text-dim)] font-sans text-sm leading-relaxed">
                            Holding the South African web together with premium UI/UX, pure will, and an unhealthy amount of coffee. I turn "what if" into "holy crap it actually works."
                        </p>
                    </div>
                </div>

                {/* Education */}
                <div className="md:col-span-7 border-b border-[var(--color-border)] pb-16 flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <span className="font-sans text-[10px] uppercase tracking-widest text-[var(--color-text-dim)]">The Academic Dungeon</span>
                        <h2 className="font-display text-3xl md:text-5xl text-[var(--color-text)]">Sedibeng TVET College</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-end border-b border-[var(--color-border)] pb-2">
                            <span className="font-sans text-lg">IT & Computer Science</span>
                            <span className="font-mono text-xs opacity-40">2022 — 2026</span>
                        </div>
                        <p className="text-[var(--color-text-dim)] font-sans text-sm leading-relaxed">
                            Spent four years deciphering ancient IT scrolls and modern CS hieroglyphs. Emerged with a diploma and the realization that computers are just rocks we tricked into thinking. It was a chaotic, beautiful struggle—worth every semicolon.
                        </p>
                    </div>
                </div>

                {/* Skills/Tools Sidebar */}
                <div className="md:col-span-5 flex flex-col gap-12 bg-[var(--color-surface)] p-8 border border-[var(--color-border)] rounded-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                        <Icon icon="lucide:terminal" width={120} />
                    </div>
                    <div className="relative z-10 flex flex-col gap-8">
                        <h3 className="font-display text-2xl text-[var(--color-accent)]">Arsenal</h3>
                        <div className="flex flex-wrap gap-3">
                            {["React", "GSAP", "TypeScript", "Tailwind", "Framer", "UI/UX", "Distortion Art"].map(skill => (
                                <span key={skill} className="px-3 py-1 border border-[var(--color-border)] rounded text-[10px] uppercase tracking-widest font-mono text-[var(--color-text-dim)]">
                                    {skill}
                                </span>
                            ))}
                        </div>
                        <div className="p-4 bg-black/40 border-l-2 border-[var(--color-accent)] italic text-xs text-[var(--color-text-dim)] leading-relaxed">
                            "The code is messy, the design is chaotic, but the results are absolute. Perfection is for people who aren't having fun."
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default WorkPage;
