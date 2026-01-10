/**
 * @fileoverview Test Constants and Thresholds
 * @module tests/constants
 *
 * @description
 * Centralized configuration for all test thresholds and magic numbers.
 * This ensures consistency across tests and makes tuning easier.
 */

// =============================================================================
// PERFORMANCE THRESHOLDS
// =============================================================================

/**
 * Page load timing thresholds (in milliseconds).
 * Based on Web Vitals recommendations.
 */
export const PERFORMANCE = {
    /** Maximum acceptable DOM content loaded time */
    DOM_CONTENT_LOADED_MS: 3000,

    /** Maximum acceptable time to first byte */
    TTFB_MS: 1000,

    /** Maximum acceptable total page load time */
    PAGE_LOAD_MS: 2000,

    /** Maximum acceptable Cumulative Layout Shift score (0.25 is "needs improvement", 0.1 is "good") */
    CLS_THRESHOLD: 0.25,

    /** Maximum size for any single JavaScript bundle (in bytes) */
    MAX_JS_BUNDLE_SIZE: 500 * 1024, // 500KB

    /** Minimum percentage of images that should use modern formats (webp/avif/svg) */
    MIN_MODERN_IMAGE_RATIO: 0.5,

    /** Minimum percentage of images with explicit dimensions */
    MIN_IMAGES_WITH_DIMENSIONS: 0.5,
} as const

// =============================================================================
// VIEWPORT THRESHOLDS
// =============================================================================

/**
 * Viewport ratios for navigation anchor link tests.
 * Lower values are more lenient (section needs less visible area).
 */
export const VIEWPORT_RATIOS = {
    /** Minimum visible ratio for about section (smaller due to position) */
    ABOUT: 0.1,

    /** Minimum visible ratio for experience section */
    EXPERIENCE: 0.1,

    /** Minimum visible ratio for skills section */
    SKILLS: 0.3,

    /** Minimum visible ratio for projects section */
    PROJECTS: 0.3,

    /** Minimum visible ratio for contact section */
    CONTACT: 0.3,
} as const

// =============================================================================
// ACCESSIBILITY CONFIGURATION
// =============================================================================

/**
 * Accessibility test configuration.
 */
export const ACCESSIBILITY = {
    /** Violation severity levels that should cause test failures */
    FAIL_ON_SEVERITIES: ['critical', 'serious', 'moderate'] as const,

    /** Maximum number of links to check for focusability (performance optimization) */
    MAX_LINKS_TO_CHECK: 10,
} as const

// =============================================================================
// TIMING CONFIGURATION
// =============================================================================

/**
 * Timing values for tests (in milliseconds).
 * Note: Prefer element-specific assertions over timeouts when possible.
 */
export const TIMING = {
    /** Short wait for UI updates after user input */
    UI_UPDATE_MS: 100,

    /** Wait time for search debounce */
    SEARCH_DEBOUNCE_MS: 300,

    /** Time to wait for layout shifts to settle (CLS measurement) */
    CLS_SETTLE_MS: 500,

    /** Maximum search input length */
    MAX_SEARCH_LENGTH: 200,

    /** Maximum wait time for page navigation (ms) */
    NAVIGATION_TIMEOUT_MS: 10000,
} as const

// =============================================================================
// TOUCH TARGET SIZES
// =============================================================================

/**
 * Minimum touch target sizes for accessibility (in pixels).
 * Based on WCAG 2.1 SC 2.5.5 Target Size.
 */
export const TOUCH_TARGETS = {
    /** Minimum size for icon buttons (relaxed) */
    ICON_BUTTON_MIN: 24,

    /** Recommended minimum for touch targets */
    RECOMMENDED_MIN: 44,
} as const

// =============================================================================
// VIEWPORT PRESETS
// =============================================================================

/**
 * Common viewport sizes for responsive testing.
 * Based on popular device dimensions.
 */
export const VIEWPORTS = {
    /** iPhone SE / Small phones */
    IPHONE_SE: { width: 375, height: 667 },

    /** iPhone 14 Pro Max / Large phones */
    IPHONE_14_PRO_MAX: { width: 428, height: 926 },

    /** iPad / Tablets */
    IPAD: { width: 768, height: 1024 },
} as const

// =============================================================================
// BLOG CONFIGURATION
// =============================================================================

/**
 * Blog-related configuration values.
 * These mirror the values in BlogList.tsx for test consistency.
 */
export const BLOG = {
    /** Number of blog posts displayed per page */
    POSTS_PER_PAGE: 9,

    /** Maximum length for search queries */
    MAX_SEARCH_LENGTH: 200,
} as const

