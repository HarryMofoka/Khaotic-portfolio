/* ==========================================================================
 * Type Definitions — KHAOTIC Portfolio
 * ==========================================================================
 * Central type definitions used across the application. Keeping types in a
 * single barrel file ensures consistency and easy imports.
 * ========================================================================== */

/**
 * Credit — Represents one person's role in a project.
 * Used inside the project modal's "Credits" sidebar section.
 *
 * @property role - The credit category (e.g. "Director", "DoP").
 * @property name - The name of the credited person or studio.
 */
export interface Credit {
    role: string;
    name: string;
}

/**
 * Project — Represents one portfolio project displayed in the main feed
 * and in the detail modal when clicked.
 *
 * @property title       - The project headline shown on the card overlay.
 * @property subtitle    - A short descriptor shown in the modal (e.g. "Director's Cut • 2023").
 * @property category    - Category label shown under the card image (e.g. "Campaign").
 * @property techDetails - Camera/film tech shown under the card image (e.g. "Sony Venice 2 • Anamorphic").
 * @property cardImage   - URL of the image used on the main-feed card.
 * @property modalImage  - URL of the larger hero image used in the modal view.
 * @property description - Long-form descriptive paragraph shown in the modal.
 * @property credits     - Array of Credit entries for the modal sidebar.
 * @property rotation    - CSS rotation applied to the card for a tilted film-still look (e.g. "-2deg").
 */
export interface Project {
    title: string;
    subtitle: string;
    category: string;
    techDetails: string;
    cardImage: string;
    modalImage: string;
    description: string;
    credits: Credit[];
    rotation: string;
    /** Optional video URL that plays on card hover (Phase 2A) */
    hoverVideo?: string;
}
