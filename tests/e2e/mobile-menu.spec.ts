/**
 * @fileoverview E2E Tests for Mobile Menu
 * @feature Mobile hamburger menu functionality
 */
import { test, expect } from '@playwright/test'
import { VIEWPORTS } from '../constants'

test.describe('Mobile Menu', () => {
    test.use({ viewport: VIEWPORTS.IPHONE_SE })

    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('should show hamburger menu button on mobile', async ({ page }) => {
        // Desktop nav should be hidden on mobile
        const desktopNav = page.locator('[data-testid="desktop-nav"]')
        await expect(desktopNav).toBeHidden()

        // Mobile menu button should be visible
        const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]')
        await expect(mobileMenuButton).toBeVisible()
    })

    test('should open mobile menu when hamburger is clicked', async ({ page }) => {
        const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]')
        await mobileMenuButton.click()

        const mobileMenu = page.locator('[data-testid="mobile-menu"]')
        await expect(mobileMenu).toBeVisible()
    })

    test('should close mobile menu when hamburger is clicked again', async ({ page }) => {
        const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]')

        // Open menu
        await mobileMenuButton.click()

        const mobileMenu = page.locator('[data-testid="mobile-menu"]')
        await expect(mobileMenu).toBeVisible()

        // Menu link should be visible
        const mobileMenuLinks = page.locator('[data-testid="mobile-menu"] a').first()
        await expect(mobileMenuLinks).toBeVisible()

        // Close menu
        await mobileMenuButton.click()

        // Wait for menu to become hidden
        await expect(mobileMenu).toBeHidden()

        // Should have minimal links visible when menu is closed
        const visibleLinks = page.locator('header a:visible')
        const count = await visibleLinks.count()
        expect(count).toBeLessThanOrEqual(2)
    })

    test('should display all navigation links in mobile menu', async ({ page }) => {
        const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]')
        await mobileMenuButton.click()

        const expectedLinks = ['#about', '#experience', '#skills', '#projects', '#contact', '/blog']

        for (const linkPath of expectedLinks) {
            const link = page.locator(`[data-testid="mobile-menu"] a[href*="${linkPath}"]`)
            const count = await link.count()
            expect(count).toBeGreaterThanOrEqual(1)
        }
    })

    test('should navigate from mobile menu link', async ({ page }) => {
        const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]')
        await mobileMenuButton.click()

        const mobileMenu = page.locator('[data-testid="mobile-menu"]')
        await expect(mobileMenu).toBeVisible()

        const blogLink = page.locator('[data-testid="mobile-menu"] a[href="/blog"]')
        await expect(blogLink).toBeVisible()
        await blogLink.click()

        await expect(page).toHaveURL(/\/blog/)
    })

    test('mobile menu button should have accessible click target', async ({ page }) => {
        const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]')

        const box = await mobileMenuButton.boundingBox()
        expect(box).not.toBeNull()
        expect(box!.width).toBeGreaterThanOrEqual(24)
        expect(box!.height).toBeGreaterThanOrEqual(24)
    })
})

test.describe('Mobile Menu - Tablet', () => {
    test.use({ viewport: VIEWPORTS.IPAD })

    test('should show desktop navigation on tablet breakpoint', async ({ page }) => {
        await page.goto('/')

        const desktopNav = page.locator('[data-testid="desktop-nav"]')
        await expect(desktopNav).toBeVisible()
    })
})

test.describe('Mobile Menu - Large Phone', () => {
    test.use({ viewport: VIEWPORTS.IPHONE_14_PRO_MAX })

    test('should work correctly on large phone viewport', async ({ page }) => {
        await page.goto('/')

        const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]')
        await expect(mobileMenuButton).toBeVisible()

        await mobileMenuButton.click()

        const mobileMenu = page.locator('[data-testid="mobile-menu"]')
        await expect(mobileMenu).toBeVisible()

        const blogLink = page.locator('[data-testid="mobile-menu"] a[href="/blog"]')
        await expect(blogLink).toBeVisible()
    })
})
