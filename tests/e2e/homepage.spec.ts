/**
 * @fileoverview E2E Tests for Homepage
 * @module tests/e2e/homepage.spec.ts
 *
 * @description
 * Tests homepage loading and core elements. Coverage includes:
 * - Page title
 * - Header and navigation visibility
 * - Main content sections (about, experience, skills, projects)
 * - Terminal theme styling
 * - Footer display
 * - Blog navigation
 * - Mobile responsiveness
 */
import { test, expect } from '@playwright/test'
import { VIEWPORTS } from '../constants'

test.describe('Homepage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('should load successfully with correct title', async ({ page }) => {
        await expect(page).toHaveTitle(/Josh|joshdoes\.it/i)
    })

    test('should display header with navigation', async ({ page }) => {
        const header = page.locator('header')
        await expect(header).toBeVisible()

        // Check for navigation links
        // Multiple blog links exist - check at least one is visible
        const blogLink = page.getByRole('link', { name: /blog/i }).first()
        await expect(blogLink).toBeVisible()
    })

    test('should display main content sections', async ({ page }) => {
        // Use data-testid for reliable selectors (assertions have built-in waits)
        await expect(page.getByTestId('about-section')).toBeVisible()
        await expect(page.getByTestId('experience-section')).toBeVisible()
        await expect(page.getByTestId('skills-section')).toBeVisible()
        await expect(page.getByTestId('projects-section')).toBeVisible()
    })

    test('should have terminal theme styling applied', async ({ page }) => {
        const body = page.locator('body')

        // Check for dark background (terminal theme)
        const bgColor = await body.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor
        })

        // Background should be dark (low RGB values)
        expect(bgColor).toMatch(/rgb\(\s*\d{1,2}\s*,\s*\d{1,2}\s*,\s*\d{1,2}\s*\)/)
    })

    test('should display footer', async ({ page }) => {
        const footer = page.locator('footer')
        await expect(footer).toBeVisible()
    })

    test('should navigate to blog page', async ({ page }) => {
        const blogLink = page.getByRole('link', { name: /blog/i }).first()
        await blogLink.click()

        await expect(page).toHaveURL(/\/blog/)
    })
})

test.describe('Homepage - Mobile', () => {
    test.use({ viewport: VIEWPORTS.IPHONE_SE })

    test('should be responsive on mobile viewport', async ({ page }) => {
        await page.goto('/')

        // Page should still load and be visible
        const main = page.locator('main')
        await expect(main).toBeVisible()

        // Content should not overflow
        const body = page.locator('body')
        const scrollWidth = await body.evaluate((el) => el.scrollWidth)
        const clientWidth = await body.evaluate((el) => el.clientWidth)

        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 20) // Allow small tolerance
    })
})
