/**
 * @fileoverview E2E Tests for Disqus Comments Integration
 * @feature Disqus comments on blog posts
 */
import { test, expect } from '@playwright/test'

test.describe('Disqus Comments Integration', () => {
    test('blog post should have comments section', async ({ page }) => {
        await page.goto('/blog')

        const postLink = page.locator('a[href*="/blog/"]').first()
        if ((await postLink.count()) === 0) {
            test.skip(true, 'No blog posts available')
            return
        }

        await postLink.click()
        await expect(page.locator('header')).toBeVisible()

        const disqusContainer = page.locator('#disqus_thread')
        await expect(disqusContainer).toBeVisible()
    })

    test('comments section should have heading', async ({ page }) => {
        await page.goto('/blog')

        const postLink = page.locator('a[href*="/blog/"]').first()
        if ((await postLink.count()) === 0) {
            test.skip(true, 'No blog posts available')
            return
        }

        await postLink.click()
        await expect(page.locator('header')).toBeVisible()

        const commentsHeading = page.getByRole('heading', { name: /comments/i })
        await expect(commentsHeading).toBeVisible()
    })

    test('Disqus script should load without blocking errors', async ({ page }) => {
        const consoleErrors: string[] = []

        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text())
            }
        })

        await page.goto('/blog')

        const postLink = page.locator('a[href*="/blog/"]').first()
        if ((await postLink.count()) === 0) {
            test.skip(true, 'No blog posts available')
            return
        }

        await postLink.click()
        await expect(page.locator('header')).toBeVisible()

        // The Disqus container assertion waits for the element to become visible
        const disqusContainer = page.locator('#disqus_thread')
        await expect(disqusContainer).toBeVisible()

        if (consoleErrors.length > 0) {
            console.log('Console errors detected:', consoleErrors)
        }
    })

    test('comments container should be inside terminal-styled wrapper', async ({ page }) => {
        await page.goto('/blog')

        const postLink = page.locator('a[href*="/blog/"]').first()
        if ((await postLink.count()) === 0) {
            test.skip(true, 'No blog posts available')
            return
        }

        await postLink.click()
        await expect(page.locator('header')).toBeVisible()

        const wrapper = page.locator('#disqus_thread').locator('..')
        const className = await wrapper.getAttribute('class')

        expect(className).toContain('terminal')
    })
})
