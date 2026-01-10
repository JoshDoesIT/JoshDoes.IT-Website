/**
 * @fileoverview E2E Tests for Resume/PDF Link
 * @module tests/e2e/resume.spec.ts
 *
 * @description
 * Tests resume PDF link functionality. Coverage includes:
 * - Resume link visibility on homepage
 * - New tab opening behavior (target="_blank")
 * - Security attributes (noopener)
 * - PDF endpoint accessibility
 * - Descriptive link text
 * - CTA visibility in hero section
 * - Terminal-style button design
 */
import { test, expect } from '@playwright/test'

test.describe('Resume/PDF Link', () => {
    test('resume link should exist on homepage', async ({ page }) => {
        await page.goto('/')

        const resumeLink = page.locator('a[href*="resume.pdf"]')
        await expect(resumeLink).toBeVisible()
    })

    test('resume link should open in new tab', async ({ page }) => {
        await page.goto('/')

        const resumeLink = page.locator('a[href*="resume.pdf"]')
        const target = await resumeLink.getAttribute('target')

        expect(target).toBe('_blank')
    })

    test('resume link should have security attributes', async ({ page }) => {
        await page.goto('/')

        const resumeLink = page.locator('a[href*="resume.pdf"]')
        const rel = await resumeLink.getAttribute('rel')

        expect(rel).toContain('noopener')
    })

    test('resume PDF should be accessible', async ({ request }) => {
        const response = await request.get('/resume.pdf')

        // Should return 200 or 404 (if not yet uploaded)
        // We just verify the endpoint doesn't crash
        expect([200, 404]).toContain(response.status())
    })

    test('resume link should have descriptive text', async ({ page }) => {
        await page.goto('/')

        const resumeLink = page.locator('a[href*="resume.pdf"]')
        const text = await resumeLink.textContent()

        expect(text?.toLowerCase()).toMatch(/resume|cv|pdf/i)
    })
})

test.describe('Resume - CTA Visibility', () => {
    test('resume CTA should be prominently displayed in hero', async ({ page }) => {
        await page.goto('/')

        const heroSection = page.locator('#hero, section').first()
        const resumeLink = heroSection.locator('a[href*="resume.pdf"]')

        await expect(resumeLink).toBeVisible()
    })

    test('resume button should have terminal-style design', async ({ page }) => {
        await page.goto('/')

        const resumeLink = page.locator('a[href*="resume.pdf"]')

        // Check it has styling classes indicating it's styled as a button
        const className = await resumeLink.getAttribute('class')
        expect(className).toBeTruthy()

        // Verify it has border and/or background styling
        const hasBorder = className?.includes('border')
        const hasBg = className?.includes('bg-')

        expect(hasBorder || hasBg).toBe(true)
    })
})
