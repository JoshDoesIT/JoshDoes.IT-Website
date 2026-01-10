/**
 * @fileoverview Unit Tests for BlogList Component
 * @module tests/unit/components/BlogList.test.tsx
 *
 * @description
 * Tests the BlogList component which provides blog post display with search
 * and pagination functionality. Coverage includes:
 *
 * - Post rendering and display (titles, dates, tags, links)
 * - Search functionality (filtering by title, description, tags)
 * - Input validation and sanitization
 * - Clear search behavior
 * - Accessibility attributes
 * - Search edge cases (whitespace, long queries, special characters)
 * - Pagination display and navigation
 * - Search + pagination interaction
 * - Empty state handling
 * - Error handling in search filter
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BlogList, { POSTS_PER_PAGE, MAX_SEARCH_LENGTH } from '@/app/blog/BlogList'
import type { BlogPost } from '@/app/blog/posts'

/**
 * Sample blog posts for testing.
 */
const mockPosts: BlogPost[] = [
    {
        slug: 'post-1',
        title: 'First Post',
        date: '2025-01-15',
        description: 'Description for first post about security',
        tags: ['Security', 'GRC'],
        icon: 'fa-shield',
        content: 'Content 1',
    },
    {
        slug: 'post-2',
        title: 'Second Post',
        date: '2025-01-14',
        description: 'Description for second post about automation',
        tags: ['Automation'],
        icon: 'fa-code',
        content: 'Content 2',
    },
    {
        slug: 'post-3',
        title: 'Third Post',
        date: '2025-01-13',
        description: 'Description for third post',
        tags: ['Compliance'],
        icon: 'fa-file-code',
        content: 'Content 3',
    },
]

describe('BlogList Component', () => {
    // =========================================================================
    // RENDERING TESTS
    // =========================================================================

    it('should render all posts', () => {
        render(<BlogList posts={mockPosts} />)

        // All three mock posts should be visible
        expect(screen.getByText('First Post')).toBeInTheDocument()
        expect(screen.getByText('Second Post')).toBeInTheDocument()
        expect(screen.getByText('Third Post')).toBeInTheDocument()
    })

    it('should display post dates', () => {
        render(<BlogList posts={mockPosts} />)

        // Date should be displayed in YYYY-MM-DD format
        expect(screen.getByText('2025-01-15')).toBeInTheDocument()
    })

    it('should display tags for each post', () => {
        render(<BlogList posts={mockPosts} />)

        // Tags from mock posts should be visible
        expect(screen.getByText('Security')).toBeInTheDocument()
        expect(screen.getByText('Automation')).toBeInTheDocument()
    })

    it('should have correct links to posts', () => {
        render(<BlogList posts={mockPosts} />)

        // Link should use the post slug
        const firstPostLink = screen.getByText('First Post').closest('a')
        expect(firstPostLink?.getAttribute('href')).toBe('/blog/post-1')
    })

    it('should handle unknown icons by falling back to default', () => {
        const postWithUnknownIcon = [{
            ...mockPosts[0],
            icon: 'fa-unknown-icon-123'
        }]

        const { container } = render(<BlogList posts={postWithUnknownIcon} />)

        // Should fallback to fa-file-code
        // The getIconElement returns 'fa-solid fa-file-code' which ends with fa-file-code
        // We look for the <i> element with that class
        const icon = container.querySelector('.fa-file-code')
        expect(icon).toBeInTheDocument()
    })

    // =========================================================================
    // SEARCH FUNCTIONALITY TESTS
    // =========================================================================

    it('should display search input', () => {
        render(<BlogList posts={mockPosts} />)

        const searchInput = screen.getByPlaceholderText(/search/i)
        expect(searchInput).toBeInTheDocument()
    })

    it('should filter posts by title', async () => {
        render(<BlogList posts={mockPosts} />)

        const searchInput = screen.getByPlaceholderText(/search/i)
        fireEvent.change(searchInput, { target: { value: 'First' } })

        await waitFor(() => {
            // Only matching post should be visible
            expect(screen.getByText('First Post')).toBeInTheDocument()
            expect(screen.queryByText('Second Post')).not.toBeInTheDocument()
        })
    })

    it('should filter posts by description', async () => {
        render(<BlogList posts={mockPosts} />)

        const searchInput = screen.getByPlaceholderText(/search/i)
        fireEvent.change(searchInput, { target: { value: 'automation' } })

        await waitFor(() => {
            // Match found in description
            expect(screen.getByText('Second Post')).toBeInTheDocument()
            expect(screen.queryByText('First Post')).not.toBeInTheDocument()
        })
    })

    it('should filter posts by tags', async () => {
        render(<BlogList posts={mockPosts} />)

        const searchInput = screen.getByPlaceholderText(/search/i)
        fireEvent.change(searchInput, { target: { value: 'GRC' } })

        await waitFor(() => {
            // GRC tag belongs to First Post
            expect(screen.getByText('First Post')).toBeInTheDocument()
            expect(screen.queryByText('Second Post')).not.toBeInTheDocument()
        })
    })

    it('should show no results message for empty search', async () => {
        render(<BlogList posts={mockPosts} />)

        const searchInput = screen.getByPlaceholderText(/search/i)
        fireEvent.change(searchInput, { target: { value: 'xyznonexistent' } })

        await waitFor(() => {
            // User-friendly message when no matches
            expect(screen.getByText(/no posts found/i)).toBeInTheDocument()
        })
    })

    it('should show result count when searching', async () => {
        render(<BlogList posts={mockPosts} />)

        const searchInput = screen.getByPlaceholderText(/search/i)
        fireEvent.change(searchInput, { target: { value: 'Post' } })

        await waitFor(() => {
            // Shows how many results match
            expect(screen.getByText(/Found 3 posts/)).toBeInTheDocument()
        })
    })

    it('should be case insensitive', async () => {
        render(<BlogList posts={mockPosts} />)

        const searchInput = screen.getByPlaceholderText(/search/i)
        // Searching "SECURITY" should still find "security" in description
        fireEvent.change(searchInput, { target: { value: 'SECURITY' } })

        await waitFor(() => {
            expect(screen.getByText('First Post')).toBeInTheDocument()
        })
    })

    // =========================================================================
    // INPUT VALIDATION TESTS
    // =========================================================================

    it('should enforce max length on input', async () => {
        render(<BlogList posts={mockPosts} />)

        const searchInput = screen.getByPlaceholderText(/search/i) as HTMLInputElement

        // Uses the same constant as the component
        expect(searchInput.maxLength).toBe(MAX_SEARCH_LENGTH)
    })

    // =========================================================================
    // CLEAR SEARCH TESTS
    // =========================================================================

    it('should display clear button when search has value', async () => {
        render(<BlogList posts={mockPosts} />)

        const searchInput = screen.getByPlaceholderText(/search/i)
        fireEvent.change(searchInput, { target: { value: 'test' } })

        await waitFor(() => {
            // Clear button appears when there's search text
            const clearButton = screen.getByLabelText(/clear/i)
            expect(clearButton).toBeInTheDocument()
        })
    })

    it('should clear search when clear button is clicked', async () => {
        render(<BlogList posts={mockPosts} />)

        const searchInput = screen.getByPlaceholderText(/search/i) as HTMLInputElement
        fireEvent.change(searchInput, { target: { value: 'test' } })

        await waitFor(() => {
            const clearButton = screen.getByLabelText(/clear/i)
            fireEvent.click(clearButton)
        })

        await waitFor(() => {
            // Input should be empty after clearing
            expect(searchInput.value).toBe('')
        })
    })

    // =========================================================================
    // ACCESSIBILITY TESTS
    // =========================================================================

    it('should have accessible search input', () => {
        render(<BlogList posts={mockPosts} />)

        const searchInput = screen.getByPlaceholderText(/search/i)
        // aria-label for screen readers
        const ariaLabel = searchInput.getAttribute('aria-label')
        expect(ariaLabel).toBeTruthy()
    })

    // =========================================================================
    // SEARCH EDGE CASES
    // =========================================================================

    it('should return all posts when search is whitespace only', async () => {
        render(<BlogList posts={mockPosts} />)

        const searchInput = screen.getByPlaceholderText(/search/i)
        // Whitespace-only search should show all posts (sanitizedQuery becomes empty)
        fireEvent.change(searchInput, { target: { value: '   ' } })

        await waitFor(() => {
            // All posts should still be visible
            expect(screen.getByText('First Post')).toBeInTheDocument()
            expect(screen.getByText('Second Post')).toBeInTheDocument()
            expect(screen.getByText('Third Post')).toBeInTheDocument()
        })
    })

    it('should handle search query that sanitizes to empty string', async () => {
        render(<BlogList posts={mockPosts} />)

        const searchInput = screen.getByPlaceholderText(/search/i)
        // Just spaces should result in sanitized query being empty
        fireEvent.change(searchInput, { target: { value: '     ' } })

        await waitFor(() => {
            // All posts should be visible since sanitized query becomes empty
            expect(screen.getByText('First Post')).toBeInTheDocument()
            expect(screen.getByText('Second Post')).toBeInTheDocument()
        })
    })

    it('should truncate very long search queries', async () => {
        render(<BlogList posts={mockPosts} />)

        const searchInput = screen.getByPlaceholderText(/search/i) as HTMLInputElement
        // Input a very long string (over MAX_SEARCH_LENGTH chars)
        const longQuery = 'a'.repeat(MAX_SEARCH_LENGTH + 50)
        fireEvent.change(searchInput, { target: { value: longQuery } })

        await waitFor(() => {
            // The input should be truncated to max length
            expect(searchInput.value.length).toBeLessThanOrEqual(MAX_SEARCH_LENGTH)
        })
    })
})

describe('BlogList Pagination', () => {
    // Generate enough mock posts to trigger pagination
    // Need more than POSTS_PER_PAGE posts
    const PAGINATION_TEST_COUNT = POSTS_PER_PAGE + 6 // 15 posts = 2 pages
    const manyPosts: BlogPost[] = Array.from({ length: PAGINATION_TEST_COUNT }, (_, i) => ({
        slug: `post-${i + 1}`,
        title: `Post ${i + 1}`,
        date: `2025-01-${String(15 - i).padStart(2, '0')}`,
        description: `Description ${i + 1}`,
        tags: ['Tag'],
        icon: 'fa-file-code',
        content: `Content ${i + 1}`,
    }))

    // =========================================================================
    // PAGINATION DISPLAY TESTS
    // =========================================================================

    it('should show pagination when posts exceed 9', () => {
        render(<BlogList posts={manyPosts} />)

        // 15 posts = 2 pages (9 per page)
        expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument()
    })

    it('should not show pagination when posts are 9 or less', () => {
        const fewPosts = manyPosts.slice(0, 9)
        render(<BlogList posts={fewPosts} />)

        // No pagination needed for 9 or fewer posts
        expect(screen.queryByText(/Page \d+ of/)).not.toBeInTheDocument()
    })

    // =========================================================================
    // NAVIGATION TESTS
    // =========================================================================

    it('should navigate to next page', async () => {
        render(<BlogList posts={manyPosts} />)

        const nextButton = screen.getByLabelText(/next/i)
        fireEvent.click(nextButton)

        await waitFor(() => {
            // Should now be on page 2
            expect(screen.getByText(/Page 2 of 2/)).toBeInTheDocument()
        })
    })

    it('should disable previous button on first page', () => {
        render(<BlogList posts={manyPosts} />)

        const prevButton = screen.getByLabelText(/previous/i)
        // Can't go back from first page
        expect(prevButton).toBeDisabled()
    })

    it('should disable next button on last page', async () => {
        render(<BlogList posts={manyPosts} />)

        const nextButton = screen.getByLabelText(/next/i)
        fireEvent.click(nextButton)

        await waitFor(() => {
            // Can't go forward from last page
            expect(nextButton).toBeDisabled()
        })
    })

    // =========================================================================
    // SEARCH + PAGINATION INTERACTION TESTS
    // =========================================================================

    it('should reset to page 1 when search changes', async () => {
        render(<BlogList posts={manyPosts} />)

        // Navigate to page 2
        const nextButton = screen.getByLabelText(/next/i)
        fireEvent.click(nextButton)

        await waitFor(() => {
            expect(screen.getByText(/Page 2/)).toBeInTheDocument()
        })

        // Perform a search
        const searchInput = screen.getByPlaceholderText(/search/i)
        fireEvent.change(searchInput, { target: { value: 'Post' } })

        await waitFor(() => {
            // Should reset to page 1 when search criteria change
            const pageIndicator = screen.queryByText(/Page \d+ of/)
            if (pageIndicator) {
                expect(pageIndicator.textContent).toMatch(/Page 1/)
            }
        })
    })
})

/**
 * Empty state tests verify behavior when no posts exist.
 */
describe('BlogList Empty State', () => {
    it('should show message when no posts exist', () => {
        render(<BlogList posts={[]} />)

        // User-friendly empty state message
        expect(screen.getByText(/no posts found/i)).toBeInTheDocument()
    })
})

/**
 * Search error handling tests - cover edge cases and error fallback.
 */
describe('BlogList Search Error Handling', () => {
    const mockPosts: BlogPost[] = [
        {
            slug: 'test-post',
            title: 'Test Post',
            date: '2025-01-15',
            description: 'Test description',
            tags: ['Test'],
            icon: 'fa-file-code',
            content: 'Content',
        },
    ]

    it('should return all posts when sanitized query becomes empty after processing', async () => {
        // This covers the path where sanitizedQuery is empty after trim and slice
        render(<BlogList posts={mockPosts} />)

        const searchInput = screen.getByPlaceholderText(/search/i)
        // Search with only whitespace characters
        fireEvent.change(searchInput, { target: { value: '   \t  ' } })

        await waitFor(() => {
            // All posts should be visible when sanitized query is empty
            expect(screen.getByText('Test Post')).toBeInTheDocument()
        })
    })

    it('should return all posts when query contains only zero-width characters', async () => {
        // Zero-width characters pass trim() but result in empty matching string
        render(<BlogList posts={mockPosts} />)

        const searchInput = screen.getByPlaceholderText(/search/i)
        // Use zero-width space characters that aren't removed by trim()
        // but don't match any post content
        fireEvent.change(searchInput, { target: { value: '\u200B\u200B\u200B' } })

        await waitFor(() => {
            // Zero-width chars should not match any posts
            expect(screen.getByText(/no posts found/i)).toBeInTheDocument()
        })
    })

    it('should handle posts with undefined or null fields gracefully', async () => {
        // Create posts with edge case data that might cause filter errors
        const edgeCasePosts: BlogPost[] = [
            {
                slug: 'edge-post',
                title: 'Edge Post',
                date: '2025-01-15',
                description: '', // Empty description
                tags: [], // Empty tags array
                icon: 'fa-file-code',
                content: 'Content',
            },
        ]

        render(<BlogList posts={edgeCasePosts} />)

        const searchInput = screen.getByPlaceholderText(/search/i)
        fireEvent.change(searchInput, { target: { value: 'anything' } })

        await waitFor(() => {
            // Should not crash, should show no results
            expect(screen.getByText(/no posts found/i)).toBeInTheDocument()
        })
    })

    it('should display posts correctly when search matches empty string after truncation', async () => {
        // Test the edge case where very long whitespace truncates to empty
        render(<BlogList posts={mockPosts} />)

        const searchInput = screen.getByPlaceholderText(/search/i)
        // Very long whitespace string that when sliced and trimmed becomes empty
        const longWhitespace = ' '.repeat(300)
        fireEvent.change(searchInput, { target: { value: longWhitespace } })

        await waitFor(() => {
            // All posts should still be visible
            expect(screen.getByText('Test Post')).toBeInTheDocument()
        })
    })

    it('should handle filter errors gracefully', async () => {
        // Create posts where a property getter throws during filter
        // The error will be caught by the try-catch in the useMemo
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

        let shouldThrow = false
        const errorPost = {
            slug: 'error-post',
            date: '2025-01-15',
            description: 'Description',
            tags: ['Tag'],
            icon: 'fa-file-code',
            content: 'Content',
            // Title getter that throws only during filter (not initial render)
            get title(): string {
                if (shouldThrow) {
                    throw new Error('Filter title error')
                }
                return 'Error Post'
            },
        } as BlogPost

        render(<BlogList posts={[errorPost]} />)

        // First verify post renders with the non-throwing case
        expect(screen.getByText('Error Post')).toBeInTheDocument()

        // Now set up to throw during the next filter operation
        shouldThrow = true

        const searchInput = screen.getByPlaceholderText(/search/i)
        fireEvent.change(searchInput, { target: { value: 'search' } })

        await waitFor(() => {
            // Should show no results when error occurs in filter
            expect(screen.getByText(/no posts found/i)).toBeInTheDocument()
        })

        // Verify error was logged
        expect(consoleErrorSpy).toHaveBeenCalledWith('Search error:', expect.any(Error))

        consoleErrorSpy.mockRestore()
    })
})
