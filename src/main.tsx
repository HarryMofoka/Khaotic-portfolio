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

import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { MoodProvider } from "./context/MoodContext";
import App from "./App";

/* Mount the React app into the #root element defined in index.html */
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <MoodProvider>
                <App />
            </MoodProvider>
        </BrowserRouter>
    </StrictMode>
);
