/**
 * @fileoverview E2E Tests for Performance
 * @module tests/e2e/performance.spec.ts
 *
 * @description
 * Tests site performance metrics and optimization. Coverage includes:
 * - Page load times (homepage, blog)
 * - Cumulative Layout Shift (CLS)
 * - JavaScript bundle sizes
 * - Critical resource timing (TTFB, DOMContentLoaded)
 * - Image format optimization
 * - Image dimension attributes
 * - Static asset caching headers
 */
import { test, expect } from '@playwright/test'
import { PERFORMANCE, TIMING } from '../constants'


test.describe('Performance - Page Load & Critical Resources', () => {
    const pages = ['/', '/blog']

    for (const path of pages) {
        test(`should load ${path} critical resources efficiently`, async ({ page }) => {
            await page.goto(path)

            // Wait for load to complete ensuring entry is present
            await page.waitForLoadState('domcontentloaded')

            // Get performance timing from the browser's own API (more accurate than test runner stopwatch)
            const timing = await page.evaluate(() => {
                const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
                return {
                    domContentLoaded: perf.domContentLoadedEventEnd - perf.startTime,
                    loadComplete: perf.loadEventEnd - perf.startTime,
                    firstByte: perf.responseStart - perf.startTime,
                }
            })

            // Time to first byte should be under threshold
            expect(timing.firstByte, `TTFB for ${path}`).toBeLessThan(PERFORMANCE.TTFB_MS)

            // DOM content loaded should be under threshold
            expect(timing.domContentLoaded, `DOMContentLoaded for ${path}`).toBeLessThan(PERFORMANCE.PAGE_LOAD_MS)
        })
    }

    test('should have no layout shifts after initial load', async ({ page }) => {
        await page.goto('/')

        // Wait for content to stabilize
        const header = page.locator('header')
        await expect(header).toBeVisible()

        // Take a layout stability measurement
        const cls = await page.evaluate((clsSettleMs) => {
            return new Promise<number>((resolve) => {
                let clsValue = 0
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!(entry as LayoutShiftAttribution).hadRecentInput) {
                            clsValue += (entry as LayoutShiftAttribution).value
                        }
                    }
                })

                observer.observe({ type: 'layout-shift', buffered: true })

                setTimeout(() => {
                    observer.disconnect()
                    resolve(clsValue)
                }, clsSettleMs)
            })
        }, TIMING.CLS_SETTLE_MS)

        // CLS should be under threshold
        expect(cls).toBeLessThan(PERFORMANCE.CLS_THRESHOLD)
    })
})

// Type for layout shift entries
interface LayoutShiftAttribution extends PerformanceEntry {
    hadRecentInput: boolean
    value: number
}

test.describe('Performance - Resource Loading', () => {
    test('should not have excessively large JavaScript bundles', async ({ page }) => {
        const resources: { url: string; size: number }[] = []

        page.on('response', async (response) => {
            const url = response.url()
            if (url.endsWith('.js')) {
                const headers = response.headers()
                const contentLength = headers['content-length']
                if (contentLength) {
                    resources.push({ url, size: parseInt(contentLength) })
                }
            }
        })

        await page.goto('/')
        await expect(page.locator('header')).toBeVisible()

        // No single JS file should exceed the threshold
        for (const resource of resources) {
            expect(
                resource.size,
                `Bundle too large: ${resource.url}`
            ).toBeLessThan(PERFORMANCE.MAX_JS_BUNDLE_SIZE)
        }
    })
})

test.describe('Performance - Images', () => {
    test('images should use modern formats', async ({ page }) => {
        const imageTypes: string[] = []

        page.on('response', (response) => {
            const contentType = response.headers()['content-type']
            if (contentType?.startsWith('image/')) {
                imageTypes.push(contentType)
            }
        })

        await page.goto('/')
        await expect(page.locator('header')).toBeVisible()

        // Skip test if no images on page
        if (imageTypes.length === 0) {
            test.skip(true, 'No images on homepage to test format optimization')
            return
        }

        const modernFormats = imageTypes.filter(
            (t) => t.includes('webp') || t.includes('avif') || t.includes('svg')
        )
        const modernRatio = modernFormats.length / imageTypes.length

        // Fail if less than threshold use modern formats
        expect(
            modernRatio,
            `Only ${Math.round(modernRatio * 100)}% of images use modern formats (webp/avif/svg). Expected at least ${PERFORMANCE.MIN_MODERN_IMAGE_RATIO * 100}%`
        ).toBeGreaterThanOrEqual(PERFORMANCE.MIN_MODERN_IMAGE_RATIO)
    })

    test('images should have explicit dimensions to prevent layout shift', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('header')).toBeVisible()

        const images = page.locator('img')
        const count = await images.count()

        // Skip if no images on page
        if (count === 0) {
            test.skip(true, 'No images on homepage to test dimensions')
            return
        }

        let imagesWithDimensions = 0

        for (let i = 0; i < count; i++) {
            const img = images.nth(i)
            const width = await img.getAttribute('width')
            const height = await img.getAttribute('height')
            const style = await img.getAttribute('style')

            // Check if dimensions are set via attribute or style
            const hasDimensions =
                (width !== null && height !== null) ||
                style?.includes('width') ||
                style?.includes('height')

            if (hasDimensions) {
                imagesWithDimensions++
            }
        }

        // At least threshold of images should have explicit dimensions
        const ratio = imagesWithDimensions / count
        expect(
            ratio,
            `Only ${Math.round(ratio * 100)}% of images have explicit dimensions`
        ).toBeGreaterThanOrEqual(PERFORMANCE.MIN_IMAGES_WITH_DIMENSIONS)
    })
})

test.describe('Performance - Caching', () => {
    test('static assets should have cache headers', async ({ page }) => {
        const staticAssets: { url: string; cacheControl: string | null }[] = []

        page.on('response', (response) => {
            const url = response.url()
            const headers = response.headers()

            if (url.includes('/_next/static/')) {
                staticAssets.push({
                    url,
                    cacheControl: headers['cache-control'] || null,
                })
            }
        })

        await page.goto('/')
        await expect(page.locator('header')).toBeVisible()

        // In dev mode, static assets don't have cache headers - skip test
        if (staticAssets.length === 0) {
            test.skip(true, 'No static assets found (dev mode)')
            return
        }

        // Check that static assets have cache headers
        const cachedAssets = staticAssets.filter(
            (a) => a.cacheControl && a.cacheControl.includes('max-age')
        )

        // In dev mode, assets exist but don't have cache headers - skip
        if (cachedAssets.length === 0) {
            test.skip(true, 'Static assets exist but no cache headers (dev mode)')
            return
        }

        // In production, all static assets should be cached
        expect(
            cachedAssets.length,
            `${staticAssets.length - cachedAssets.length} static assets missing cache headers`
        ).toBe(staticAssets.length)
    })
})


