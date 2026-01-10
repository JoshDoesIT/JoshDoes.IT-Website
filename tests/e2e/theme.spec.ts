/**
 * @fileoverview E2E Tests for Terminal Theme
 * @feature Terminal theme consistency
 */
import { test, expect } from '@playwright/test'

test.describe('Theme Consistency', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('should have dark terminal background', async ({ page }) => {
        const body = page.locator('body')
        const bgColor = await body.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor
        })

        const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        expect(match, 'Body background should be parseable RGB').toBeTruthy()
        if (match) {
            const [, r, g, b] = match.map(Number)
            expect(r).toBeLessThan(50)
            expect(g).toBeLessThan(50)
            expect(b).toBeLessThan(50)
        }
    })

    test('should use terminal green accent color', async ({ page }) => {
        const greenElements = page.locator('.text-terminal-green')
        const count = await greenElements.count()
        expect(count).toBeGreaterThan(0)
    })

    test('should have consistent border styling', async ({ page }) => {
        const borderedElements = page.locator('.border-terminal-border')
        const count = await borderedElements.count()
        expect(count).toBeGreaterThan(0)
    })

    test('should not flash light mode on initial load', async ({ page }) => {
        await page.route('**/*', async (route) => {
            await route.continue()
        })

        await page.goto('/')

        const initialBg = await page.locator('body').evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor
        })

        const match = initialBg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        expect(match, 'Body background should be parseable RGB').toBeTruthy()
        if (match) {
            const [, r, g, b] = match.map(Number)
            expect(r).toBeLessThan(100)
            expect(g).toBeLessThan(100)
            expect(b).toBeLessThan(100)
        }
    })

    test('blog page should maintain terminal theme', async ({ page }) => {
        await page.goto('/blog')

        const body = page.locator('body')
        const bgColor = await body.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor
        })

        const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        expect(match, 'Body background should be parseable RGB').toBeTruthy()
        if (match) {
            const [, r, g, b] = match.map(Number)
            expect(r).toBeLessThan(50)
            expect(g).toBeLessThan(50)
            expect(b).toBeLessThan(50)
        }
    })

    test('text should be readable against dark background', async ({ page }) => {
        const grayText = page.locator('.text-terminal-gray').first()
        if ((await grayText.count()) === 0) {
            test.skip(true, 'No terminal-gray text elements on page')
            return
        }

        const color = await grayText.evaluate((el) => {
            return window.getComputedStyle(el).color
        })

        const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        expect(match, 'Text color should be parseable RGB').toBeTruthy()
        if (match) {
            const [, r, g, b] = match.map(Number)
            expect(Math.max(r, g, b)).toBeGreaterThan(100)
        }
    })
})

test.describe('Theme - Interactive States', () => {
    test('links should have hover state styling', async ({ page }) => {
        await page.goto('/')

        const link = page.locator('a.hover\\:text-terminal-green, a.hover\\:text-white').first()
        if ((await link.count()) === 0) {
            test.skip(true, 'No links with hover styling on page')
            return
        }

        const className = await link.getAttribute('class')
        expect(className).toContain('transition')
    })

    test('buttons should have hover styling', async ({ page }) => {
        await page.goto('/')

        const button = page.locator('a.hover\\:bg-terminal-green').first()
        if ((await button.count()) === 0) {
            test.skip(true, 'No buttons with hover styling on page')
            return
        }

        const className = await button.getAttribute('class')
        expect(className).toContain('transition')
    })
})
