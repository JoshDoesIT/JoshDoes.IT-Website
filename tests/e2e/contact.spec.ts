/**
 * @fileoverview E2E Tests for Contact Section
 * @feature Contact section and external link security
 */
import { test, expect } from '@playwright/test'

test.describe('Contact Section', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('should have contact section visible', async ({ page }) => {
        const contactSection = page.locator('#contact')
        await expect(contactSection).toBeVisible()
    })

    test('should have valid email link', async ({ page }) => {
        const emailLink = page.locator('a[href^="mailto:"]').first()
        await expect(emailLink).toBeVisible()

        const href = await emailLink.getAttribute('href')
        expect(href).toMatch(/^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    })

    test('should have valid phone link', async ({ page }) => {
        const phoneLink = page.locator('a[href^="tel:"]')
        if ((await phoneLink.count()) === 0) {
            test.skip(true, 'No phone link on page')
            return
        }

        const href = await phoneLink.getAttribute('href')
        expect(href).toMatch(/^tel:\+?[0-9-]+$/)
    })

    test('should have LinkedIn link with security attributes', async ({ page }) => {
        const linkedinLink = page.locator('a[href*="linkedin.com"]')
        await expect(linkedinLink).toBeVisible()

        const target = await linkedinLink.getAttribute('target')
        const rel = await linkedinLink.getAttribute('rel')

        expect(target).toBe('_blank')
        expect(rel).toContain('noopener')
    })

    test('should have GitHub link with security attributes', async ({ page }) => {
        const githubLink = page.locator('a[href*="github.com"]')
        await expect(githubLink).toBeVisible()

        const target = await githubLink.getAttribute('target')
        const rel = await githubLink.getAttribute('rel')

        expect(target).toBe('_blank')
        expect(rel).toContain('noopener')
    })

    test('LinkedIn link should have accessible label', async ({ page }) => {
        const linkedinLink = page.locator('a[href*="linkedin.com"]')
        const ariaLabel = await linkedinLink.getAttribute('aria-label')

        expect(ariaLabel).toBeTruthy()
        expect(ariaLabel?.toLowerCase()).toContain('linkedin')
    })

    test('GitHub link should have accessible label', async ({ page }) => {
        const githubLink = page.locator('a[href*="github.com"]')
        const ariaLabel = await githubLink.getAttribute('aria-label')

        expect(ariaLabel).toBeTruthy()
        expect(ariaLabel?.toLowerCase()).toContain('github')
    })
})

test.describe('External Links - Security', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('all external links should have security attributes', async ({ page }) => {
        const externalLinks = page.locator('a[href^="http"]:not([href*="joshdoes.it"]):not([href*="localhost"])')
        const count = await externalLinks.count()

        for (let i = 0; i < count; i++) {
            const link = externalLinks.nth(i)
            const href = await link.getAttribute('href')
            const target = await link.getAttribute('target')
            const rel = await link.getAttribute('rel')

            if (target === '_blank') {
                expect(rel, `Link ${href} missing noopener`).toContain('noopener')
            }
        }
    })

    test('Google Maps link should work correctly', async ({ page }) => {
        const mapsLink = page.locator('a[href*="maps.google.com"]')
        if ((await mapsLink.count()) === 0) {
            test.skip(true, 'No Google Maps link on page')
            return
        }

        const target = await mapsLink.getAttribute('target')
        const rel = await mapsLink.getAttribute('rel')

        expect(target).toBe('_blank')
        expect(rel).toContain('noopener')
    })
})

test.describe('About Section - Contact Info', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('should display contact information in about section', async ({ page }) => {
        const aboutSection = page.locator('#about')
        const emailInAbout = aboutSection.locator('a[href^="mailto:"]')
        const emailExists = await emailInAbout.count() > 0
        expect(emailExists).toBe(true)
    })

    test('email links should be clickable and styled', async ({ page }) => {
        const emailLink = page.locator('a[href^="mailto:"]').first()
        const isClickable = await emailLink.isEnabled()
        expect(isClickable).toBe(true)
    })
})
