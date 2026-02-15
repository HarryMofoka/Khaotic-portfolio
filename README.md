# KHAOTIC — Design in Controlled Disorder

> *"Chaos isn't a mess; it's an opportunity for complexity that logic doesn't understand yet."*

An immersive, high-end digital portfolio exploring the friction between perfection and reality. Built with **React 19**, **GSAP**, and **Tailwind CSS v4**.

---

## 🌪️ The Philosophy
Khaotic represents a shift away from clinical, grid-locked design towards something more organic, analog, and raw. It celebrates the noise, the grain, and the "mistakes" that make digital work feel human. Every pixel carries intention, even when it looks accidental.

## 🛠️ Tech Stack & Ecosystem

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?style=for-the-badge&logo=greensock&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)

- **Animation Engine**: [GSAP](https://gsap.com/) + ScrollTrigger for complex choreographed motion.
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/) for high-performance inertial scrolling.
- **Routing**: [React Router v7](https://reactrouter.com/) for fluid page transitions.
- **Icons**: [Iconify](https://iconify.design/) + [Simple Icons](https://simpleicons.org/) for a professional brand look.

## ✨ Core Features

### 1. The Distortion Engine
A collection of custom GSAP-driven filters and SVG displacements that create a "shimmering" or "distorted" effect on text and imagery, breaking the static nature of the web.

### 2. Contextual Cursor System
An intelligent SVG-based cursor that adapts its shape, color, and state based on the user's interaction point (e.g., viewing a project, interacting with the lab, or selecting text).

### 3. Procedural Sensations
- **Ambient Audio**: A procedural drone system (Web Audio API) that provides a subtle, immersive soundscape.
- **Ink Trail**: A canvas-rendered fading trail that follows the cursor, inspired by analog drafting.
- **The Mood System**: A global state-driven theme engine allowing users to cycle between *Toxic*, *Ember*, *Midnight*, and *Ghost* vibes.

### 4. Projects That Breathe
Portfolio entries rendered as tilted film-stills with randomized micro-rotations, video-hover previews, and staggered parallax depth during scroll.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/HarryMofoka/Khaotic-portfolio.git
   cd Khaotic-portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Launch dev server**:
   ```bash
   npm run dev
   ```

### Production Build
To generate a production-ready bundle in the `/dist` folder:
```bash
npm run build
npm run preview
```

---

## 📁 Repository Structure
```text
src/
├── assets/         # Raw static assets (images, audio)
├── components/     # Reusable UI components (Navbar, Loader, Modals)
├── context/        # Global State (MoodContext, ScrollContext)
├── data/           # Mock data & configurations (Projects, Lab items)
├── views/          # Page-level components (Home, About, Work, Contact)
└── main.tsx        # Application Entry Point
```

---

## 📜 License & Intent
© 2026 **Harry Mofoka**. All rights reserved. 

*Designed and developed by Harry Mofoka. Built with chaos, caffeine, and intent.*
