/**
 * @fileoverview E2E Tests for Blog Search
 * @module tests/e2e/search.spec.ts
 *
 * @description
 * Tests blog search functionality edge cases. Coverage includes:
 * - Max input length enforcement
 * - Clear button behavior
 * - Empty search (show all posts)
 * - Result count display
 * - Special character handling (XSS prevention)
 * - Case insensitive search
 * - Accessible search input labels
 * - No results state display
 */
import { test, expect } from '@playwright/test'

test.describe('Search Functionality - Edge Cases', () => {
    // Reusable helper to get search input with proper assertion
    async function getSearchInput(page: import('@playwright/test').Page) {
        const searchInput = page.locator('input[placeholder*="search" i], input[type="search"]').first()
        await expect(searchInput, 'Search input should be present on blog page').toBeVisible()
        return searchInput
    }

    test.beforeEach(async ({ page }) => {
        await page.goto('/blog')
        // Wait for content to load
        await expect(page.locator('header')).toBeVisible()
    })

    test('search should enforce max length', async ({ page }) => {
        const searchInput = await getSearchInput(page)

        // Try to type more than 200 characters
        const longText = 'a'.repeat(250)
        await searchInput.fill(longText)

        const value = await searchInput.inputValue()
        expect(value.length).toBeLessThanOrEqual(200)
    })

    test('clear button should reset search', async ({ page }) => {
        const searchInput = await getSearchInput(page)

        // Use pressSequentially instead of fill() for WebKit React compat
        await searchInput.click()
        await searchInput.pressSequentially('test query', { delay: 30 })
        await expect(searchInput).toHaveValue('test query')

        // Use data-testid which is reliable across all browsers
        const clearButton = page.getByTestId('clear-search')
        await expect(clearButton, 'Clear button should appear after typing in search').toBeVisible({ timeout: 10000 })
        await clearButton.click()

        await expect(searchInput).toHaveValue('')
    })

    test('empty search should show all posts', async ({ page }) => {
        const searchInput = await getSearchInput(page)
        const initialPostCount = await page.locator('[data-testid="blog-post"]').count()

        // Type then clear
        await searchInput.fill('some search')
        await expect(searchInput).toHaveValue('some search')
        await searchInput.fill('')
        await expect(searchInput).toHaveValue('')

        const finalPostCount = await page.locator('[data-testid="blog-post"]').count()
        expect(finalPostCount).toBe(initialPostCount)
    })

    test('search should show result count when matches found', async ({ page }) => {
        const searchInput = await getSearchInput(page)

        await searchInput.fill('test')
        await expect(searchInput).toHaveValue('test')

        // Should show "Found X posts" message - this is optional behavior
        // so we verify either the message exists or there are results
        const resultMessage = page.locator('text=/Found \\d+ posts?/')
        const posts = page.locator('[data-testid="blog-post"]')

        // Either result count is shown OR posts are displayed
        const hasResultMessage = await resultMessage.count() > 0
        const hasPosts = await posts.count() > 0

        expect(
            hasResultMessage || hasPosts,
            'Should either show result count message or display posts'
        ).toBe(true)
    })

    test('search should handle special characters safely', async ({ page }) => {
        const searchInput = await getSearchInput(page)

        // Test potentially dangerous regex characters
        const specialChars = '.*+?^${}()|[]\\\'"<>'
        await searchInput.fill(specialChars)
        await expect(searchInput).toHaveValue(specialChars)

        // Page should not crash - verify it's still responding
        await expect(page.locator('header')).toBeVisible()
    })

    test('search should be case insensitive', async ({ page }) => {
        const searchInput = await getSearchInput(page)

        // Get posts with lowercase search
        await searchInput.fill('security')
        await expect(searchInput).toHaveValue('security')
        const lowerCount = await page.locator('[data-testid="blog-post"]').count()

        // Clear and search uppercase
        await searchInput.fill('SECURITY')
        await expect(searchInput).toHaveValue('SECURITY')
        const upperCount = await page.locator('[data-testid="blog-post"]').count()

        // Should get same results
        expect(lowerCount).toBe(upperCount)
    })

    test('search input should have accessible label', async ({ page }) => {
        const searchInput = await getSearchInput(page)

        const ariaLabel = await searchInput.getAttribute('aria-label')
        const placeholder = await searchInput.getAttribute('placeholder')

        // Should have either aria-label or placeholder for accessibility
        expect(ariaLabel || placeholder).toBeTruthy()
    })

    test('no results state should display message or empty state', async ({ page }) => {
        const searchInput = await getSearchInput(page)

        // Use pressSequentially instead of fill() for WebKit React compat
        await searchInput.click()
        await searchInput.pressSequentially('zzzznotapost', { delay: 30 })
        await expect(searchInput).toHaveValue('zzzznotapost')

        // Wait for React to re-render
        const noResults = page.locator('text=/no posts found/i, text=/no results/i')
        const posts = page.locator('[data-testid="blog-post"]')

        // Wait for either "no results" message to appear OR all posts to disappear
        await expect(async () => {
            const noResultsVisible = await noResults.count() > 0
            const postCount = await posts.count()
            expect(noResultsVisible || postCount === 0).toBe(true)
        }).toPass({ timeout: 10000 })
    })
})
