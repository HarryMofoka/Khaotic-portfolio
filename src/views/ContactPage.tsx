import React from "react";
import { Icon } from "@iconify/react";

const CONTACT_LINKS = [
    { label: "Email", value: "mofokaharry@gmail.com", icon: "simple-icons:gmail", href: "mailto:mofokaharry@gmail.com" },
    { label: "Instagram", value: "@kalm.harry", icon: "simple-icons:instagram", href: "https://www.instagram.com/kalm.harry/" },
    { label: "GitHub", value: "harry-mofoka", icon: "simple-icons:github", href: "https://github.com/harry-mofoka" }
];

const ContactPage: React.FC = () => {
    return (
        <main className="pt-40 pb-24 px-6 md:px-12 bg-[var(--color-bg)] min-h-screen flex flex-col justify-center overflow-hidden">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
                <section>
                    <h1 className="font-display text-7xl md:text-9xl text-[var(--color-text)] uppercase leading-none mb-8">
                        The End<br />
                        <span className="text-[var(--color-accent)] italic">&</span> The<br />
                        Beginning
                    </h1>
                    <p className="font-sans text-lg md:text-2xl text-[var(--color-text-dim)] max-w-md leading-relaxed">
                        I don't predict the future. I design the chaos that leads to it. Let's build something that makes sense of the noise.
                    </p>
                </section>

                <section className="flex flex-col justify-end gap-12">
                    <div className="space-y-4">
                        <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-[var(--color-accent)] block mb-8">Initiate Contact</span>
                        <div className="flex flex-col gap-8 md:gap-12">
                            {CONTACT_LINKS.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex items-center justify-between border-b border-[var(--color-border)] pb-8 hover:border-[var(--color-accent)] transition-colors"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-mono text-[10px] uppercase text-[var(--color-text-dim)] mb-2">{link.label}</span>
                                        <span className="font-display text-2xl md:text-4xl text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">{link.value}</span>
                                    </div>
                                    <Icon icon={link.icon} className="text-4xl text-[var(--color-border)] group-hover:text-[var(--color-accent)] transition-all group-hover:rotate-12" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 flex items-center gap-4">
                        <div className="w-3 h-3 bg-[var(--color-accent)] animate-ping rounded-full" />
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-dim)]">Locating Signal: De Deur, South Africa</span>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default ContactPage;
