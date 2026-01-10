/**
 * @fileoverview Unit Tests for Blog Posts Module
 * @module tests/unit/blog/posts.test.ts
 *
 * @description
 * Tests the blog posts module which handles reading and parsing markdown
 * blog posts from the filesystem. Coverage includes:
 *
 * getAllPosts:
 * - Empty state (missing directory)
 * - Date-based sorting (newest first)
 * - Frontmatter parsing (title, date, description, tags, icon)
 * - File filtering (.md files only)
 * - Default values for missing frontmatter
 *
 * getPostBySlug:
 * - Input validation (path traversal, XSS, invalid characters)
 * - File existence checking
 * - Successful post retrieval
 * - Default values for missing frontmatter
 * - Valid slug pattern acceptance
 * - Path traversal guard
 *
 * @note The fs module is mocked to provide controlled test data.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAllPosts, getPostBySlug } from '@/app/blog/posts'

/**
 * Mock the Node.js fs module.
 * This provides fine-grained control over file existence and content.
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

describe('Blog Posts Module', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // =========================================================================
    // getAllPosts Tests
    // =========================================================================

    describe('getAllPosts', () => {
        // ---------------------------------------------------------------------
        // EMPTY STATE TESTS
        // ---------------------------------------------------------------------

        it('should return empty array when posts directory does not exist', () => {
            mockFs.existsSync.mockReturnValue(false)

            const posts = getAllPosts()

            // Gracefully handles missing directory
            expect(posts).toEqual([])
        })

        // ---------------------------------------------------------------------
        // SORTING TESTS
        // ---------------------------------------------------------------------

        it('should return posts sorted by date (newest first)', () => {
            mockFs.existsSync.mockReturnValue(true)
            mockFs.readdirSync.mockReturnValue(['post1.md', 'post2.md'] as unknown as ReturnType<typeof fs.readdirSync>)
            mockFs.readFileSync
                .mockReturnValueOnce(`---
title: 'Older Post'
date: '2025-01-01'
description: 'First post'
tags: ['test']
icon: 'fa-file'
---
Content 1`)
                .mockReturnValueOnce(`---
title: 'Newer Post'
date: '2025-06-15'
description: 'Second post'
tags: ['test']
icon: 'fa-code'
---
Content 2`)

            const posts = getAllPosts()

            // Newer post should appear first
            expect(posts).toHaveLength(2)
            expect(posts[0].title).toBe('Newer Post')
            expect(posts[1].title).toBe('Older Post')
        })

        // ---------------------------------------------------------------------
        // FRONTMATTER PARSING TESTS
        // ---------------------------------------------------------------------

        it('should parse frontmatter correctly', () => {
            mockFs.existsSync.mockReturnValue(true)
            mockFs.readdirSync.mockReturnValue(['test-post.md'] as unknown as ReturnType<typeof fs.readdirSync>)
            mockFs.readFileSync.mockReturnValue(`---
title: 'Test Post Title'
date: '2025-03-20'
description: 'A test description'
tags: ['Security', 'Automation']
icon: 'fa-shield-alt'
---
# Test Content

This is the body.`)

            const posts = getAllPosts()

            // Verify all frontmatter fields are extracted correctly
            expect(posts).toHaveLength(1)
            expect(posts[0]).toMatchObject({
                slug: 'test-post',
                title: 'Test Post Title',
                date: '2025-03-20',
                description: 'A test description',
                tags: ['Security', 'Automation'],
                icon: 'fa-shield-alt',
            })
            // Content should exclude frontmatter
            expect(posts[0].content).toContain('# Test Content')
        })

        // ---------------------------------------------------------------------
        // FILE FILTERING TESTS
        // ---------------------------------------------------------------------

        it('should only include .md files', () => {
            mockFs.existsSync.mockReturnValue(true)
            mockFs.readdirSync.mockReturnValue(['post.md', 'image.png', 'notes.txt'] as unknown as ReturnType<typeof fs.readdirSync>)
            mockFs.readFileSync.mockReturnValue(`---
title: 'Only MD Post'
date: '2025-01-01'
---
Content`)

            const posts = getAllPosts()

            // Should ignore non-markdown files
            expect(posts).toHaveLength(1)
            expect(posts[0].slug).toBe('post')
        })

        // ---------------------------------------------------------------------
        // DEFAULT VALUE TESTS
        // ---------------------------------------------------------------------

        it('should provide default values for missing frontmatter fields', () => {
            mockFs.existsSync.mockReturnValue(true)
            mockFs.readdirSync.mockReturnValue(['minimal.md'] as unknown as ReturnType<typeof fs.readdirSync>)
            mockFs.readFileSync.mockReturnValue(`---
---
Just content, no metadata`)

            const posts = getAllPosts()

            // Sensible defaults for missing fields
            expect(posts[0]).toMatchObject({
                slug: 'minimal',
                title: '',
                date: '',
                description: '',
                tags: [],
                icon: 'fa-file-code', // Default icon
            })
        })
    })

    // =========================================================================
    // getPostBySlug Tests
    // =========================================================================

    describe('getPostBySlug', () => {
        // ---------------------------------------------------------------------
        // SECURITY / INPUT VALIDATION TESTS
        // ---------------------------------------------------------------------

        it('should return undefined for invalid slug characters', () => {
            // These patterns could be used for path traversal or injection attacks
            const invalidSlugs = [
                '../../../etc/passwd',  // Path traversal
                'post<script>',         // XSS attempt
                'post with spaces',     // Invalid URL characters
                'post.md',              // File extension in slug
                'post/subdir',          // Directory traversal
                '../../secret',         // Relative path escape
            ]

            for (const slug of invalidSlugs) {
                const result = getPostBySlug(slug)
                expect(result).toBeUndefined()
            }
        })

        // ---------------------------------------------------------------------
        // FILE EXISTENCE TESTS
        // ---------------------------------------------------------------------

        it('should return undefined when post file does not exist', () => {
            mockFs.existsSync.mockReturnValue(false)

            const result = getPostBySlug('nonexistent-post')

            expect(result).toBeUndefined()
        })

        // ---------------------------------------------------------------------
        // SUCCESSFUL RETRIEVAL TESTS
        // ---------------------------------------------------------------------

        it('should return post data for valid slug', () => {
            mockFs.existsSync.mockReturnValue(true)
            mockFs.readFileSync.mockReturnValue(`---
title: 'My Blog Post'
date: '2025-05-10'
description: 'A great post'
tags: ['GRC', 'Compliance']
icon: 'fa-check'
---
# Introduction

This is the post content.`)

            const result = getPostBySlug('my-blog-post')

            expect(result).toBeDefined()
            expect(result).toMatchObject({
                slug: 'my-blog-post',
                title: 'My Blog Post',
                date: '2025-05-10',
                description: 'A great post',
                tags: ['GRC', 'Compliance'],
                icon: 'fa-check',
            })
        })

        it('should provide default values for missing frontmatter in getPostBySlug', () => {
            // This tests the fallback defaults at lines 81-85
            mockFs.existsSync.mockReturnValue(true)
            mockFs.readFileSync.mockReturnValue(`---
---
Just content, no frontmatter values`)

            const result = getPostBySlug('minimal-post')

            // Should use fallback defaults for missing fields
            expect(result).toBeDefined()
            expect(result).toMatchObject({
                slug: 'minimal-post',
                title: '',
                date: '',
                description: '',
                tags: [],
                icon: 'fa-file-code',
            })
        })

        // ---------------------------------------------------------------------
        // VALID SLUG PATTERN TESTS
        // ---------------------------------------------------------------------

        it('should accept valid slug patterns', () => {
            // These are all valid URL-safe slug patterns
            const validSlugs = [
                'simple-post',
                'post_with_underscores',
                'post123',
                'POST-uppercase',
                'a',
                '123',
            ]

            mockFs.existsSync.mockReturnValue(false) // Just testing validation, not file read

            for (const slug of validSlugs) {
                // Should not return undefined due to validation - only due to file not existing
                getPostBySlug(slug)
                // If it passed validation, existsSync would be called
                expect(mockFs.existsSync).toHaveBeenCalled()
            }
        })

        // ---------------------------------------------------------------------
        // PATH TRAVERSAL GUARD TESTS
        // ---------------------------------------------------------------------

        it('should return undefined when resolved path escapes posts directory', () => {
            // Mock path module to simulate a resolved path that escapes the directory
            // This can happen with certain edge cases or symlinks
            const path = require('path')
            const originalResolve = path.resolve

            // First call returns a path outside the posts directory
            // The component makes two resolve calls: one for fullPath, one for postsDirectory
            let resolveCallCount = 0
            vi.spyOn(path, 'resolve').mockImplementation((...args: unknown[]) => {
                resolveCallCount++
                if (resolveCallCount === 1) {
                    // fullPath resolve - return path that doesn't start with posts dir
                    return '/some/other/directory/malicious.md'
                }
                // postsDirectory resolve
                return originalResolve(...(args as string[]))
            })

            // existsSync returns true to get past the first check
            mockFs.existsSync.mockReturnValue(true)

            const result = getPostBySlug('valid-slug')

            // Should return undefined because path doesn't start with posts directory
            expect(result).toBeUndefined()

            // Restore
            vi.mocked(path.resolve).mockRestore()
        })
    })
})
