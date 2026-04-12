import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '@/app/page'

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

    it('should not render a phone number in contact info', () => {
        render(<Page />)

        expect(screen.queryByText(/423-967-9970/)).not.toBeInTheDocument()
        expect(screen.queryByText(/phone:/)).not.toBeInTheDocument()
    })

    it('should render updated experience text with SDLC practices', () => {
        render(<Page />)

        expect(screen.getByText(/embed compliance into SDLC practices/)).toBeInTheDocument()
        expect(screen.queryByText(/embed compliance into CI\/CD pipelines/)).not.toBeInTheDocument()
    })

    it('should render updated AI agent description', () => {
        render(<Page />)

        expect(screen.getByText(/Built custom agentic AI review processes/)).toBeInTheDocument()
        expect(screen.queryByText(/Used Copilot Studio to build a custom AI agent to match/)).not.toBeInTheDocument()
    })

    it('should render control mapping line in Compliance Programs Manager', () => {
        render(<Page />)

        expect(screen.getByText(/Performed control mapping to enable the development of a common control framework/)).toBeInTheDocument()
    })

    it('should not render removed GRC tool line from Compliance Analyst IV', () => {
        render(<Page />)

        expect(screen.queryByText(/Implemented a GRC tool \(Hyperproof and internally developed M365 stack\)/)).not.toBeInTheDocument()
    })

    it('should render GCP in cloud platforms', () => {
        render(<Page />)

        expect(screen.getByText('• GCP')).toBeInTheDocument()
    })

    it('should render Azure DevOps in tools', () => {
        render(<Page />)

        expect(screen.getByText(/Azure DevOps/)).toBeInTheDocument()
    })

    it('should render HIPAA and CMS Chapter 9 and 21 in frameworks', () => {
        render(<Page />)

        expect(screen.getByText('• HIPAA')).toBeInTheDocument()
        expect(screen.getByText('• CMS Chapter 9 and 21')).toBeInTheDocument()
    })

    it('should render GitHub-linked key projects', () => {
        render(<Page />)

        const ctrlmapLink = screen.getByRole('link', { name: /ctrlmap/i })
        expect(ctrlmapLink).toHaveAttribute('href', 'https://github.com/JoshDoesIT/ctrlmap')

        const sentinelliumLink = screen.getByRole('link', { name: /Sentinellium/i })
        expect(sentinelliumLink).toHaveAttribute('href', 'https://github.com/JoshDoesIT/Sentinellium')

        const nscLink = screen.getByRole('link', { name: /NSC Reviews/i })
        expect(nscLink).toHaveAttribute('href', 'https://github.com/JoshDoesIT/Network-Security-Control-Reviews-with-MCP-and-LLMs')

        const aiMapperLink = screen.getByRole('link', { name: /AI Control Mapper/i })
        expect(aiMapperLink).toHaveAttribute('href', 'https://github.com/JoshDoesIT/AI-Control-Mapper')
    })
})
