/**
 * @fileoverview Unit Tests for DisqusComments Component
 * @module tests/unit/components/DisqusComments.test.tsx
 *
 * @description
 * Tests the DisqusComments component which integrates Disqus commenting
 * into blog posts. Coverage includes:
 *
 * - Container and thread rendering
 * - Noscript fallback element
 * - Terminal-themed styling
 * - Environment variable configuration warnings
 * - Prop handling (slug, title, special characters)
 * - DISQUS.reset() behavior for navigation between posts
 * - Script loading and error handling
 * - Document loading state handling
 * - Retry logic when disqus_thread container missing
 * - disqus_config function verification
 * - Fresh module state scenarios
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import DisqusComments from '@/app/components/DisqusComments'

describe('DisqusComments Component', () => {
    const _originalWindow = { ...window }
    const originalEnv = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME

    beforeEach(() => {
        // Reset environment
        process.env.NEXT_PUBLIC_DISQUS_SHORTNAME = 'josh-does-it'
        // Mock console methods
        vi.spyOn(console, 'warn').mockImplementation(() => { })
        vi.spyOn(console, 'error').mockImplementation(() => { })
    })

    afterEach(() => {
        vi.restoreAllMocks()
        process.env.NEXT_PUBLIC_DISQUS_SHORTNAME = originalEnv
    })

    // -- Rendering --

    it('should render the comments container', () => {
        render(<DisqusComments post={{ slug: 'test-post', title: 'Test Post' }} />)

        // Container should be present
        const container = screen.getByRole('heading', { name: /comments/i })
        expect(container).toBeInTheDocument()
    })

    it('should render the Disqus thread container', () => {
        render(<DisqusComments post={{ slug: 'test-post', title: 'Test Post' }} />)

        // The disqus_thread div should exist
        const threadContainer = document.getElementById('disqus_thread')
        expect(threadContainer).toBeInTheDocument()
    })

    // Note: noscript content is not rendered by jsdom, so we verify the noscript
    // element exists at the DOM level instead
    it('should include noscript element for fallback', () => {
        const { container } = render(
            <DisqusComments post={{ slug: 'test-post', title: 'Test Post' }} />
        )

        // noscript element should exist in the DOM
        const noscript = container.querySelector('noscript')
        expect(noscript).toBeInTheDocument()
    })

    // -- Styling --

    it('should have terminal-themed styling', () => {
        const { container } = render(
            <DisqusComments post={{ slug: 'test-post', title: 'Test Post' }} />
        )

        // Container should have terminal styling classes
        const wrapper = container.firstChild as HTMLElement
        expect(wrapper).toHaveClass('bg-terminal-surface')
        expect(wrapper).toHaveClass('border')
        expect(wrapper).toHaveClass('border-terminal-border')
    })

    // -- Environment Variables --

    it('should warn when shortname is not configured', () => {
        process.env.NEXT_PUBLIC_DISQUS_SHORTNAME = 'YOUR_DISQUS_SHORTNAME'

        render(<DisqusComments post={{ slug: 'test-post', title: 'Test Post' }} />)

        // Should log a warning when using placeholder shortname
        expect(console.warn).toHaveBeenCalledWith(
            expect.stringContaining('Disqus shortname not configured')
        )
    })

    it('should not warn when shortname is properly configured', () => {
        process.env.NEXT_PUBLIC_DISQUS_SHORTNAME = 'josh-does-it'

        render(<DisqusComments post={{ slug: 'test-post', title: 'Test Post' }} />)

        // Should NOT log a warning when shortname is valid
        expect(console.warn).not.toHaveBeenCalled()
    })

    it('should use default shortname if env var is missing', () => {
        delete process.env.NEXT_PUBLIC_DISQUS_SHORTNAME

        render(<DisqusComments post={{ slug: 'test-post', title: 'Test Post' }} />)

        // Should not warn (uses default 'josh-does-it')
        expect(console.warn).not.toHaveBeenCalled()

        // Verify script src uses default
        const script = document.querySelector('script[src*="josh-does-it.disqus.com/embed.js"]')
        expect(script).toBeInTheDocument()
    })

    // -- Prop Handling --

    it('should render correctly with various prop values', () => {
        // Test with special characters in title
        const { container, rerender } = render(
            <DisqusComments post={{ slug: 'special-post', title: 'Post with "quotes" & <special> chars' }} />
        )
        expect(container.querySelector('#disqus_thread')).toBeInTheDocument()

        // Re-render with long slug
        const longSlug = 'this-is-a-very-long-blog-post-slug-that-goes-on-for-a-while'
        rerender(<DisqusComments post={{ slug: longSlug, title: 'Long Slug Post' }} />)
        expect(container.querySelector('#disqus_thread')).toBeInTheDocument()

        // Verify disqus_config function was set
        expect(window.disqus_config).toBeDefined()
    })

    // -- DISQUS.reset() Behavior --

    it('should call DISQUS.reset when script exists and DISQUS object is available', () => {
        // Mock existing script element
        const mockScript = document.createElement('script')
        mockScript.src = 'https://josh-does-it.disqus.com/embed.js'
        document.head.appendChild(mockScript)

        // Mock DISQUS global object
        const mockReset = vi.fn()
        window.DISQUS = {
            reset: mockReset
        }

        render(<DisqusComments post={{ slug: 'test-post', title: 'Test Post' }} />)

        // DISQUS.reset should have been called for re-initialization
        expect(mockReset).toHaveBeenCalledWith(
            expect.objectContaining({
                reload: true,
                config: expect.any(Function)
            })
        )

        // Cleanup
        document.head.removeChild(mockScript)
        delete (window as typeof window & { DISQUS?: unknown }).DISQUS
    })

    it('should call DISQUS.reset when script is already loaded (disqusScriptLoaded flag)', async () => {
        // First render loads the script
        const { unmount } = render(
            <DisqusComments post={{ slug: 'first-post', title: 'First Post' }} />
        )

        // Mock DISQUS becoming available after script loads
        const mockReset = vi.fn()
        window.DISQUS = {
            reset: mockReset
        }

        // Unmount and re-render to simulate navigation to another post
        unmount()

        // Find and keep the script for the second render
        const existingScript = document.querySelector('script[src*="disqus.com/embed.js"]')
        expect(existingScript).toBeInTheDocument()

        // Second render should call reset since script already loaded
        render(<DisqusComments post={{ slug: 'second-post', title: 'Second Post' }} />)

        expect(mockReset).toHaveBeenCalled()

        // Cleanup
        delete (window as typeof window & { DISQUS?: unknown }).DISQUS
    })

    // -- Script Error Handling --
    // Note: The actual onerror handler behavior is tested in the "Fresh Module State"
    // block below where vi.resetModules() allows testing with a fresh component render.
    // This test documents the expected onerror behavior pattern.

    it('should set data-timestamp attribute when creating script element', () => {
        // First ensure we have a script from prior test renders
        const script = document.querySelector('script[src*="disqus.com/embed.js"]')

        // If no script exists, render the component to create one
        if (!script) {
            render(<DisqusComments post={{ slug: 'timestamp-check', title: 'Timestamp Check' }} />)
        }

        const targetScript = document.querySelector('script[src*="disqus.com/embed.js"]')
        expect(targetScript).not.toBeNull()

        const timestamp = targetScript?.getAttribute('data-timestamp')
        expect(timestamp).toBeTruthy()
        expect(Number(timestamp)).toBeGreaterThan(0)
    })

    // -- Existing Script Without Flag --

    it('should reset DISQUS when script exists but global flag not set', () => {
        // Create a mock script that already exists
        const mockScript = document.createElement('script')
        mockScript.src = 'https://josh-does-it.disqus.com/embed.js'
        document.head.appendChild(mockScript)

        // Mock DISQUS global object
        const mockReset = vi.fn()
        window.DISQUS = {
            reset: mockReset
        }

        render(<DisqusComments post={{ slug: 'existing-script', title: 'Existing Script' }} />)

        // Should call reset since script exists and DISQUS is available
        expect(mockReset).toHaveBeenCalledWith(
            expect.objectContaining({
                reload: true,
                config: expect.any(Function)
            })
        )

        // Cleanup
        document.head.removeChild(mockScript)
        delete (window as typeof window & { DISQUS?: unknown }).DISQUS
    })

    // -- Existing Script Without Loaded Flag (Lines 93-100) --

    it('should reset DISQUS when script exists in DOM but module flag is false', () => {
        // Simulate a fresh module state by removing all disqus scripts first
        document.querySelectorAll('script[src*="disqus.com"]').forEach(s => s.remove())

        // Add a script element to simulate it existing from a previous page load
        // (but our module's disqusScriptLoaded flag would be false on fresh import)
        const existingScript = document.createElement('script')
        existingScript.src = 'https://josh-does-it.disqus.com/embed.js'
        existingScript.setAttribute('data-disqus-script', 'true')
        document.head.appendChild(existingScript)

        // Set up DISQUS mock
        const mockReset = vi.fn()
        window.DISQUS = { reset: mockReset }

        // On first render with fresh module, script exists so lines 93-100 branch executes
        render(<DisqusComments post={{ slug: 'branch-test', title: 'Branch Test' }} />)

        // DISQUS.reset should be called from the "script exists" branch
        expect(mockReset).toHaveBeenCalledWith(
            expect.objectContaining({
                reload: true,
                config: expect.any(Function)
            })
        )

        // Cleanup
        document.head.removeChild(existingScript)
        delete (window as typeof window & { DISQUS?: unknown }).DISQUS
    })

    // -- Document Loading State --

    it('should add DOMContentLoaded listener when document is loading', () => {
        // Mock document.readyState as 'loading'
        const originalReadyState = Object.getOwnPropertyDescriptor(document, 'readyState')
        Object.defineProperty(document, 'readyState', {
            value: 'loading',
            configurable: true
        })

        const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

        render(<DisqusComments post={{ slug: 'loading-test', title: 'Loading Test' }} />)

        // Should have added DOMContentLoaded listener
        expect(addEventListenerSpy).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function))

        // Restore original readyState
        if (originalReadyState) {
            Object.defineProperty(document, 'readyState', originalReadyState)
        } else {
            Object.defineProperty(document, 'readyState', {
                value: 'complete',
                configurable: true
            })
        }
        addEventListenerSpy.mockRestore()
    })

    // -- Retry Logic when disqus_thread doesn't exist --

    it('should retry initialization when disqus_thread container does not exist', () => {
        vi.useFakeTimers()

        // Mock getElementById to return null initially, then return the element
        const originalGetElementById = document.getElementById.bind(document)
        let callCount = 0
        const mockGetElementById = vi.fn((id: string) => {
            if (id === 'disqus_thread') {
                callCount++
                if (callCount === 1) {
                    return null // First call returns null, triggering retry
                }
            }
            return originalGetElementById(id)
        })
        document.getElementById = mockGetElementById

        render(<DisqusComments post={{ slug: 'retry-test', title: 'Retry Test' }} />)

        // First call should have returned null
        expect(mockGetElementById).toHaveBeenCalledWith('disqus_thread')

        // Fast-forward to trigger the retry
        vi.advanceTimersByTime(100)

        // getElementById should have been called again
        expect(callCount).toBeGreaterThan(1)

        // Restore
        document.getElementById = originalGetElementById
        vi.useRealTimers()
    })

    // -- disqus_config function verification --

    it('should set window.disqus_config function with correct page properties', () => {
        render(<DisqusComments post={{ slug: 'config-test', title: 'Config Title Test' }} />)

        // The disqus_config function should be set
        expect(window.disqus_config).toBeDefined()
        expect(typeof window.disqus_config).toBe('function')

        // Invoke the config function with a mock context to verify it sets properties
        const mockConfig = {
            page: {
                url: '',
                identifier: '',
                title: ''
            }
        }

        // Call the config function with the mock as 'this'
        if (window.disqus_config) {
            window.disqus_config.call(mockConfig)
        }

        // Verify the config was set correctly
        expect(mockConfig.page.identifier).toBe('config-test')
        expect(mockConfig.page.title).toBe('Config Title Test')
        expect(mockConfig.page.url).toContain('localhost') // jsdom sets location.href
    })
})

// Separate describe block for tests requiring fresh module state
// This ensures the component's module-level disqusScriptLoaded flag is reset
describe('DisqusComments - Fresh Module State', () => {
    beforeEach(async () => {
        // Reset environment
        process.env.NEXT_PUBLIC_DISQUS_SHORTNAME = 'josh-does-it'
        // Reset all modules to get fresh disqusScriptLoaded state
        vi.resetModules()
        // Remove any existing disqus scripts from prior tests
        document.querySelectorAll('script[src*="disqus.com"]').forEach(s => s.remove())
        // Mock console methods
        vi.spyOn(console, 'warn').mockImplementation(() => { })
        vi.spyOn(console, 'error').mockImplementation(() => { })
        // Clean up DISQUS global
        delete (window as typeof window & { DISQUS?: unknown }).DISQUS
    })

    afterEach(() => {
        vi.restoreAllMocks()
        // Clean up scripts
        document.querySelectorAll('script[src*="disqus.com"]').forEach(s => s.remove())
        delete (window as typeof window & { DISQUS?: unknown }).DISQUS
    })

    it('should create script with data-timestamp attribute', async () => {
        // Dynamically import to get fresh module state
        const { default: DisqusComments } = await import('@/app/components/DisqusComments')
        const { render } = await import('@testing-library/react')

        render(<DisqusComments post={{ slug: 'timestamp-test', title: 'Timestamp Test' }} />)

        // Find the script created by the component
        const script = document.querySelector('script[src*="disqus.com/embed.js"]')
        expect(script).not.toBeNull()

        // Verify data-timestamp is set (line 81)
        const timestamp = script?.getAttribute('data-timestamp')
        expect(timestamp).toBeTruthy()
        expect(Number(timestamp)).toBeGreaterThan(0)
    })

    it('should call onerror handler when script fails to load', async () => {
        // Dynamically import to get fresh module state
        const { default: DisqusComments } = await import('@/app/components/DisqusComments')
        const { render } = await import('@testing-library/react')

        render(<DisqusComments post={{ slug: 'error-test', title: 'Error Test' }} />)

        // Find the script and trigger its onerror
        const script = document.querySelector('script[src*="disqus.com/embed.js"]') as HTMLScriptElement
        expect(script).not.toBeNull()
        expect(script?.onerror).toBeDefined()

        // Trigger the error handler
        script.onerror!(new Event('error'))

        // Should have logged an error (lines 86-87)
        expect(console.error).toHaveBeenCalledWith('Failed to load Disqus script')
    })

    it('should reset DISQUS when script exists but module flag is false', async () => {
        // First, add a script element to simulate it existing from a previous page load
        const existingScript = document.createElement('script')
        existingScript.src = 'https://josh-does-it.disqus.com/embed.js'
        existingScript.setAttribute('data-disqus-script', 'true')
        document.head.appendChild(existingScript)

        // Set up DISQUS mock before component renders
        const mockReset = vi.fn()
        window.DISQUS = { reset: mockReset }

        // Dynamically import to get fresh module state (disqusScriptLoaded = false)
        const { default: DisqusComments } = await import('@/app/components/DisqusComments')
        const { render } = await import('@testing-library/react')

        // Render - since script exists but flag is false, lines 93-100 should execute
        render(<DisqusComments post={{ slug: 'reset-branch', title: 'Reset Branch Test' }} />)

        // DISQUS.reset should be called from lines 94-99
        expect(mockReset).toHaveBeenCalledWith(
            expect.objectContaining({
                reload: true,
                config: expect.any(Function)
            })
        )
    })
})
