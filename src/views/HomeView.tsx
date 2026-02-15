import React from "react";
import HeroCanvas from "../components/HeroCanvas";
import ProjectCard from "../components/ProjectCard";
import TheLab from "../components/TheLab";
import AboutCreator from "../components/AboutCreator";
import Annotations from "../components/Annotations";
import { PROJECTS } from "../data/projects";

interface HomeViewProps {
    onProjectOpen: (index: number) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onProjectOpen }) => {
    return (
        <main className="relative z-10 w-full flex flex-col items-center pb-32">
            {/* Handwritten annotations — scattered on desktop only */}
            <Annotations />

            {/* Hero — Interactive generative noise canvas */}
            <HeroCanvas />

            {/* Phase 8 — Section Header for Stories */}
            <div className="w-full max-w-7xl px-6 md:px-12 mt-32 mb-16 flex flex-col items-center">
                <h2 className="font-display text-4xl md:text-6xl text-[var(--color-accent)] -rotate-2 select-none">
                    Stories About Harry
                </h2>
                <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[var(--color-text-dim)]/40 mt-4">
                    A fragmented diary of controlled chaos
                </p>
            </div>

            {/* Render one ProjectCard per entry in the data array */}
            {PROJECTS.map((project, index) => (
                <ProjectCard
                    key={project.title}
                    project={project}
                    index={index}
                    onClick={() => onProjectOpen(index)}
                />
            ))}

            {/* Phase 3A — The Lab experiments section */}
            <TheLab />

            {/* Phase 3C — About: The Creator */}
            <AboutCreator />
        </main>
    );
};

export default HomeView;
