'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { BlogPost } from './posts'

function getIconElement(iconClass: string) {
  // Return the full Font Awesome class
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

interface BlogListProps {
  posts: BlogPost[]
}

export default function BlogList({ posts }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 9

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts
    }

    // Sanitize search query - limit length to prevent DoS
    const sanitizedQuery = searchQuery
      .trim()
      .slice(0, 200) // Limit length to prevent potential DoS
      .toLowerCase()
    
    if (!sanitizedQuery) {
      return posts
    }

    try {
      // Use case-insensitive includes for safe matching (no regex, prevents ReDoS)
      return posts.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(sanitizedQuery)
        const descriptionMatch = post.description.toLowerCase().includes(sanitizedQuery)
        const tagsMatch = post.tags.some(tag => tag.toLowerCase().includes(sanitizedQuery))
        return titleMatch || descriptionMatch || tagsMatch
      })
    } catch (error) {
      // Fallback to empty results on any error
      console.error('Search error:', error)
      return []
    }
  }, [posts, searchQuery])

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    // Sanitize and validate search input
    // Limit length to prevent potential DoS
    const maxLength = 200
    const sanitizedValue = value.slice(0, maxLength)
    setSearchQuery(sanitizedValue)
    setCurrentPage(1)
  }

  return (
    <div>
      {/* Search Input */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            maxLength={200}
            className="w-full bg-terminal-surface border border-terminal-border px-4 py-3 pl-10 text-terminal-gray focus:outline-none focus:border-terminal-green transition-colors"
            aria-label="Search blog posts"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-gray"></i>
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-terminal-gray hover:text-terminal-green transition-colors"
              aria-label="Clear search"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-terminal-gray text-sm mt-2">
            Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Posts Grid */}
      {paginatedPosts.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-terminal-surface border border-terminal-border p-6 hover:border-terminal-green transition-colors cursor-pointer block flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-terminal-gray text-xs">{post.date}</span>
                  <i className={`${getIconElement(post.icon)} text-terminal-green`}></i>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{post.title}</h3>
                <p className="text-terminal-gray text-sm mb-4 leading-relaxed flex-grow">
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-terminal-bg px-2 py-1 text-xs border border-terminal-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-terminal-green text-sm">cat post.md →</div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-terminal-surface border border-terminal-border px-4 py-2 text-terminal-gray hover:border-terminal-green hover:text-terminal-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              
              <div className="text-terminal-gray text-sm">
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="bg-terminal-surface border border-terminal-border px-4 py-2 text-terminal-gray hover:border-terminal-green hover:text-terminal-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-terminal-gray text-lg mb-2">No posts found</p>
          <p className="text-terminal-gray text-sm">Try adjusting your search query</p>
        </div>
      )}
    </div>
  )
}

