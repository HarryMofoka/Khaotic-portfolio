/* ==========================================================================
 * AmbientSound Component — Phase 4D: Opt-In Ambient Audio
 * ==========================================================================
 * A small floating toggle button that lets users opt-in to subtle ambient
 * sound. Uses the Web Audio API to generate a soft, layered drone/noise
 * that enhances the immersive "khaotic" atmosphere.
 *
 * The sound is procedurally generated (no audio files needed):
 *   - A low-frequency oscillator (bass drone)
 *   - Filtered brown noise (atmospheric hiss)
 *   - Volume envelope for smooth fade-in/out
 *
 * Respects user preference — audio never auto-plays.
 * ========================================================================== */

import React, { useRef, useState, useCallback, useEffect } from "react";

interface AmbientSoundProps {
    /** Whether the menu overlay is currently open */
    isMenuOpen?: boolean;
}

/**
 * AmbientSound — Opt-in ambient audio toggle.
 */
const AmbientSound: React.FC<AmbientSoundProps> = ({ isMenuOpen = false }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const gainRef = useRef<GainNode | null>(null);

    /* Refs for filters and gain stages to allow real-time modulation */
    const filterRef = useRef<BiquadFilterNode | null>(null);
    const oscGainRef = useRef<GainNode | null>(null);
    const osc2GainRef = useRef<GainNode | null>(null);

    /* -------------------------------------------------------------------------
     * createAmbientAudio — Builds the audio graph on first play.
     * ----------------------------------------------------------------------- */
    const createAmbientAudio = useCallback(() => {
        const ctx = new AudioContext();
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0;
        masterGain.connect(ctx.destination);

        /* Low drone oscillator */
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 55; // A1 — deep bass
        const oscGain = ctx.createGain();
        oscGain.gain.value = 0.08;
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        oscGainRef.current = oscGain;

        /* Second harmonic for warmth */
        const osc2 = ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.value = 82.5; // E2
        const osc2Gain = ctx.createGain();
        osc2Gain.gain.value = 0.04;
        osc2.connect(osc2Gain);
        osc2Gain.connect(masterGain);
        osc2.start();
        osc2GainRef.current = osc2Gain;

        /* Brown noise — filtered white noise */
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5; // boost
        }
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = "lowpass";
        noiseFilter.frequency.value = 200;
        filterRef.current = noiseFilter;

        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0.06;

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);
        noiseSource.start();

        audioCtxRef.current = ctx;
        gainRef.current = masterGain;

        return { ctx, masterGain };
    }, []);

    /* -------------------------------------------------------------------------
     * Effect: Audio Muffling (Menu Interaction)
     * When the menu is open, we lower the cut-off frequency and dim the drones.
     * ----------------------------------------------------------------------- */
    useEffect(() => {
        if (!isPlaying || !audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const filter = filterRef.current;
        const og1 = oscGainRef.current;
        const og2 = osc2GainRef.current;

        if (isMenuOpen) {
            /* Muffled State */
            filter?.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.8);
            og1?.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.8);
            og2?.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.8);
        } else {
            /* Normal State */
            filter?.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.8);
            og1?.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.8);
            og2?.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.8);
        }
    }, [isMenuOpen, isPlaying]);

    /* -------------------------------------------------------------------------
     * toggleSound — Start or stop the ambient audio with a smooth fade.
     * ----------------------------------------------------------------------- */
    const toggleSound = useCallback(() => {
        if (isPlaying) {
            /* Fade out and suspend */
            const gain = gainRef.current;
            const ctx = audioCtxRef.current;
            if (gain && ctx) {
                gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
                setTimeout(() => ctx.suspend(), 600);
            }
            setIsPlaying(false);
        } else {
            if (!audioCtxRef.current) {
                /* First play — create audio graph */
                const { ctx, masterGain } = createAmbientAudio();
                masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5);
            } else {
                /* Resume existing context */
                const ctx = audioCtxRef.current;
                const gain = gainRef.current;
                ctx.resume();
                if (gain) {
                    gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5);
                }
            }
            setIsPlaying(true);
        }
    }, [isPlaying, createAmbientAudio]);

    return (
        <button
            onClick={toggleSound}
            className="fixed bottom-6 right-6 z-[60] w-10 h-10 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/40 hover:text-[#FF3D00] hover:border-[#FF3D00]/30 transition-all duration-300 nav-link"
            title={isPlaying ? "Mute ambient sound" : "Play ambient sound"}
            aria-label={isPlaying ? "Mute ambient sound" : "Play ambient sound"}
        >
            {isPlaying ? (
                /* Sound wave icon */
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
            ) : (
                /* Muted icon */
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
            )}
        </button>
    );
};

export default AmbientSound;
