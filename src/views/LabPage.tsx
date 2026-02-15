import React from "react";
import TheLab from "../components/TheLab";

const LabPage: React.FC = () => {
    return (
        <main className="pt-32 pb-24 px-6 md:px-12 bg-[var(--color-bg)] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <header className="mb-24">
                    <h1 className="font-display text-7xl md:text-9xl text-[var(--color-text)] uppercase leading-none opacity-10 blur-[0.5px] select-none">
                        Experiments
                    </h1>
                    <div className="mt-4 flex items-center gap-4">
                        <span className="w-12 h-px bg-[var(--color-accent)]" />
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
                            Zone 02: Digital Playground
                        </span>
                    </div>
                </header>

                {/* Main Lab Content */}
                <TheLab />

                {/* Experimental Grid - Future Content Stubs */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-square border border-[var(--color-border)] rounded-lg flex flex-col items-center justify-center p-8 group hover:border-[var(--color-accent)] transition-all duration-500 overflow-hidden relative">
                            <div className="absolute inset-0 bg-[var(--color-accent)] opacity-0 group-hover:opacity-5 transition-opacity duration-700" />
                            <span className="font-display text-4xl text-[var(--color-text-dim)] group-hover:text-[var(--color-accent)] transition-colors duration-500">?</span>
                            <span className="mt-4 font-mono text-[10px] uppercase tracking-widest text-[var(--color-border)] group-hover:text-[var(--color-accent)] group-hover:blur-[0.5px] transition-all">Coming Soon</span>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default LabPage;
