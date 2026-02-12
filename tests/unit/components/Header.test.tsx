/**
 * @fileoverview Unit Tests for Header Component
 * @module tests/unit/components/Header.test.tsx
 *
 * @description
 * Tests the Header component which provides site navigation including
 * mobile responsive menu. Coverage includes:
 *
 * - Header structure (banner role, navigation landmark)
 * - Home link branding with terminal prompt
 * - Navigation links (hrefs for all sections)
 * - Mobile menu toggle behavior
 * - ARIA attributes (aria-expanded, aria-label)
 * - Menu items with proper roles
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '@/app/components/Header'

describe('Header Component', () => {
    // =========================================================================
    // STRUCTURE TESTS
    // =========================================================================

    it('should render header with banner role', () => {
        render(<Header />)
        expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('should render main navigation landmark', () => {
        render(<Header />)
        expect(screen.getByRole('navigation', { name: /main/i })).toBeInTheDocument()
    })

    // =========================================================================
    // BRANDING TESTS
    // =========================================================================

    it('should render home link with terminal prompt', () => {
        render(<Header />)
        expect(screen.getByText(/josh@joshdoes\.it:~\$/)).toBeInTheDocument()
    })

    it('should link home to root path', () => {
        render(<Header />)
        const homeLink = screen.getByText(/josh@joshdoes\.it:~\$/).closest('a')
        expect(homeLink?.getAttribute('href')).toBe('/')
    })

    // =========================================================================
    // NAVIGATION LINKS TESTS
    // =========================================================================

    it('should render all navigation links', () => {
        render(<Header />)

        const expectedLinks = ['./about', './experience', './skills', './projects', './contact', './blog']
        expectedLinks.forEach((linkText) => {
            expect(screen.getAllByText(linkText).length).toBeGreaterThanOrEqual(1)
        })
    })

    it('should have correct hrefs for section links', () => {
        render(<Header />)

        const aboutLink = screen.getAllByText('./about')[0].closest('a')
        expect(aboutLink?.getAttribute('href')).toBe('/#about')

        const blogLink = screen.getAllByText('./blog')[0].closest('a')
        expect(blogLink?.getAttribute('href')).toBe('/blog')
    })

    // =========================================================================
    // MOBILE MENU BEHAVIOR TESTS
    // =========================================================================

    it('should render mobile menu button with accessible label', () => {
        render(<Header />)
        expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
    })

    it('should open mobile menu when button is clicked', () => {
        render(<Header />)

        const menuButton = screen.getByRole('button', { name: /open menu/i })
        fireEvent.click(menuButton)

        // Menu should now be open - button label changes
        expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument()
        // Menu items should be visible
        expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    it('should close mobile menu when button is clicked again', () => {
        render(<Header />)

        const menuButton = screen.getByRole('button', { name: /open menu/i })

        // Open
        fireEvent.click(menuButton)
        expect(screen.getByRole('menu')).toBeInTheDocument()

        // Close
        fireEvent.click(screen.getByRole('button', { name: /close menu/i }))
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    it('should update aria-expanded when menu toggles', () => {
        render(<Header />)

        const menuButton = screen.getByRole('button', { name: /open menu/i })
        expect(menuButton).toHaveAttribute('aria-expanded', 'false')

        fireEvent.click(menuButton)
        expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute('aria-expanded', 'true')
    })

    it('should display all nav links in mobile menu when open', () => {
        render(<Header />)

        fireEvent.click(screen.getByRole('button', { name: /open menu/i }))

        const expectedLinks = ['./about', './experience', './skills', './projects', './contact', './blog']
        expectedLinks.forEach((linkText) => {
            // Should have at least 2 (desktop + mobile)
            expect(screen.getAllByText(linkText).length).toBeGreaterThanOrEqual(2)
        })
    })

    it('should have menu items with menuitem role', () => {
        render(<Header />)

        fireEvent.click(screen.getByRole('button', { name: /open menu/i }))

        const menuItems = screen.getAllByRole('menuitem')
        expect(menuItems.length).toBe(6) // All nav links
    })
})
