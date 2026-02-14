/* ==========================================================================
 * Entry Point — main.tsx
 * ==========================================================================
 * This is the application bootstrap file. It:
 *   1. Imports the global CSS (TailwindCSS + custom styles)
 *   2. Creates the React root
 *   3. Renders the <App /> component into the #root DOM element
 *
 * React 19 uses `createRoot` from 'react-dom/client' (concurrent mode).
 * StrictMode is enabled for development-time warnings and double-render
 * checks (has no effect in production builds).
 * ========================================================================== */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

/* Global styles — must be imported before any component so Tailwind
 * utilities and custom CSS classes are available throughout the app. */
import "./index.css";

/* Root application component */
import App from "./App";

/* Mount the React app into the #root element defined in index.html */
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
