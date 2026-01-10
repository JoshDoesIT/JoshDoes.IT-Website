/**
 * @fileoverview E2E Tests for Site Navigation
 * @feature Navigation and anchor links
 */
import { test, expect } from '@playwright/test'
import { TIMING, VIEWPORT_RATIOS } from '../constants'

test.describe('Navigation - Anchor Links', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    // Helper to click a nav link on both desktop and mobile
    async function clickNavLink(page: import('@playwright/test').Page, sectionId: string) {
        const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]')
        const isMobile = await mobileMenuButton.isVisible()

        if (isMobile) {
            await mobileMenuButton.click()
            const mobileMenu = page.locator('[data-testid="mobile-menu"]')
            await expect(mobileMenu).toBeVisible()
            const link = page.locator(`[data-testid="mobile-menu"] a[href*="${sectionId}"]`)
            await link.click()
        } else {
            const link = page.locator(`[data-testid="desktop-nav"] a[href*="${sectionId}"]`).first()
            await link.click()
        }
    }

    test('should scroll to about section when clicking about link', async ({ page }) => {
        await clickNavLink(page, '#about')
        const aboutSection = page.locator('#about')
        await expect(aboutSection).toBeInViewport({ ratio: VIEWPORT_RATIOS.ABOUT })
    })

    test('should scroll to experience section when clicking experience link', async ({ page }) => {
        await clickNavLink(page, '#experience')
        const experienceSection = page.locator('#experience')
        await expect(experienceSection).toBeInViewport({ ratio: VIEWPORT_RATIOS.EXPERIENCE })
    })

    test('should scroll to skills section when clicking skills link', async ({ page }) => {
        await clickNavLink(page, '#skills')
        const skillsSection = page.locator('#skills')
        await expect(skillsSection).toBeInViewport({ ratio: VIEWPORT_RATIOS.SKILLS })
    })

    test('should scroll to projects section when clicking projects link', async ({ page }) => {
        await clickNavLink(page, '#projects')
        const projectsSection = page.locator('#projects')
        await expect(projectsSection).toBeInViewport({ ratio: VIEWPORT_RATIOS.PROJECTS })
    })

    test('should scroll to contact section when clicking contact link', async ({ page }) => {
        await clickNavLink(page, '#contact')
        const contactSection = page.locator('#contact')
        await expect(contactSection).toBeInViewport({ ratio: VIEWPORT_RATIOS.CONTACT })
    })

    test('should navigate to homepage from blog via header link', async ({ page }) => {
        await page.goto('/blog')
        const homeLink = page.locator('header').getByRole('link').first()
        await homeLink.click()
        await expect(page).toHaveURL('/')
    })

    test('anchor links should have correct href format', async ({ page }) => {
        const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]')
        const isMobile = await mobileMenuButton.isVisible()

        if (isMobile) {
            await mobileMenuButton.click()
            const mobileMenu = page.locator('[data-testid="mobile-menu"]')
            await expect(mobileMenu).toBeVisible()
        }

        const sectionIds = ['about', 'experience', 'skills', 'projects', 'contact']

        for (const sectionId of sectionIds) {
            const linkSelector = isMobile
                ? `[data-testid="mobile-menu"] a[href*="${sectionId}"]`
                : `[data-testid="desktop-nav"] a[href*="${sectionId}"]`
            const element = page.locator(linkSelector).first()
            const href = await element.getAttribute('href')
            expect(href).toContain(`#${sectionId}`)
        }
    })
})

test.describe('Navigation - Header Behavior', () => {
    test('header should be sticky and visible when scrolling', async ({ page }) => {
        await page.goto('/')

        const header = page.locator('header')
        await expect(header).toBeVisible()

        await page.evaluate(() => window.scrollTo(0, 1000))

        await expect(header).toBeVisible()
        await expect(header).toBeInViewport()
    })

    test('header should have z-index to stay on top', async ({ page }) => {
        await page.goto('/')

        const header = page.locator('header')
        const zIndex = await header.evaluate((el) => {
            return window.getComputedStyle(el).zIndex
        })

        expect(parseInt(zIndex)).toBeGreaterThan(0)
    })
})

test.describe('Navigation - Blog to Homepage', () => {
    test('should navigate from blog post back to homepage sections', async ({ page }) => {
        await page.goto('/blog')
        await expect(page.locator('header')).toBeVisible()

        const postLink = page.locator('a[href*="/blog/"]').first()
        if ((await postLink.count()) === 0) {
            test.skip(true, 'No blog posts available to test navigation')
            return
        }

        await postLink.click()
        await expect(page.locator('header')).toBeVisible()

        const homeLink = page.locator('header a[href="/"]').first()
        await expect(homeLink).toBeVisible()
        await homeLink.click()

        // Use expect with toHaveURL which has built-in retry logic
        await expect(page).toHaveURL('/', { timeout: TIMING.NAVIGATION_TIMEOUT_MS })
    })
})
