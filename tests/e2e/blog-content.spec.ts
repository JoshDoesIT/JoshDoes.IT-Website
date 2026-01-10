/**
 * @fileoverview E2E Tests for Blog Post Content
 * @feature Blog markdown rendering and content elements
 */
import { test, expect } from '@playwright/test'

test.describe('Blog Content - Markdown Rendering', () => {
    test('blog posts should render markdown content', async ({ page }) => {
        await page.goto('/blog')

        const postLink = page.locator('a[href*="/blog/"]').first()
        if ((await postLink.count()) === 0) {
            test.skip(true, 'No blog posts available')
            return
        }

        await postLink.click()
        await expect(page.locator('header')).toBeVisible()

        // Page should have article content
        const content = page.locator('article, main, [class*="content"], [class*="post"]')
        await expect(content.first()).toBeVisible()
    })

    test('code blocks should be rendered properly', async ({ page }) => {
        await page.goto('/blog')

        const postLink = page.locator('a[href*="/blog/"]').first()
        if ((await postLink.count()) === 0) {
            test.skip(true, 'No blog posts available')
            return
        }

        await postLink.click()
        await expect(page.locator('header')).toBeVisible()

        // Check if any code blocks exist - this is optional content
        const codeBlocks = page.locator('pre code, pre, code')
        const codeCount = await codeBlocks.count()

        if (codeCount > 0) {
            await expect(codeBlocks.first()).toBeVisible()
        }
    })

    test('headings in blog posts should have proper hierarchy', async ({ page }) => {
        await page.goto('/blog')

        const postLink = page.locator('a[href*="/blog/"]').first()
        if ((await postLink.count()) === 0) {
            test.skip(true, 'No blog posts available')
            return
        }

        await postLink.click()
        await expect(page.locator('header')).toBeVisible()

        // Should have at least one heading
        const headings = page.locator('h1, h2, h3, h4, h5, h6')
        const count = await headings.count()
        expect(count).toBeGreaterThan(0)
    })
})

test.describe('Blog Content - Links', () => {
    test('internal links should work', async ({ page }) => {
        await page.goto('/blog')

        const postLink = page.locator('a[href*="/blog/"]').first()
        if ((await postLink.count()) === 0) {
            test.skip(true, 'No blog posts available')
            return
        }

        await postLink.click()
        await expect(page.locator('header')).toBeVisible()

        // Look for internal links in the post - optional content
        const internalLinks = page.locator('article a[href^="/"], main a[href^="/"]')
        const linkCount = await internalLinks.count()

        if (linkCount > 0) {
            const firstLink = internalLinks.first()
            await firstLink.click()
            // Should navigate successfully
            await expect(page.locator('header')).toBeVisible()
        }
    })

    test('external links should have security attributes', async ({ page }) => {
        await page.goto('/blog')

        const postLink = page.locator('a[href*="/blog/"]').first()
        if ((await postLink.count()) === 0) {
            test.skip(true, 'No blog posts available')
            return
        }

        await postLink.click()
        await expect(page.locator('header')).toBeVisible()

        // Find external links
        const externalLinks = page.locator('a[href^="http"]:not([href*="localhost"]):not([href*="joshdoes.it"])')
        const count = await externalLinks.count()

        for (let i = 0; i < Math.min(count, 5); i++) {
            const link = externalLinks.nth(i)
            const target = await link.getAttribute('target')
            const rel = await link.getAttribute('rel')

            if (target === '_blank') {
                expect(rel).toContain('noopener')
            }
        }
    })
})

test.describe('Blog Content - Images', () => {
    test('blog post images should load successfully', async ({ page }) => {
        await page.goto('/blog')

        const postLink = page.locator('a[href*="/blog/"]').first()
        if ((await postLink.count()) === 0) {
            test.skip(true, 'No blog posts available')
            return
        }

        await postLink.click()
        await expect(page.locator('header')).toBeVisible()

        const images = page.locator('article img, main img, [class*="content"] img')
        const count = await images.count()

        for (let i = 0; i < count; i++) {
            const img = images.nth(i)
            const isVisible = await img.isVisible()
            if (isVisible) {
                const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth)
                expect(naturalWidth).toBeGreaterThan(0)
            }
        }
    })

    test('images should have alt text', async ({ page }) => {
        await page.goto('/blog')

        const postLink = page.locator('a[href*="/blog/"]').first()
        if ((await postLink.count()) === 0) {
            test.skip(true, 'No blog posts available')
            return
        }

        await postLink.click()
        await expect(page.locator('header')).toBeVisible()

        const images = page.locator('article img, main img')
        const count = await images.count()

        for (let i = 0; i < count; i++) {
            const img = images.nth(i)
            const alt = await img.getAttribute('alt')
            expect(alt).not.toBeNull()
        }
    })
})

test.describe('Blog Content - Tags', () => {
    test('blog posts should display tags if present', async ({ page }) => {
        await page.goto('/blog')
        await expect(page.locator('header')).toBeVisible()

        // Tags are optional but if present should be visible
        const tags = page.locator('[class*="tag"], [class*="badge"], [class*="label"]')
        const count = await tags.count()

        if (count > 0) {
            await expect(tags.first()).toBeVisible()
        }
    })
})
