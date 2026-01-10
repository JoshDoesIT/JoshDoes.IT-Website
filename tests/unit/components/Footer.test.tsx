/**
 * @fileoverview Unit Tests for Footer Component
 * @module tests/unit/components/Footer.test.tsx
 *
 * @description
 * Tests the Footer component which displays copyright info and navigation
 * links in a terminal-themed style. Coverage includes:
 *
 * - Footer element structure and id attribute
 * - Terminal prompt and thanks message
 * - Copyright text content
 * - Privacy and accessibility link hrefs
 * - Terminal theme background and border styling
 * - Hover transition effects on links
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '@/app/components/Footer'

describe('Footer Component', () => {
    // -- Structure --

    it('should render footer element', () => {
        render(<Footer />)

        const footer = screen.getByRole('contentinfo')
        expect(footer).toBeInTheDocument()
    })

    it('should have footer id attribute', () => {
        render(<Footer />)

        const footer = document.getElementById('footer')
        expect(footer).not.toBeNull()
    })

    // -- Content --

    it('should display terminal prompt with thanks message', () => {
        render(<Footer />)

        // Terminal prompt with message
        expect(screen.getByText(/Thanks for visiting!/)).toBeInTheDocument()
    })

    it('should display copyright text', () => {
        render(<Footer />)

        expect(screen.getByText(/© 2025 Josh Jones/)).toBeInTheDocument()
        expect(screen.getByText(/All rights reserved/)).toBeInTheDocument()
    })

    // -- Navigation Links --

    it('should render privacy link with correct href', () => {
        render(<Footer />)

        const privacyLink = screen.getByText('./privacy')
        expect(privacyLink).toBeInTheDocument()
        expect(privacyLink.closest('a')?.getAttribute('href')).toBe('/privacy')
    })

    it('should render accessibility link with correct href', () => {
        render(<Footer />)

        const accessibilityLink = screen.getByText('./accessibility')
        expect(accessibilityLink).toBeInTheDocument()
        expect(accessibilityLink.closest('a')?.getAttribute('href')).toBe('/accessibility')
    })

    // -- Styling --

    it('should have terminal theme background', () => {
        render(<Footer />)

        const footer = screen.getByRole('contentinfo')
        expect(footer.className).toContain('bg-terminal-bg')
    })

    it('should have top border', () => {
        render(<Footer />)

        const footer = screen.getByRole('contentinfo')
        expect(footer.className).toContain('border-t')
        expect(footer.className).toContain('border-terminal-border')
    })

    it('should have terminal gray text color', () => {
        render(<Footer />)

        // Check that text container has terminal-gray class
        const textContainer = document.querySelector('.text-terminal-gray')
        expect(textContainer).toBeInTheDocument()
    })

    it('should have hover transition on links', () => {
        render(<Footer />)

        const privacyLink = screen.getByText('./privacy').closest('a')
        expect(privacyLink?.className).toContain('transition')
        expect(privacyLink?.className).toContain('hover:text-terminal-green')
    })
})
