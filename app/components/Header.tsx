'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header id="header" className="bg-terminal-surface border-b border-terminal-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <i className="text-terminal-green">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 576 512">
                <path d="M9.4 86.6C-3.1 74.1-3.1 53.9 9.4 41.4s32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L178.7 256 9.4 86.6zM256 416H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
              </svg>
            </i>
            <span className="text-lg font-semibold">josh@joshdoes.it:~$</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#about" className="hover:text-white transition-colors">./about</Link>
            <Link href="/#experience" className="hover:text-white transition-colors">./experience</Link>
            <Link href="/#skills" className="hover:text-white transition-colors">./skills</Link>
            <Link href="/#projects" className="hover:text-white transition-colors">./projects</Link>
            <Link href="/#contact" className="hover:text-white transition-colors">./contact</Link>
            <Link href="/blog" className="hover:text-white transition-colors">./blog</Link>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-terminal-green"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 448 512">
                <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
              </svg>
            </button>
          </div>
        </nav>
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link href="/#about" className="block hover:text-white transition-colors">./about</Link>
            <Link href="/#experience" className="block hover:text-white transition-colors">./experience</Link>
            <Link href="/#skills" className="block hover:text-white transition-colors">./skills</Link>
            <Link href="/#projects" className="block hover:text-white transition-colors">./projects</Link>
            <Link href="/#contact" className="block hover:text-white transition-colors">./contact</Link>
            <Link href="/blog" className="block hover:text-white transition-colors">./blog</Link>
          </div>
        )}
      </div>
    </header>
  )
}

