/**
 * @fileoverview Blog Utility Functions
 *
 * Shared utility functions for blog post pages including date formatting,
 * read time estimation, icon mapping, and related post discovery.
 *
 * @module blog/utils
 */

import { getAllPosts, getPostBySlug, type BlogPost } from './posts'

/**
 * Formats a date string in YYYY-MM-DD format.
 * Avoids timezone issues by parsing components directly.
 *
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string
 *
 * @example
 * formatDate('2025-01-15') // Returns '2025-01-15'
 */
export function formatDate(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number)
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/**
 * Estimates the read time for content based on average reading speed.
 *
 * @param content - The text content to analyze
 * @returns Estimated read time in minutes (always at least 1)
 *
 * @example
 * estimateReadTime('This is a short post.') // Returns 1
 * estimateReadTime(longArticle) // Returns calculated minutes
 */
export function estimateReadTime(content: string): number {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
}

/**
 * Maps short icon class names to full Font Awesome class names.
 *
 * @param iconClass - Short icon class (e.g., 'fa-shield')
 * @returns Full Font Awesome class name
 *
 * @example
 * getIconElement('fa-shield') // Returns 'fa-solid fa-shield'
 * getIconElement('unknown')   // Returns 'fa-solid fa-file-code'
 */
export function getIconElement(iconClass: string): string {
    const iconMap: Record<string, string> = {
        'fa-file-code': 'fa-solid fa-file-code',
        'fa-shield': 'fa-solid fa-shield',
        'fa-shield-alt': 'fa-solid fa-shield-halved',
        'fa-bug': 'fa-solid fa-bug',
        'fa-gavel': 'fa-solid fa-gavel',
        'fa-code-branch': 'fa-solid fa-code-branch',
        'fa-network-wired': 'fa-solid fa-network-wired',
        'fa-cloud-arrow-up': 'fa-solid fa-cloud-arrow-up',
        'fa-user-secret': 'fa-solid fa-user-secret',
    }

    return iconMap[iconClass] || 'fa-solid fa-file-code'
}

/**
 * Gets the previous post in chronological order (newer post).
 * Posts are sorted newest-first, so previous = earlier index.
 *
 * @param currentSlug - Slug of the current post
 * @returns Previous post or undefined if at the beginning
 */
export function getPreviousPost(currentSlug: string): BlogPost | undefined {
    const posts = getAllPosts()
    const currentIndex = posts.findIndex(post => post.slug === currentSlug)
    return currentIndex > 0 ? posts[currentIndex - 1] : undefined
}

/**
 * Gets the next post in chronological order (older post).
 * Posts are sorted newest-first, so next = later index.
 *
 * @param currentSlug - Slug of the current post
 * @returns Next post or undefined if at the end
 */
export function getNextPost(currentSlug: string): BlogPost | undefined {
    const posts = getAllPosts()
    const currentIndex = posts.findIndex(post => post.slug === currentSlug)
    return currentIndex < posts.length - 1 ? posts[currentIndex + 1] : undefined
}

/**
 * Finds posts related to the current post by shared tags.
 * Falls back to most recent posts if not enough tag matches.
 *
 * @param currentSlug - Slug of the current post
 * @param limit - Maximum number of related posts to return (default: 2)
 * @returns Array of related blog posts
 */
export function getRelatedPosts(currentSlug: string, limit: number = 2): BlogPost[] {
    const posts = getAllPosts()
    const currentPost = getPostBySlug(currentSlug)
    if (!currentPost) return []

    // Get posts that share at least one tag, excluding the current post
    const related = posts
        .filter(post =>
            post.slug !== currentSlug &&
            post.tags.some(tag => currentPost.tags.includes(tag))
        )
        .slice(0, limit)

    // If we don't have enough related posts, fill with most recent posts
    if (related.length < limit) {
        const remaining = posts
            .filter(post =>
                post.slug !== currentSlug &&
                !related.some(r => r.slug === post.slug)
            )
            .slice(0, limit - related.length)
        related.push(...remaining)
    }

    return related
}
