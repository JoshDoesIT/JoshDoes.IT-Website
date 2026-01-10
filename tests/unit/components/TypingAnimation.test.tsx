/**
 * @fileoverview Unit Tests for TypingAnimation Component
 * @module tests/unit/components/TypingAnimation.test.tsx
 *
 * @description
 * Tests the TypingAnimation component which displays text with a typewriter
 * effect, including type/erase animation cycles. Coverage includes:
 *
 * - Initial empty render state
 * - Character-by-character typing animation
 * - Custom typing speed configuration
 * - Prop handling (className, text)
 * - Edge cases (empty text, special characters)
 * - Semantic HTML (span element)
 * - Erasing animation phase
 * - Pause handling (after typing, after erasing)
 * - Full animation cycle (type → pause → erase → pause → repeat)
 *
 * @note Uses fake timers to control animation timing precisely.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import TypingAnimation, {
    DEFAULT_SPEED,
    DEFAULT_ERASE_SPEED,
    DEFAULT_PAUSE_AFTER_TYPING,
    DEFAULT_PAUSE_AFTER_ERASING,
} from '@/app/components/TypingAnimation'

describe('TypingAnimation Component', () => {
    /**
     * Test setup: Use fake timers to control the typing animation.
     * This allows tests to advance time precisely and verify each character.
     */
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    // =========================================================================
    // INITIAL STATE TESTS
    // =========================================================================

    it('should render empty initially', () => {
        render(<TypingAnimation text="hello" />)

        // Before any time passes, the span should be empty
        const element = screen.getByText('', { selector: 'span' })
        expect(element).toBeInTheDocument()
    })

    // =========================================================================
    // TYPING ANIMATION TESTS
    // =========================================================================

    it('should type characters one by one', async () => {
        render(<TypingAnimation text="hi" speed={100} />)

        // Initially empty
        expect(screen.getByText('', { selector: 'span' }).textContent).toBe('')

        // After first interval (100ms) - first character appears
        await act(async () => {
            vi.advanceTimersByTime(100)
        })
        expect(screen.getByText('h')).toBeInTheDocument()

        // After second interval (200ms total) - second character appears
        await act(async () => {
            vi.advanceTimersByTime(100)
        })
        expect(screen.getByText('hi')).toBeInTheDocument()
    })

    it('should respect custom typing speed', async () => {
        render(<TypingAnimation text="ab" speed={200} />)

        // After 100ms (half the speed), nothing should be typed yet
        await act(async () => {
            vi.advanceTimersByTime(100)
        })
        expect(screen.getByText('', { selector: 'span' }).textContent).toBe('')

        // After 200ms total, first character should appear
        await act(async () => {
            vi.advanceTimersByTime(100)
        })
        expect(screen.getByText('a')).toBeInTheDocument()
    })

    it('should complete typing full text', async () => {
        render(
            <TypingAnimation
                text="ab"
                speed={100}
            />
        )

        // Type first character
        await act(async () => {
            vi.advanceTimersByTime(100)
        })
        expect(screen.getByText('a')).toBeInTheDocument()

        // Type second character - animation complete
        await act(async () => {
            vi.advanceTimersByTime(100)
        })
        expect(screen.getByText('ab')).toBeInTheDocument()
    })

    it('should use default speed when not specified', async () => {
        render(<TypingAnimation text="t" />)

        // Uses DEFAULT_SPEED (100ms)
        await act(async () => {
            vi.advanceTimersByTime(DEFAULT_SPEED)
        })
        expect(screen.getByText('t')).toBeInTheDocument()
    })

    // =========================================================================
    // PROP HANDLING TESTS
    // =========================================================================

    it('should apply custom className', () => {
        render(<TypingAnimation text="test" className="custom-class" />)

        const element = screen.getByText('', { selector: 'span' })
        expect(element).toHaveClass('custom-class')
    })

    // =========================================================================
    // EDGE CASE TESTS
    // =========================================================================

    it('should handle empty text', () => {
        render(<TypingAnimation text="" />)

        // Empty text should still render an empty span
        const element = screen.getByText('', { selector: 'span' })
        expect(element).toBeInTheDocument()
    })

    it('should handle special characters', async () => {
        render(<TypingAnimation text="<>" speed={100} />)

        // HTML-like characters should be escaped and displayed correctly
        await act(async () => {
            vi.advanceTimersByTime(100)
        })
        expect(screen.getByText('<')).toBeInTheDocument()

        await act(async () => {
            vi.advanceTimersByTime(100)
        })
        expect(screen.getByText('<>')).toBeInTheDocument()
    })

    // =========================================================================
    // SEMANTIC HTML TESTS
    // =========================================================================

    it('should render as a span element', () => {
        render(<TypingAnimation text="test" />)

        // Component should be an inline span for semantic correctness
        const element = screen.getByText('', { selector: 'span' })
        expect(element.tagName).toBe('SPAN')
    })

    // =========================================================================
    // ERASING ANIMATION TESTS
    // =========================================================================

    it('should start erasing after typing completes and pause ends', async () => {
        render(
            <TypingAnimation
                text="ab"
                speed={100}
                eraseSpeed={50}
                pauseAfterTyping={500}
                pauseAfterErasing={200}
            />
        )

        // Type both characters
        await act(async () => {
            vi.advanceTimersByTime(100) // 'a'
        })
        await act(async () => {
            vi.advanceTimersByTime(100) // 'ab'
        })
        expect(screen.getByText('ab')).toBeInTheDocument()

        // Trigger pause after typing (the 0ms timeout that sets isPaused)
        await act(async () => {
            vi.advanceTimersByTime(0)
        })

        // Wait for pauseAfterTyping to complete
        await act(async () => {
            vi.advanceTimersByTime(500)
        })

        // Now erasing should start - first erase removes last char
        await act(async () => {
            vi.advanceTimersByTime(50) // erase speed
        })
        expect(screen.getByText('a')).toBeInTheDocument()

        // Second erase removes remaining char
        await act(async () => {
            vi.advanceTimersByTime(50)
        })
        expect(screen.getByText('', { selector: 'span' }).textContent).toBe('')
    })

    it('should respect custom eraseSpeed prop', async () => {
        render(
            <TypingAnimation
                text="x"
                speed={100}
                eraseSpeed={200}
                pauseAfterTyping={100}
            />
        )

        // Type the character
        await act(async () => {
            vi.advanceTimersByTime(100)
        })
        expect(screen.getByText('x')).toBeInTheDocument()

        // Trigger pause and wait for it
        await act(async () => {
            vi.advanceTimersByTime(0) // trigger pause
        })
        await act(async () => {
            vi.advanceTimersByTime(100) // wait for pauseAfterTyping
        })

        // After 100ms (half eraseSpeed), character should still be there
        await act(async () => {
            vi.advanceTimersByTime(100)
        })
        expect(screen.getByText('x')).toBeInTheDocument()

        // After full eraseSpeed (200ms), character should be erased
        await act(async () => {
            vi.advanceTimersByTime(100)
        })
        expect(screen.getByText('', { selector: 'span' }).textContent).toBe('')
    })

    // =========================================================================
    // PAUSE HANDLING TESTS
    // =========================================================================

    it('should pause after typing completes', async () => {
        render(
            <TypingAnimation
                text="a"
                speed={100}
                pauseAfterTyping={1000}
            />
        )

        // Type the character
        await act(async () => {
            vi.advanceTimersByTime(100)
        })
        expect(screen.getByText('a')).toBeInTheDocument()

        // Trigger the pause
        await act(async () => {
            vi.advanceTimersByTime(0)
        })

        // During pause, text should remain
        await act(async () => {
            vi.advanceTimersByTime(500)
        })
        expect(screen.getByText('a')).toBeInTheDocument()
    })

    it('should pause after erasing completes before restarting', async () => {
        render(
            <TypingAnimation
                text="a"
                speed={100}
                eraseSpeed={50}
                pauseAfterTyping={100}
                pauseAfterErasing={500}
            />
        )

        // Type the character
        await act(async () => {
            vi.advanceTimersByTime(100)
        })
        expect(screen.getByText('a')).toBeInTheDocument()

        // Trigger and complete pause after typing
        await act(async () => {
            vi.advanceTimersByTime(0)
        })
        await act(async () => {
            vi.advanceTimersByTime(100)
        })

        // Erase the character
        await act(async () => {
            vi.advanceTimersByTime(50)
        })
        expect(screen.getByText('', { selector: 'span' }).textContent).toBe('')

        // Trigger pause after erasing
        await act(async () => {
            vi.advanceTimersByTime(0)
        })

        // During pauseAfterErasing, text should remain empty
        await act(async () => {
            vi.advanceTimersByTime(250)
        })
        expect(screen.getByText('', { selector: 'span' }).textContent).toBe('')

        // After pauseAfterErasing completes, typing should restart
        await act(async () => {
            vi.advanceTimersByTime(250)
        })
        // Now typing restarts
        await act(async () => {
            vi.advanceTimersByTime(100)
        })
        expect(screen.getByText('a')).toBeInTheDocument()
    })

    // =========================================================================
    // FULL ANIMATION CYCLE TESTS
    // =========================================================================

    it('should complete a full type-pause-erase-pause cycle', async () => {
        render(
            <TypingAnimation
                text="xy"
                speed={100}
                eraseSpeed={50}
                pauseAfterTyping={200}
                pauseAfterErasing={100}
            />
        )

        // Phase 1: Typing
        await act(async () => {
            vi.advanceTimersByTime(100) // 'x'
        })
        expect(screen.getByText('x')).toBeInTheDocument()

        await act(async () => {
            vi.advanceTimersByTime(100) // 'xy'
        })
        expect(screen.getByText('xy')).toBeInTheDocument()

        // Phase 2: Pause after typing
        await act(async () => {
            vi.advanceTimersByTime(0) // trigger pause
        })
        await act(async () => {
            vi.advanceTimersByTime(200) // pauseAfterTyping
        })

        // Phase 3: Erasing
        await act(async () => {
            vi.advanceTimersByTime(50) // erase 'y'
        })
        expect(screen.getByText('x')).toBeInTheDocument()

        await act(async () => {
            vi.advanceTimersByTime(50) // erase 'x'
        })
        expect(screen.getByText('', { selector: 'span' }).textContent).toBe('')

        // Phase 4: Pause after erasing
        await act(async () => {
            vi.advanceTimersByTime(0) // trigger pause
        })
        await act(async () => {
            vi.advanceTimersByTime(100) // pauseAfterErasing
        })

        // Phase 5: Restart typing (cycle continues)
        await act(async () => {
            vi.advanceTimersByTime(100)
        })
        expect(screen.getByText('x')).toBeInTheDocument()
    })
})

