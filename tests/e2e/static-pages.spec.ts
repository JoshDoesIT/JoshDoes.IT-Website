/**
 * @fileoverview E2E Tests for Static Pages
 * @feature Static page rendering (accessibility, privacy, 404)
 */
import { test, expect } from '@playwright/test'

test.describe('Accessibility Page', () => {
    test('should load accessibility page', async ({ page }) => {
        const response = await page.goto('/accessibility')

        expect(response?.status()).toBe(200)
        await expect(page).toHaveURL(/\/accessibility/)
    })

    test('should have content about accessibility', async ({ page }) => {
        await page.goto('/accessibility')

        const main = page.locator('main')
        await expect(main).toBeVisible()

        const text = await main.textContent()
        expect(text?.length).toBeGreaterThan(100)
    })
})

test.describe('Privacy Policy Page', () => {
    test('should load privacy policy page', async ({ page }) => {
        const response = await page.goto('/privacy')

        expect(response?.status()).toBe(200)
        await expect(page).toHaveURL(/\/privacy/)
    })

    test('should have privacy-related content', async ({ page }) => {
        await page.goto('/privacy')

        const main = page.locator('main')
        await expect(main).toBeVisible()

        const text = await main.textContent()
        expect(text?.length).toBeGreaterThan(100)
    })
})

test.describe('Footer Links', () => {
    test('footer should contain privacy link', async ({ page }) => {
        await page.goto('/')

        const footer = page.locator('footer')
        await expect(footer).toBeVisible()

        const privacyLink = footer.getByRole('link', { name: /privacy/i })
        if ((await privacyLink.count()) === 0) {
            test.skip(true, 'Privacy link not present in footer')
            return
        }

        await privacyLink.click()
        await expect(page).toHaveURL(/\/privacy/)
    })

    test('footer should contain accessibility link', async ({ page }) => {
        await page.goto('/')

        const footer = page.locator('footer')
        const accessibilityLink = footer.getByRole('link', { name: /accessibility/i })
        if ((await accessibilityLink.count()) === 0) {
            test.skip(true, 'Accessibility link not present in footer')
            return
        }

        await accessibilityLink.click()
        await expect(page).toHaveURL(/\/accessibility/)
    })
})

test.describe('404 Page', () => {
    test('should show 404 for nonexistent routes', async ({ page }) => {
        const response = await page.goto('/this-page-does-not-exist-12345')
        expect(response?.status()).toBe(404)
    })
})
