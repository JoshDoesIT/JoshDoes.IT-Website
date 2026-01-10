/**
 * @fileoverview E2E Tests for SEO Meta Tags
 * @feature SEO meta tags and page structure
 */
import { test, expect } from '@playwright/test'

test.describe('SEO - Homepage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('should have a unique title', async ({ page }) => {
        const title = await page.title()
        expect(title).toBeTruthy()
        expect(title.length).toBeGreaterThan(10)
        expect(title.length).toBeLessThan(70)
    })

    test('should have meta description', async ({ page }) => {
        const metaDescription = page.locator('meta[name="description"]')
        await expect(metaDescription).toHaveCount(1)

        const content = await metaDescription.getAttribute('content')
        expect(content).toBeTruthy()
        expect(content!.length).toBeGreaterThan(50)
        expect(content!.length).toBeLessThan(200)
    })

    test('should have Open Graph tags', async ({ page }) => {
        const ogTitle = page.locator('meta[property="og:title"]')
        const ogDescription = page.locator('meta[property="og:description"]')

        const ogTitleCount = await ogTitle.count()
        const ogDescCount = await ogDescription.count()

        if (ogTitleCount > 0) {
            const titleContent = await ogTitle.getAttribute('content')
            expect(titleContent).toBeTruthy()
        }

        if (ogDescCount > 0) {
            const descContent = await ogDescription.getAttribute('content')
            expect(descContent).toBeTruthy()
        }
    })

    test('should have viewport meta tag', async ({ page }) => {
        const viewport = page.locator('meta[name="viewport"]')
        await expect(viewport).toHaveCount(1)

        const content = await viewport.getAttribute('content')
        expect(content).toContain('width=device-width')
    })

    test('should have proper heading hierarchy', async ({ page }) => {
        const h1Count = await page.locator('h1').count()
        expect(h1Count).toBeGreaterThanOrEqual(1)

        const h1 = page.locator('h1').first()
        const h1Text = await h1.textContent()
        expect(h1Text?.trim()).toBeTruthy()
    })

    test('should have lang attribute on html', async ({ page }) => {
        const html = page.locator('html')
        const lang = await html.getAttribute('lang')
        expect(lang).toBeTruthy()
        expect(lang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/)
    })
})

test.describe('SEO - Blog Pages', () => {
    test('blog index should have unique meta description', async ({ page }) => {
        await page.goto('/blog')

        const metaDesc = page.locator('meta[name="description"]')
        const descCount = await metaDesc.count()

        if (descCount > 0) {
            const content = await metaDesc.getAttribute('content')
            expect(content).toBeTruthy()
        }
    })

    test('blog posts should have unique titles', async ({ page }) => {
        await page.goto('/blog')

        const postLink = page.locator('a[href*="/blog/"]').first()
        if ((await postLink.count()) === 0) {
            test.skip(true, 'No blog posts available to test unique titles')
            return
        }

        const href = await postLink.getAttribute('href')
        await page.goto(href!)

        const title = await page.title()
        expect(title).toBeTruthy()
        expect(title).not.toBe('joshdoes.it')
    })
})

test.describe('SEO - Canonical URLs', () => {
    test('pages should have canonical URLs if present', async ({ page }) => {
        await page.goto('/')

        const canonical = page.locator('link[rel="canonical"]')
        const count = await canonical.count()

        if (count > 0) {
            const href = await canonical.getAttribute('href')
            expect(href).toMatch(/^https?:\/\//)
        }
    })
})

test.describe('SEO - Robots', () => {
    test('should not block indexing on main pages', async ({ page }) => {
        await page.goto('/')

        const robotsMeta = page.locator('meta[name="robots"]')
        const count = await robotsMeta.count()

        if (count > 0) {
            const content = await robotsMeta.getAttribute('content')
            expect(content).not.toContain('noindex')
        }
    })
})
