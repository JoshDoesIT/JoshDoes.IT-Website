/**
 * Test setup for Vitest - extends expect with jest-dom matchers
 * and mocks browser APIs not available in jsdom.
 */

import { expect, afterEach, vi, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import React from 'react'

// Extend Vitest expect with jest-dom matchers
expect.extend(matchers)

// Preserve timer functions when using fake timers
beforeEach(() => {
    const realSetInterval = global.setInterval
    const realClearInterval = global.clearInterval
    const realSetTimeout = global.setTimeout
    const realClearTimeout = global.clearTimeout

    if (typeof global.setInterval === 'undefined') {
        global.setInterval = realSetInterval
    }
    if (typeof global.clearInterval === 'undefined') {
        global.clearInterval = realClearInterval
    }
    if (typeof global.setTimeout === 'undefined') {
        global.setTimeout = realSetTimeout
    }
    if (typeof global.clearTimeout === 'undefined') {
        global.clearTimeout = realClearTimeout
    }
})

// Cleanup after each test
afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
})

// =============================================================================
// GLOBAL MOCKS
// =============================================================================

/**
 * Mock next/link to render as a standard anchor tag.
 */
vi.mock('next/link', () => ({
    default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) =>
        React.createElement('a', { href, ...props }, children),
}))

/**
 * Mock next/navigation hooks for components that use client-side navigation.
 */
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
}))

// =============================================================================
// BROWSER API MOCKS
// =============================================================================

/**
 * Configuration for mockMatchMedia helper.
 */
export interface MockMatchMediaConfig {
    /** Whether the media query matches (default: false) */
    matches?: boolean
    /** Custom media queries to match. Key is the query, value is whether it matches. */
    queries?: Record<string, boolean>
}

/**
 * Create a mock matchMedia implementation for testing responsive/theme behavior.
 * 
 * @example
 * // Test dark mode
 * mockMatchMedia({ queries: { '(prefers-color-scheme: dark)': true } })
 * 
 * @example
 * // Test mobile viewport
 * mockMatchMedia({ queries: { '(max-width: 768px)': true } })
 */
export function mockMatchMedia(config: MockMatchMediaConfig = {}) {
    const { matches = false, queries = {} } = config

    const mockImplementation = vi.fn().mockImplementation((query: string) => ({
        matches: queries[query] ?? matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    }))

    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockImplementation,
    })

    return mockImplementation
}

// Set default matchMedia mock (matches: false for all queries)
mockMatchMedia()

/**
 * Mock IntersectionObserver with callback support.
 * Call mockIntersectionObserver.triggerIntersect(entries) in tests to simulate.
 */
class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null
    readonly rootMargin: string = ''
    readonly thresholds: ReadonlyArray<number> = []
    private callback: IntersectionObserverCallback

    constructor(callback: IntersectionObserverCallback) {
        this.callback = callback
    }

    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    takeRecords = vi.fn(() => [])

    // Helper for tests to trigger intersection
    triggerIntersect(entries: IntersectionObserverEntry[]) {
        this.callback(entries, this)
    }
}

Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
})

/**
 * Mock ResizeObserver with callback support.
 */
class MockResizeObserver implements ResizeObserver {
    private callback: ResizeObserverCallback

    constructor(callback: ResizeObserverCallback) {
        this.callback = callback
    }

    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()

    // Helper for tests to trigger resize
    triggerResize(entries: ResizeObserverEntry[]) {
        this.callback(entries, this)
    }
}

Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: MockResizeObserver,
})


