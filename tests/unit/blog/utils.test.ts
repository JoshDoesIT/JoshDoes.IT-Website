/**
 * @fileoverview Unit Tests for Blog Utility Functions
 *
 * Tests utility functions used across blog pages including date formatting,
 * read time estimation, icon mapping, and related post discovery.
 *
 * @module blog/utils
 * @location app/blog/utils.ts
 *
 * @description
 * Test coverage includes:
 *
 * 1. **formatDate** - Date string formatting
 * 2. **estimateReadTime** - Word count based read time estimation
 * 3. **getIconElement** - Font Awesome icon class mapping
 * 4. **getPreviousPost** - Previous post navigation
 * 5. **getNextPost** - Next post navigation
 * 6. **getRelatedPosts** - Related posts by tags
 *
 * @note The fs module is mocked to provide controlled blog post data
 * for testing navigation and related post functions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    formatDate,
    estimateReadTime,
    getIconElement,
    getPreviousPost,
    getNextPost,
    getRelatedPosts
} from '@/app/blog/utils'

/**
 * Mock the fs module for post-related tests.
 * This allows testing getPreviousPost, getNextPost, and getRelatedPosts
 * with controlled test data.
 */
vi.mock('fs', () => ({
    default: {
        existsSync: vi.fn(),
        readdirSync: vi.fn(),
        readFileSync: vi.fn(),
    },
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
}))

import fs from 'fs'

const mockFs = vi.mocked(fs)

/**
 * Helper to create mock post content with frontmatter.
 */
function createMockPost(
    title: string,
    date: string,
    tags: string[] = [],
    _slug?: string
): string {
    return `---
title: '${title}'
date: '${date}'
description: 'Description for ${title}'
tags: [${tags.map(t => `'${t}'`).join(', ')}]
icon: 'fa-file-code'
---
Content for ${title}`
}

describe('Blog Utility Functions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // =========================================================================
    // formatDate Tests
    // =========================================================================

    describe('formatDate', () => {
        it('should format YYYY-MM-DD date correctly', () => {
            expect(formatDate('2025-01-15')).toBe('2025-01-15')
        })

        it('should pad single digit months', () => {
            expect(formatDate('2025-1-15')).toBe('2025-01-15')
        })

        it('should pad single digit days', () => {
            expect(formatDate('2025-01-5')).toBe('2025-01-05')
        })

        it('should handle both single digit month and day', () => {
            expect(formatDate('2025-3-7')).toBe('2025-03-07')
        })
    })

    // =========================================================================
    // estimateReadTime Tests
    // =========================================================================

    describe('estimateReadTime', () => {
        it('should return 1 minute for short content', () => {
            expect(estimateReadTime('Hello world')).toBe(1)
        })

        it('should calculate based on 200 words per minute', () => {
            // 200 words = 1 minute
            const twoHundredWords = Array(200).fill('word').join(' ')
            expect(estimateReadTime(twoHundredWords)).toBe(1)
        })

        it('should round up partial minutes', () => {
            // 250 words = 1.25 minutes, rounds to 2
            const content = Array(250).fill('word').join(' ')
            expect(estimateReadTime(content)).toBe(2)
        })

        it('should handle 400 words as 2 minutes', () => {
            const content = Array(400).fill('word').join(' ')
            expect(estimateReadTime(content)).toBe(2)
        })

        it('should handle empty content', () => {
            expect(estimateReadTime('')).toBe(1)
        })
    })

    // =========================================================================
    // getIconElement Tests
    // =========================================================================

    describe('getIconElement', () => {
        it('should map fa-file-code correctly', () => {
            expect(getIconElement('fa-file-code')).toBe('fa-solid fa-file-code')
        })

        it('should map fa-shield correctly', () => {
            expect(getIconElement('fa-shield')).toBe('fa-solid fa-shield')
        })

        it('should map fa-shield-alt to fa-shield-halved', () => {
            expect(getIconElement('fa-shield-alt')).toBe('fa-solid fa-shield-halved')
        })

        it('should map fa-bug correctly', () => {
            expect(getIconElement('fa-bug')).toBe('fa-solid fa-bug')
        })

        it('should map fa-gavel correctly', () => {
            expect(getIconElement('fa-gavel')).toBe('fa-solid fa-gavel')
        })

        it('should return default for unknown icon', () => {
            expect(getIconElement('fa-unknown')).toBe('fa-solid fa-file-code')
        })

        it('should return default for empty string', () => {
            expect(getIconElement('')).toBe('fa-solid fa-file-code')
        })
    })

    // =========================================================================
    // getPreviousPost Tests
    // =========================================================================

    describe('getPreviousPost', () => {
        it('should return previous (newer) post', () => {
            mockFs.existsSync.mockReturnValue(true)
            mockFs.readdirSync.mockReturnValue([
                'post1.md', 'post2.md', 'post3.md'
            ] as unknown as ReturnType<typeof fs.readdirSync>)
            mockFs.readFileSync
                .mockReturnValueOnce(createMockPost('Post 1', '2025-03-01'))  // oldest
                .mockReturnValueOnce(createMockPost('Post 2', '2025-02-01'))
                .mockReturnValueOnce(createMockPost('Post 3', '2025-01-01'))  // newest in sort

            // Clear and set up fresh mocks for the actual call
            vi.clearAllMocks()
            mockFs.existsSync.mockReturnValue(true)
            mockFs.readdirSync.mockReturnValue([
                'post1.md', 'post2.md', 'post3.md'
            ] as unknown as ReturnType<typeof fs.readdirSync>)
            mockFs.readFileSync
                .mockReturnValueOnce(createMockPost('Post 1', '2025-03-01'))
                .mockReturnValueOnce(createMockPost('Post 2', '2025-02-01'))
                .mockReturnValueOnce(createMockPost('Post 3', '2025-01-01'))

            // post2 is in the middle, previous should be post1 (newer date)
            const prev = getPreviousPost('post2')
            expect(prev?.slug).toBe('post1')
        })

        it('should return undefined for first post', () => {
            mockFs.existsSync.mockReturnValue(true)
            mockFs.readdirSync.mockReturnValue([
                'post1.md', 'post2.md'
            ] as unknown as ReturnType<typeof fs.readdirSync>)
            mockFs.readFileSync
                .mockReturnValueOnce(createMockPost('Post 1', '2025-02-01'))
                .mockReturnValueOnce(createMockPost('Post 2', '2025-01-01'))

            // post1 is first (newest), no previous
            const prev = getPreviousPost('post1')
            expect(prev).toBeUndefined()
        })
    })

    // =========================================================================
    // getNextPost Tests
    // =========================================================================

    describe('getNextPost', () => {
        it('should return next (older) post', async () => {
            const posts = await import('@/app/blog/posts')
            const spy = vi.spyOn(posts, 'getAllPosts').mockReturnValue([
                { slug: 'post1', title: 'Post 1', date: '2025-03-01', description: '', tags: [], icon: '', content: '' },
                { slug: 'post2', title: 'Post 2', date: '2025-02-01', description: '', tags: [], icon: '', content: '' },
                { slug: 'post3', title: 'Post 3', date: '2025-01-01', description: '', tags: [], icon: '', content: '' },
            ])

            // post1 is first (newest), next should be post2 (older)
            const next = getNextPost('post1')
            expect(next?.slug).toBe('post2')
            spy.mockRestore()
        })

        it('should return undefined for last post', async () => {
            const posts = await import('@/app/blog/posts')
            const spy = vi.spyOn(posts, 'getAllPosts').mockReturnValue([
                { slug: 'post1', title: 'Post 1', date: '2025-02-01', description: '', tags: [], icon: '', content: '' },
                { slug: 'post2', title: 'Post 2', date: '2025-01-01', description: '', tags: [], icon: '', content: '' },
            ])

            // post2 is last (oldest), no next
            const next = getNextPost('post2')
            expect(next).toBeUndefined()
            spy.mockRestore()
        })
    })

    // =========================================================================
    // getRelatedPosts Tests
    // =========================================================================

    describe('getRelatedPosts', () => {
        it('should find posts with shared tags', () => {
            mockFs.existsSync.mockReturnValue(true)
            mockFs.readdirSync.mockReturnValue([
                'post1.md', 'post2.md', 'post3.md'
            ] as unknown as ReturnType<typeof fs.readdirSync>)
            // First 3 calls for getAllPosts, then 1 call for getPostBySlug
            mockFs.readFileSync
                .mockReturnValueOnce(createMockPost('Post 1', '2025-03-01', ['Security', 'GRC']))
                .mockReturnValueOnce(createMockPost('Post 2', '2025-02-01', ['Security']))
                .mockReturnValueOnce(createMockPost('Post 3', '2025-01-01', ['Other']))
                .mockReturnValueOnce(createMockPost('Post 1', '2025-03-01', ['Security', 'GRC'])) // getPostBySlug

            const related = getRelatedPosts('post1', 2)
            // post2 shares 'Security' tag
            expect(related.some(p => p.slug === 'post2')).toBe(true)
        })

        it('should return empty array for non-existent post', () => {
            mockFs.existsSync.mockReturnValue(false)

            const related = getRelatedPosts('nonexistent')
            expect(related).toEqual([])
        })

        it('should fill with recent posts when not enough tag matches', () => {
            mockFs.existsSync.mockReturnValue(true)
            mockFs.readdirSync.mockReturnValue([
                'post1.md', 'post2.md', 'post3.md'
            ] as unknown as ReturnType<typeof fs.readdirSync>)
            mockFs.readFileSync
                .mockReturnValueOnce(createMockPost('Post 1', '2025-03-01', ['UniqueTag']))
                .mockReturnValueOnce(createMockPost('Post 2', '2025-02-01', ['Other']))
                .mockReturnValueOnce(createMockPost('Post 3', '2025-01-01', ['Different']))
                .mockReturnValueOnce(createMockPost('Post 1', '2025-03-01', ['UniqueTag'])) // getPostBySlug

            const related = getRelatedPosts('post1', 2)
            // No tag matches, should fall back to recent posts
            expect(related.length).toBe(2)
        })

        it('should exclude current post from results', () => {
            mockFs.existsSync.mockReturnValue(true)
            mockFs.readdirSync.mockReturnValue([
                'post1.md', 'post2.md'
            ] as unknown as ReturnType<typeof fs.readdirSync>)
            mockFs.readFileSync
                .mockReturnValueOnce(createMockPost('Post 1', '2025-02-01', ['Tag']))
                .mockReturnValueOnce(createMockPost('Post 2', '2025-01-01', ['Tag']))
                .mockReturnValueOnce(createMockPost('Post 1', '2025-02-01', ['Tag'])) // getPostBySlug

            const related = getRelatedPosts('post1', 2)
            expect(related.every(p => p.slug !== 'post1')).toBe(true)
        })

        it('should respect limit parameter', () => {
            mockFs.existsSync.mockReturnValue(true)
            mockFs.readdirSync.mockReturnValue([
                'post1.md', 'post2.md', 'post3.md', 'post4.md'
            ] as unknown as ReturnType<typeof fs.readdirSync>)
            mockFs.readFileSync
                .mockReturnValueOnce(createMockPost('Post 1', '2025-04-01', ['Tag']))
                .mockReturnValueOnce(createMockPost('Post 2', '2025-03-01', ['Tag']))
                .mockReturnValueOnce(createMockPost('Post 3', '2025-02-01', ['Tag']))
                .mockReturnValueOnce(createMockPost('Post 4', '2025-01-01', ['Tag']))
                .mockReturnValueOnce(createMockPost('Post 1', '2025-04-01', ['Tag'])) // getPostBySlug

            const related = getRelatedPosts('post1', 1)
            expect(related.length).toBe(1)
        })
    })
})
