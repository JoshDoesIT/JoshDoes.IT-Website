import { test, expect } from '@playwright/test';

test.describe('Blog Image Modal', () => {
    test('should expand image when clicked after client-side navigation', async ({ page }) => {
        // Navigate to home first
        await page.goto('/');

        // Navigate to blog index
        await page.locator('a[href="/blog"]').first().click();
        await expect(page).toHaveURL('/blog');

        // Search for the specific post to ensure it's visible (handling pagination)
        await page.getByPlaceholder('Search posts...').fill('MCP');

        // Find the specific post link and click it
        const postLink = page.locator('a[href*="/blog/mcp-llm-nsc-reviews"]');
        await expect(postLink).toBeVisible();
        await postLink.click();

        // Wait for article to load
        await expect(page.locator('article')).toBeVisible();

        // Find an image within the article
        const blogImage = page.locator('.blog-image').first();
        if (await blogImage.count() === 0) {
            test.skip(true, 'No images found in the first blog post');
            return;
        }

        // Ensure image is visible before interacting
        await expect(blogImage).toBeVisible();

        // Click to expand
        await blogImage.click();

        // Assert modal is visible
        const modal = page.locator('#imageModal');
        await expect(modal).toBeVisible();

        // Assert modal image has correct source
        const modalImage = page.locator('#modalImage');
        await expect(modalImage).toBeVisible();

        const originalSrc = await blogImage.getAttribute('src');
        const modalSrc = await modalImage.getAttribute('src');
        expect(modalSrc).toBe(originalSrc);

        // Close modal
        const closeButton = page.locator('#closeModal');
        await closeButton.click();

        // Assert modal is hidden
        await expect(modal).toBeHidden();
    });
});
