import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '@/app/page'

// Page does not use getAllPosts currently, so no mock needed for logic.
// But if it imported it and we want to be safe:
// vi.mock('@/app/blog/posts', () => ({ getAllPosts: vi.fn() }))
// However, since we removed the test case that used it, we can remove the import.

describe('Home Page', () => {
    it('should render the hero section', () => {
        render(<Page />)

        expect(screen.getByRole('heading', { name: /Josh Jones/i })).toBeInTheDocument()
    })

    it('should render the about section', () => {
        render(<Page />)

        expect(screen.getByText('About Me')).toBeInTheDocument()
        expect(screen.getByText(/GRC Engineering/)).toBeInTheDocument()
    })
})
