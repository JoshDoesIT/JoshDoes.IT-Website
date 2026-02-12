import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BlogPostPage from '@/app/blog/[slug]/page'
import { notFound } from 'next/navigation'

vi.mock('@/app/blog/posts', () => ({
    getPostBySlug: vi.fn(),
    getAllPosts: vi.fn(),
}))

vi.mock('@/app/blog/markdown', () => ({
    formatContent: vi.fn().mockReturnValue('<p>Parsed Content</p>'),
}))

vi.mock('@/app/blog/utils', () => ({
    formatDate: vi.fn().mockReturnValue('January 1, 2025'),
    estimateReadTime: vi.fn().mockReturnValue(5),
    getIconElement: vi.fn().mockReturnValue('fa-solid fa-code'),
    getPreviousPost: vi.fn(),
    getNextPost: vi.fn(),
    getRelatedPosts: vi.fn().mockReturnValue([]),
}))

vi.mock('next/navigation', () => ({
    notFound: vi.fn().mockImplementation(() => { throw new Error('NEXT_NOT_FOUND') }),
}))

// Mock DisqusComments since it uses DOM/window
vi.mock('@/app/components/DisqusComments', () => ({
    default: () => <div data-testid="disqus-comments">Comments</div>,
}))


import fs from 'fs'
vi.mock('fs', () => ({
    default: {
        existsSync: vi.fn(),
    },
    existsSync: vi.fn(),
}))
import { getPostBySlug, getAllPosts } from '@/app/blog/posts'
import { getPreviousPost, getNextPost, getRelatedPosts } from '@/app/blog/utils'

describe('Blog Post Page', () => {
    it('should render the blog post content', async () => {
        vi.mocked(getPostBySlug).mockReturnValue({
            slug: 'test-post',
            title: 'Test Post',
            date: '2025-01-01',
            description: 'Description',
            tags: ['Tag'],
            icon: 'fa-code',
            content: 'Raw Content'
        })

        // Page component is async in Next.js 13+, for testing as a component we might need to await it
        // Or if it's a server component usage pattern. 
        // In simple unit testing of the function:
        const jsx = await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) })
        render(jsx)

        expect(screen.getByRole('heading', { name: 'Test Post' })).toBeInTheDocument()
        expect(screen.getByText('Parsed Content')).toBeInTheDocument() // from markdown mock
    })

    it('should call notFound if post does not exist', async () => {
        vi.mocked(getPostBySlug).mockReturnValue(undefined)

        // notFound throws in Next.js, so we expect our mock to be called
        // and we need to handle the execution flow if our mock DOESN'T throw (it returns undefined)
        // or we can make our mock throw.
        // If we make the mock throw, we need to catch it here.

        // Let's rely on the fact that notFound is called
        try {
            await BlogPostPage({ params: Promise.resolve({ slug: 'non-existent' }) })
        } catch (e) {
            // unexpected error if notFound doesn't stop execution
        }

        expect(notFound).toHaveBeenCalled()
    })

    it('should render next/prev navigation links when available', async () => {
        vi.mocked(getPostBySlug).mockReturnValue({
            slug: 'current-post',
            title: 'Current Post',
            date: '2025-01-01',
            description: 'Desc',
            tags: [],
            icon: 'fa-code',
            content: 'Content'
        })

        vi.mocked(getPreviousPost).mockReturnValue({
            slug: 'prev-post',
            title: 'Prev Post',
            date: '2024-12-31',
            description: 'Desc',
            tags: [],
            icon: 'fa-code',
            content: ''
        })

        vi.mocked(getNextPost).mockReturnValue({
            slug: 'next-post',
            title: 'Next Post',
            date: '2025-01-02',
            description: 'Desc',
            tags: [],
            icon: 'fa-code',
            content: ''
        })

        vi.mocked(getRelatedPosts).mockReturnValue([])

        const jsx = await BlogPostPage({ params: Promise.resolve({ slug: 'current-post' }) })
        render(jsx)

        expect(screen.getByText('Next Post →')).toBeInTheDocument()
    })

    it('should render related posts if available', async () => {
        vi.mocked(getPostBySlug).mockReturnValue({
            slug: 'current-post',
            title: 'Current Post',
            date: '2025-01-01',
            description: 'Desc',
            tags: ['Tag'],
            icon: 'fa-code',
            content: 'Content'
        })

        vi.mocked(getRelatedPosts).mockReturnValue([
            {
                slug: 'related-post',
                title: 'Related Post',
                date: '2025-01-01',
                description: 'Related Desc',
                tags: ['Tag'],
                icon: 'fa-code',
                content: ''
            }
        ])

        const jsx = await BlogPostPage({ params: Promise.resolve({ slug: 'current-post' }) })
        render(jsx)

        expect(screen.getByText('Related Posts')).toBeInTheDocument()
        expect(screen.getByText('Related Post')).toBeInTheDocument()
    })
})

import { generateMetadata, generateStaticParams } from '@/app/blog/[slug]/page'

describe('Blog Post Page Metadata & Static Params', () => {
    it('generateStaticParams should return all post slugs', async () => {
        vi.mocked(getAllPosts).mockReturnValue([
            { slug: 'post-1', title: 'Post 1', date: '', description: '', tags: [], icon: '', content: '' },
            { slug: 'post-2', title: 'Post 2', date: '', description: '', tags: [], icon: '', content: '' }
        ])

        const params = await generateStaticParams()

        expect(params).toHaveLength(2)
        expect(params).toContainEqual({ slug: 'post-1' })
        expect(params).toContainEqual({ slug: 'post-2' })
    })

    it('generateMetadata should return metadata for existing post', async () => {
        vi.mocked(getPostBySlug).mockReturnValue({
            slug: 'meta-post',
            title: 'Meta Post',
            date: '2025-01-01',
            description: 'Meta Description',
            tags: ['Tag'],
            icon: '',
            content: ''
        })

        const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'meta-post' }) })

        expect(metadata.title).toContain('Meta Post')
        expect(metadata.description).toBe('Meta Description')
        expect(metadata.openGraph?.images?.[0].url).toContain('og-image.png')
    })

    it('generateMetadata should use specific OG image if exists', async () => {
        vi.mocked(getPostBySlug).mockReturnValue({
            slug: 'meta-post',
            title: 'Meta Post',
            date: '2025-01-01',
            description: 'Meta Description',
            tags: ['Tag'],
            icon: '',
            content: ''
        })

        // Mock fs.existsSync to return true
        vi.mocked(fs.existsSync).mockReturnValue(true)

        const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'meta-post' }) })

        expect(metadata.openGraph?.images?.[0].url).toContain('/blog_post_images/meta-post/og-image.png')
    })

    it('generateMetadata should return "Post Not Found" if post is missing', async () => {
        vi.mocked(getPostBySlug).mockReturnValue(undefined)

        const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'missing' }) })

        expect(metadata.title).toBe('Post Not Found')
    })
})
