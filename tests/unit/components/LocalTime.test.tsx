/**
 * @fileoverview Unit Tests for LocalTime Component
 *
 * Tests the LocalTime component which displays the current date/time in a
 * terminal-style format (e.g., "Last login: Wed Jan 15 10:30:00 on ttys000").
 *
 * @component LocalTime
 * @location app/components/LocalTime.tsx
 *
 * @description
 * Test coverage includes:
 * - Initial render state and loading behavior
 * - Client-side hydration and time formatting
 * - Terminal theme styling (text-terminal-gray, text-sm)
 * - Presence of terminal-style pseudo-device identifier (ttys000)
 *
 * @note This component uses client-side rendering for the time to avoid
 * hydration mismatches between server and client. Tests use fake timers
 * to control time-dependent behavior.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import LocalTime from '@/app/components/LocalTime'

describe('LocalTime Component', () => {
    /**
     * Test setup: Use fake timers and set a consistent system time.
     * This ensures deterministic test results regardless of when tests run.
     * The `shouldAdvanceTime: true` option allows timers to progress when needed.
     */
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true })
        // Mock a specific date: Wed Jan 15 2025, 10:30 AM
        vi.setSystemTime(new Date('2025-01-15T10:30:00'))
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    // =========================================================================
    // INITIAL RENDER TESTS
    // =========================================================================

    it('should render with Last login text', async () => {
        render(<LocalTime />)

        // The "Last login:" prefix should always be visible
        expect(screen.getByText(/Last login:/)).toBeInTheDocument()
    })

    // =========================================================================
    // HYDRATION / CLIENT-SIDE RENDERING TESTS
    // =========================================================================

    it('should display formatted time after mount', async () => {
        render(<LocalTime />)

        // Trigger the useEffect and wait for re-render
        // The component updates after mounting to show the actual time
        await act(async () => {
            await vi.advanceTimersByTimeAsync(100)
        })

        // Should contain date parts and terminal pseudo-device
        const element = screen.getByText(/on ttys000/)
        expect(element).toBeInTheDocument()
    })

    it('should render time content', async () => {
        render(<LocalTime />)

        await act(async () => {
            await vi.advanceTimersByTimeAsync(100)
        })

        // After hydration, should show formatted time (not loading state)
        const element = screen.getByText(/Last login:/)
        expect(element.textContent).not.toContain('Loading...')
    })

    // =========================================================================
    // STYLING TESTS
    // =========================================================================

    it('should have terminal theme classes', () => {
        render(<LocalTime />)

        const container = screen.getByText(/Last login:/)
        // Terminal theme uses muted gray text with small font size
        expect(container.className).toContain('text-terminal-gray')
        expect(container.className).toContain('text-sm')
    })

    // =========================================================================
    // CONTENT TESTS
    // =========================================================================

    it('should include ttys000 text', async () => {
        render(<LocalTime />)

        await act(async () => {
            await vi.advanceTimersByTimeAsync(100)
        })

        // "ttys000" is the terminal-style pseudo-device identifier
        expect(screen.getByText(/ttys000/)).toBeInTheDocument()
    })
})
