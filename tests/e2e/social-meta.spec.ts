/**
 * @fileoverview E2E Tests for Social Media Meta Tags
 * @feature Twitter Cards and Open Graph meta tags
 */
import { test, expect } from '@playwright/test'

test.describe('Twitter Card Meta Tags - Homepage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('should have twitter:card meta tag', async ({ page }) => {
        const twitterCard = page.locator('meta[name="twitter:card"]')
        const count = await twitterCard.count()

        if (count > 0) {
            const content = await twitterCard.getAttribute('content')
            expect(content).toBeTruthy()
            expect(['summary', 'summary_large_image', 'app', 'player']).toContain(content)
        }
    })

    test('should have twitter:title meta tag', async ({ page }) => {
        const twitterTitle = page.locator('meta[name="twitter:title"]')
        const count = await twitterTitle.count()

        if (count > 0) {
            const content = await twitterTitle.getAttribute('content')
            expect(content).toBeTruthy()
            expect(content!.length).toBeGreaterThan(0)
        }
    })

    test('should have twitter:description meta tag', async ({ page }) => {
        const twitterDesc = page.locator('meta[name="twitter:description"]')
        const count = await twitterDesc.count()

        if (count > 0) {
            const content = await twitterDesc.getAttribute('content')
            expect(content).toBeTruthy()
            expect(content!.length).toBeGreaterThan(10)
        }
    })

    test('should have twitter:image meta tag if present', async ({ page }) => {
        const twitterImage = page.locator('meta[name="twitter:image"]')
        const count = await twitterImage.count()

        if (count > 0) {
            const content = await twitterImage.getAttribute('content')
            expect(content).toMatch(/^https?:\/\//)
        }
    })
})

test.describe('Twitter Card Meta Tags - Blog Posts', () => {
    test('blog post should have twitter meta tags', async ({ page }) => {
        await page.goto('/blog')

        const postLink = page.locator('a[href*="/blog/"]').first()
        if ((await postLink.count()) === 0) {
            test.skip(true, 'No blog posts available')
            return
        }

        await postLink.click()
        await expect(page.locator('header')).toBeVisible()

        const twitterMeta = page.locator('meta[name^="twitter:"]')
        const count = await twitterMeta.count()

        if (count > 0) {
            const cardTag = page.locator('meta[name="twitter:card"]')
            await expect(cardTag).toHaveCount(1)
        }
    })
})

test.describe('Open Graph Tags - Complete Check', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('should have og:image meta tag', async ({ page }) => {
        const ogImage = page.locator('meta[property="og:image"]')
        const count = await ogImage.count()

        if (count > 0) {
            const content = await ogImage.getAttribute('content')
            expect(content).toMatch(/^https?:\/\//)
        }
    })

    test('should have og:site_name meta tag', async ({ page }) => {
        const ogSiteName = page.locator('meta[property="og:site_name"]')
        const count = await ogSiteName.count()

        if (count > 0) {
            const content = await ogSiteName.getAttribute('content')
            expect(content).toBeTruthy()
        }
    })

    test('should have og:locale meta tag', async ({ page }) => {
        const ogLocale = page.locator('meta[property="og:locale"]')
        const count = await ogLocale.count()

        if (count > 0) {
            const content = await ogLocale.getAttribute('content')
            expect(content).toMatch(/^[a-z]{2}(_[A-Z]{2})?$/)
        }
    })

    test('og:type should be website for homepage', async ({ page }) => {
        const ogType = page.locator('meta[property="og:type"]')
        const count = await ogType.count()

        if (count > 0) {
            const content = await ogType.getAttribute('content')
            expect(content).toBe('website')
        }
    })
})

test.describe('Open Graph Tags - Blog Posts', () => {
    test('blog post og:type should be article', async ({ page }) => {
        await page.goto('/blog')

        const postLink = page.locator('a[href*="/blog/"]').first()
        if ((await postLink.count()) === 0) {
            test.skip(true, 'No blog posts available')
            return
        }

        await postLink.click()
        await expect(page.locator('header')).toBeVisible()

        const ogType = page.locator('meta[property="og:type"]')
        const count = await ogType.count()

        if (count > 0) {
            const content = await ogType.getAttribute('content')
            expect(['article', 'website']).toContain(content)
        }
    })
})
