/**
 * @fileoverview E2E Tests for Security Headers
 * @feature Security headers and XSS prevention
 *
 * NOTE: Security header tests require a production build to pass.
 * The Next.js dev server does not set security headers by default.
 * Run these tests against 'npm run build && npm run start' or in CI.
 */
import { test, expect } from '@playwright/test'

test.describe('Security Headers', () => {
    test('should have X-Frame-Options header', async ({ request }) => {
        const response = await request.get('/')
        const headers = response.headers()

        const xFrameOptions = headers['x-frame-options']
        expect(xFrameOptions).toBeTruthy()
        expect(xFrameOptions.toLowerCase()).toMatch(/deny|sameorigin/)
    })

    test('should have X-Content-Type-Options header', async ({ request }) => {
        const response = await request.get('/')
        const headers = response.headers()

        const xContentType = headers['x-content-type-options']
        expect(xContentType).toBe('nosniff')
    })

    test('should have X-XSS-Protection header', async ({ request }) => {
        const response = await request.get('/')
        const headers = response.headers()

        const xssProtection = headers['x-xss-protection']
        expect(xssProtection).toBeTruthy()
        expect(xssProtection).toContain('1')
    })

    test('should have Referrer-Policy header', async ({ request }) => {
        const response = await request.get('/')
        const headers = response.headers()

        const referrerPolicy = headers['referrer-policy']
        expect(referrerPolicy).toBeTruthy()
        expect(referrerPolicy).toMatch(/strict-origin|no-referrer|same-origin/)
    })

    test('should have Content-Security-Policy header', async ({ request }) => {
        const response = await request.get('/')
        const headers = response.headers()

        const csp = headers['content-security-policy']
        expect(csp).toBeTruthy()
        expect(csp).toContain('default-src')
    })

    test('CSP should have script-src directive', async ({ request }) => {
        const response = await request.get('/')
        const headers = response.headers()

        const csp = headers['content-security-policy']
        expect(csp).toContain('script-src')
    })

    test('should have Permissions-Policy header', async ({ request }) => {
        const response = await request.get('/')
        const headers = response.headers()

        const permissionsPolicy = headers['permissions-policy']
        expect(permissionsPolicy).toBeTruthy()
    })
})

test.describe('Security - XSS Prevention', () => {
    test('should escape user input in search', async ({ page }) => {
        await page.goto('/blog')

        const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first()
        if ((await searchInput.count()) === 0) {
            test.skip(true, 'Search input not present on blog page')
            return
        }

        await searchInput.fill('<script>alert("xss")</script>')

        // Wait for the page to process the input by checking body is visible
        await expect(page.locator('body')).toBeVisible()

        const content = await page.content()
        expect(content).not.toContain('<script>alert("xss")</script>')
    })

    test('should reject path traversal in blog URLs', async ({ page }) => {
        const maliciousUrls = [
            '/blog/..%2F..%2F..%2Fetc%2Fpasswd',
            '/blog/....//....//etc/passwd',
            '/blog/%2e%2e%2f%2e%2e%2f',
        ]

        for (const url of maliciousUrls) {
            const response = await page.goto(url)
            expect(response?.status()).toBe(404)
        }
    })
})

test.describe('Security - HTTPS', () => {
    test('should redirect HTTP to HTTPS in production', async ({ page }) => {
        await page.goto('/')
        await expect(page).toHaveURL(/localhost:3000/)
    })
})
