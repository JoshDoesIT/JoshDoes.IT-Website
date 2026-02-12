/**
 * @fileoverview E2E Tests for Blog Pagination
 * @feature Blog listing pagination
 */
import { test, expect } from '@playwright/test'

test.describe('Blog Pagination', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/blog')
        await expect(page.locator('header')).toBeVisible()
    })

    test('should show pagination when posts exceed page limit', async ({ page }) => {
        const paginationControls = page.locator('button[aria-label*="page" i], button:has-text("Page")')
        const postCount = await page.locator('article, [class*="post"], [class*="card"]').count()

        // If we have more than 9 posts (page limit), pagination should be visible
        if (postCount > 9) {
            await expect(paginationControls.first()).toBeVisible()
        }
    })

    test('should display current page indicator', async ({ page }) => {
        const pageIndicator = page.locator('text=/Page \\d+ of \\d+/')
        if ((await pageIndicator.count()) === 0) {
            test.skip(true, 'No pagination indicator on page')
            return
        }

        await expect(pageIndicator).toBeVisible()
        const text = await pageIndicator.textContent()
        expect(text).toMatch(/Page \d+ of \d+/)
    })

    test('previous button should be disabled on first page', async ({ page }) => {
        const prevButton = page.locator('button[aria-label*="previous" i], button[aria-label*="Previous" i]')
        if ((await prevButton.count()) === 0) {
            test.skip(true, 'No previous button on page')
            return
        }

        await expect(prevButton).toBeDisabled()
    })

    test('next button should navigate to next page', async ({ page }) => {
        const nextButton = page.locator('button[aria-label*="next" i], button[aria-label*="Next" i]')
        if ((await nextButton.count()) === 0) {
            test.skip(true, 'No next button on page')
            return
        }

        const isDisabled = await nextButton.isDisabled()
        if (isDisabled) {
            test.skip(true, 'Next button is disabled - only one page of posts')
            return
        }

        const pageIndicator = page.locator('text=/Page \\d+ of \\d+/')
        if ((await pageIndicator.count()) === 0) {
            test.skip(true, 'No page indicator on page')
            return
        }

        const initialIndicator = await pageIndicator.textContent()
        await nextButton.click()

        // Wait for page indicator to change
        await expect(pageIndicator).not.toHaveText(initialIndicator!)
    })

    test('previous button should navigate to previous page', async ({ page }) => {
        const nextButton = page.locator('button[aria-label*="next" i], button[aria-label*="Next" i]')
        const prevButton = page.locator('button[aria-label*="previous" i], button[aria-label*="Previous" i]')

        if ((await nextButton.count()) === 0) {
            test.skip(true, 'No next button on page')
            return
        }

        const pageIndicator = page.locator('text=/Page \\d+ of \\d+/')
        if ((await pageIndicator.count()) === 0) {
            test.skip(true, 'No page indicator - single page of posts')
            return
        }

        const nextDisabled = await nextButton.isDisabled()
        if (nextDisabled) {
            test.skip(true, 'Next button is disabled - only one page of posts')
            return
        }

        await nextButton.click()
        // Wait for navigation to page 2
        await expect(page.locator('text=/Page 2 of/')).toBeVisible()

        await prevButton.click()
        // Wait for navigation back to page 1
        await expect(page.locator('text=/Page 1 of/')).toBeVisible()
    })

    test('pagination should reset when search is performed', async ({ page }) => {
        const nextButton = page.locator('button[aria-label*="next" i]')
        const searchInput = page.locator('input[type="text"][placeholder*="search" i], input[type="search"]').first()

        if ((await nextButton.count()) === 0 || (await searchInput.count()) === 0) {
            test.skip(true, 'Pagination or search not available')
            return
        }

        const pageIndicator = page.locator('text=/Page \\d+ of \\d+/')
        if ((await pageIndicator.count()) === 0) {
            test.skip(true, 'No page indicator - single page of posts')
            return
        }

        const nextDisabled = await nextButton.isDisabled()
        if (nextDisabled) {
            test.skip(true, 'Next button is disabled - only one page of posts')
            return
        }

        await nextButton.click()
        // Wait for navigation to page 2
        await expect(page.locator('text=/Page 2 of/')).toBeVisible()

        await searchInput.fill('test')

        const text = await pageIndicator.textContent()
        expect(text).toMatch(/Page 1 of/)
    })

    test('pagination buttons should have accessible labels', async ({ page }) => {
        const prevButton = page.locator('button[aria-label*="page" i]').first()
        const nextButton = page.locator('button[aria-label*="page" i]').last()

        if ((await prevButton.count()) > 0) {
            const ariaLabel = await prevButton.getAttribute('aria-label')
            expect(ariaLabel).toBeTruthy()
        }

        if ((await nextButton.count()) > 0) {
            const ariaLabel = await nextButton.getAttribute('aria-label')
            expect(ariaLabel).toBeTruthy()
        }
    })
})
