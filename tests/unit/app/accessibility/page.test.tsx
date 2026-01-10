import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AccessibilityPage from '@/app/accessibility/page'

describe('Accessibility Page', () => {
    it('should render the accessibility statement', () => {
        render(<AccessibilityPage />)

        expect(screen.getByRole('heading', { name: /accessibility statement/i })).toBeInTheDocument()
    })
})
