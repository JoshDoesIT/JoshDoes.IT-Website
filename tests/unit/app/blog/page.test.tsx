import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BlogPage from '@/app/blog/page'

vi.mock('@/app/blog/posts', () => ({
    getAllPosts: vi.fn(),
}))

import { getAllPosts } from '@/app/blog/posts'

describe('Blog Index Page', () => {
    it('should render the blog list', () => {
        vi.mocked(getAllPosts).mockReturnValue([
            {
                slug: 'test-post',
                title: 'Test Post',
                date: '2025-01-01',
                description: 'Test Description',
                tags: ['Tag'],
                icon: 'fa-code',
                content: ''
            }
        ])

        render(<BlogPage />)

        expect(screen.getByRole('heading', { name: /blog/i })).toBeInTheDocument()
        expect(screen.getByText('Test Post')).toBeInTheDocument()
    })
})
