import React from "react";
import AboutCreator from "../components/AboutCreator";

const AboutPage: React.FC = () => {
    return (
        <main className="relative z-10 w-full min-h-screen pt-40 pb-32">
            <div className="w-full max-w-7xl px-6 md:px-12 mx-auto mb-16">
                <h1 className="font-display text-6xl md:text-9xl text-[var(--color-text)] -rotate-1">
                    The <span className="text-[var(--color-accent)]">Creator</span>
                </h1>
                <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[var(--color-text-dim)]/40 mt-8">
                    More than just pixels and code.
                </p>
            </div>

            <AboutCreator />

            <div className="w-full max-w-3xl px-6 md:px-12 mx-auto mt-24 text-[var(--color-text-dim)] font-sans leading-relaxed flex flex-col gap-8">
                <p className="text-lg text-[var(--color-text)] font-medium">
                    "Chaos isn't a mess; it's an opportunity for complexity that logic doesn't understand yet."
                </p>
                <p>
                    I started this journey with a curiosity for how things break—and how they look when they do. Over time, that morphed into a design philosophy I call <strong>KHAOTIC</strong>. It's about finding the friction between perfection and reality.
                </p>
                <p>
                    Whether I'm deep in a React component or pushing pixels in Figma, I'm always looking for that one detail that feels a little 'off' in the right way. That's where the magic lives.
                </p>
            </div>
        </main>
    );
};

export default AboutPage;
