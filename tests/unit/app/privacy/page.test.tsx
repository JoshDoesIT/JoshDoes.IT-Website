import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PrivacyPage from '@/app/privacy/page'

describe('Privacy Policy Page', () => {
    it('should render the privacy policy content', () => {
        render(<PrivacyPage />)

        expect(screen.getByRole('heading', { name: /privacy policy/i })).toBeInTheDocument()
    })
})
