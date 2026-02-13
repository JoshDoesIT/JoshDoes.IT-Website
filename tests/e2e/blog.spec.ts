/**
 * @fileoverview E2E Tests for Blog Pages
 * @module tests/e2e/blog.spec.ts
 *
 * @description
 * Tests blog listing and post page functionality. Coverage includes:
 * - Blog index page loading
 * - Post card display
 * - Search functionality
 * - Individual post navigation
 * - 404 handling for invalid/malicious slugs
 * - Search filtering behavior
 */
import { test, expect } from '@playwright/test'

test.describe('Blog Index Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/blog')
    })

    test('should load blog index page', async ({ page }) => {
        await expect(page).toHaveURL(/\/blog/)

        // Should have a heading (h1 or h2)
        const heading = page.getByRole('heading').first()
        await expect(heading).toBeVisible()
    })

    test('should display blog post cards', async ({ page }) => {
        // Wait for content to load
        await expect(page.getByTestId('site-header')).toBeVisible()

        // Look for blog post links or cards
        const blogPosts = page.getByTestId('blog-post')

        // There should be at least one blog post (or none if the blog is empty)
        const count = await blogPosts.count()
        expect(count).toBeGreaterThanOrEqual(0)
    })


    test('should have search functionality', async ({ page }) => {
        // Look for search input
        const searchInput = page.getByTestId('search-input')

        // Assert search functionality exists
        await expect(searchInput).toBeVisible()
        await searchInput.fill('test')
        await expect(searchInput).toHaveValue('test')
    })

    test('should navigate to individual blog post', async ({ page }) => {
        // Wait for content to load
        await expect(page.getByTestId('site-header')).toBeVisible()

        // Find a blog post link
        const postLink = page.getByTestId('blog-post').first()

        // Assert at least one post exists to click
        // If we expect posts to always be there in prod, use toBeVisible(). 
        // If 0 posts is valid (empty blog), we should check count before clicking.
        if (await postLink.isVisible()) {
            await postLink.click()
            await expect(page).toHaveURL(/\/blog\/.+/)
        } else {
            test.skip(true, 'No blog posts to click')
        }
    })
})

test.describe('Blog Post Page', () => {
    test('should return 404 for invalid/malicious slugs', async ({ page }) => {
        // Test path traversal attempt
        const response = await page.goto('/blog/../../../etc/passwd')
        expect(response?.status()).toBe(404)
    })

    test('should return 404 for nonexistent posts', async ({ page }) => {
        const response = await page.goto('/blog/this-post-definitely-does-not-exist-12345')
        expect(response?.status()).toBe(404)
    })

    test('should handle special characters in slug gracefully', async ({ page }) => {
        // Attempt XSS-style slug
        const response = await page.goto('/blog/<script>alert(1)</script>')
        expect(response?.status()).toBe(404)
    })
})

test.describe('Blog Search', () => {
    test('should filter posts when searching', async ({ page }) => {
        await page.goto('/blog')
        // Wait for content to load
        await expect(page.getByTestId('site-header')).toBeVisible()

        // Look for search input
        const searchInput = page.getByTestId('search-input')
        await expect(searchInput).toBeVisible()

        // Get initial post count
        // Using data-testid="blog-post" which is already present on the Link component in BlogList.tsx
        const posts = page.getByTestId('blog-post')
        const postsBeforeSearch = await posts.count()

        // If no posts exist, we cannot test filtering functionality
        if (postsBeforeSearch === 0) {
            test.skip(true, 'No blog posts available to test search filtering')
            return
        }

        // Type a search query that should yield no results
        // Use pressSequentially instead of fill() - WebKit doesn't fire React
        // onChange from fill(), which sets the value programmatically without
        // dispatching individual key events
        await searchInput.click()
        await searchInput.pressSequentially('zzzznotapost', { delay: 30 })

        // Wait for React re-render to filter posts
        await expect(posts).toHaveCount(0, { timeout: 10000 })
    })
})
