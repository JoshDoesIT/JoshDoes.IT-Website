/**
 * @fileoverview E2E Tests for Accessibility (WCAG Compliance)
 * @feature WCAG 2.1 AA accessibility compliance
 */
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { ACCESSIBILITY } from '../constants'

test.describe('Accessibility - Homepage', () => {
    test('should have no accessibility violations', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('header')).toBeVisible()

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze()

        const failingViolations = accessibilityScanResults.violations.filter(
            v => ACCESSIBILITY.FAIL_ON_SEVERITIES.includes(v.impact as typeof ACCESSIBILITY.FAIL_ON_SEVERITIES[number])
        )
        const minorViolations = accessibilityScanResults.violations.filter(
            v => v.impact === 'minor'
        )

        if (minorViolations.length > 0) {
            console.log(`ℹ️ ${minorViolations.length} minor a11y violations (informational):`)
            minorViolations.forEach(v => {
                console.log(`  - ${v.id}: ${v.description} (${v.impact})`)
            })
        }

        if (failingViolations.length > 0) {
            const details = failingViolations.map(v =>
                `${v.id} (${v.impact}): ${v.description}`
            ).join('\n')
            expect(failingViolations, `Accessibility violations found:\n${details}`).toEqual([])
        }
    })

    test('should be keyboard navigable', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('header')).toBeVisible()

        await page.keyboard.press('Tab')

        const focusedElement = await page.evaluate(() => {
            const el = document.activeElement
            return el ? el.tagName.toLowerCase() : null
        })

        expect(focusedElement).toBeTruthy()
    })

    test('should have skip to main content link or proper landmarks', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('header')).toBeVisible()

        const skipLink = page.locator('a[href="#main"], a[href="#content"], [class*="skip"]')
        const mainLandmark = page.locator('main, [role="main"]')

        const hasSkipLink = (await skipLink.count()) > 0
        const hasMainLandmark = (await mainLandmark.count()) > 0

        // Should have at least skip link OR main landmark
        expect(hasMainLandmark || hasSkipLink, 'Page should have main landmark or skip link').toBe(true)
    })

    test('all images should have alt attributes', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('header')).toBeVisible()

        const images = page.locator('img')
        const count = await images.count()

        for (let i = 0; i < count; i++) {
            const img = images.nth(i)
            const alt = await img.getAttribute('alt')
            const role = await img.getAttribute('role')

            const hasAlt = alt !== null
            const isDecorative = role === 'presentation' || role === 'none'

            expect(hasAlt || isDecorative).toBe(true)
        }
    })

    test('interactive elements should be focusable', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('header')).toBeVisible()

        const links = page.locator('a[href]')
        const count = await links.count()

        for (let i = 0; i < Math.min(count, ACCESSIBILITY.MAX_LINKS_TO_CHECK); i++) {
            const link = links.nth(i)
            const tabindex = await link.getAttribute('tabindex')

            if (tabindex !== null) {
                expect(parseInt(tabindex)).toBeGreaterThanOrEqual(0)
            }
        }
    })
})

test.describe('Accessibility - Blog', () => {
    test('blog page should have no accessibility violations', async ({ page }) => {
        await page.goto('/blog')
        await expect(page.locator('header')).toBeVisible()

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze()

        const failingViolations = accessibilityScanResults.violations.filter(
            v => ACCESSIBILITY.FAIL_ON_SEVERITIES.includes(v.impact as typeof ACCESSIBILITY.FAIL_ON_SEVERITIES[number])
        )

        if (failingViolations.length > 0) {
            const details = failingViolations.map(v =>
                `${v.id} (${v.impact}): ${v.description}`
            ).join('\n')
            expect(failingViolations, `Accessibility violations found:\n${details}`).toEqual([])
        }
    })

    test('blog post should have proper heading structure', async ({ page }) => {
        await page.goto('/blog')
        await expect(page.locator('header')).toBeVisible()

        const postLink = page.locator('a[href*="/blog/"]').first()
        if ((await postLink.count()) === 0) {
            test.skip(true, 'No blog posts available to test heading structure')
            return
        }

        await postLink.click()
        await expect(page.locator('header')).toBeVisible()

        const h1 = page.locator('h1')
        await expect(h1.first()).toBeVisible()
    })
})

test.describe('Accessibility - Color Contrast', () => {
    test('text should have sufficient color contrast', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('header')).toBeVisible()

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['cat.color'])
            .analyze()

        const contrastViolations = accessibilityScanResults.violations.filter(
            v => v.id === 'color-contrast' && (v.impact === 'critical' || v.impact === 'serious')
        )

        expect(contrastViolations).toEqual([])
    })
})
