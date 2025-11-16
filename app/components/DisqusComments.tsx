'use client'

import { useEffect } from 'react'

interface BlogPost {
  slug: string
  title: string
}

interface DisqusCommentsProps {
  post: BlogPost
}

interface DisqusConfig {
  page: {
    url: string
    identifier: string
    title: string
  }
}

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: { reload: boolean; config: DisqusConfigFunction }) => void
    }
    disqus_config?: DisqusConfigFunction
  }
}

type DisqusConfigFunction = (this: DisqusConfig) => void

// Global flag to prevent multiple script loads
let disqusScriptLoaded = false

export default function DisqusComments({ post }: DisqusCommentsProps) {
  useEffect(() => {
    // Suppress MutationObserver errors from third-party scripts (Google Sign-In via Disqus)
    // These errors occur when Google Sign-In scripts try to observe elements that don't exist yet
    const errorHandler = (event: ErrorEvent) => {
      // Suppress specific MutationObserver errors from credentials-library.js
      if (
        event.message &&
        event.message.includes('MutationObserver.observe') &&
        event.message.includes('must be an instance of Node')
      ) {
        event.preventDefault()
        event.stopPropagation()
        return true // Suppress this error
      }
      return false // Let other errors through
    }
    
    // Also suppress console.error calls for these specific errors
    const originalConsoleError = console.error
    const consoleErrorHandler = (...args: any[]) => {
      const errorMessage = args.join(' ')
      if (
        errorMessage.includes('MutationObserver.observe') &&
        errorMessage.includes('must be an instance of Node')
      ) {
        return // Suppress this console error
      }
      // Log other errors normally
      originalConsoleError.apply(console, args)
    }
    console.error = consoleErrorHandler
    
    // Add global error handler for uncaught exceptions
    window.addEventListener('error', errorHandler, true)

    // Get Disqus shortname from environment variable
    // Note: The shortname is NOT secret - it's a public identifier
    const DISQUS_SHORTNAME = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME || 'josh-does-it'
    
    // Skip if shortname not configured (only if it's still the placeholder)
    if (!DISQUS_SHORTNAME || DISQUS_SHORTNAME === 'YOUR_DISQUS_SHORTNAME') {
      console.warn('Disqus shortname not configured. Please set NEXT_PUBLIC_DISQUS_SHORTNAME environment variable')
      return () => {
        window.removeEventListener('error', errorHandler, true)
        console.error = originalConsoleError
      }
    }

    // Ensure we're in the browser and the container exists
    if (typeof window === 'undefined') {
      return () => {
        window.removeEventListener('error', errorHandler, true)
        console.error = originalConsoleError
      }
    }

    // Wait for the DOM to be ready
    const initDisqus = () => {
      const disqusThread = document.getElementById('disqus_thread')
      if (!disqusThread) {
        // Retry after a short delay if container doesn't exist yet
        setTimeout(initDisqus, 100)
        return
      }

      const pageUrl = window.location.href
      const pageIdentifier = post.slug
      const pageTitle = post.title

      // Disqus configuration
      window.disqus_config = function (this: DisqusConfig) {
        this.page.url = pageUrl
        this.page.identifier = pageIdentifier
        this.page.title = pageTitle
      } as DisqusConfigFunction

      // Load Disqus script if not already loaded
      if (!disqusScriptLoaded) {
        // Check if script already exists
        const existingScript = document.querySelector(`script[src*="disqus.com/embed.js"]`)
        
        if (!existingScript) {
          const script = document.createElement('script')
          script.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`
          script.setAttribute('data-timestamp', Date.now().toString())
          script.async = true
          script.setAttribute('data-disqus-script', 'true')

          script.onerror = () => {
            console.error('Failed to load Disqus script')
            disqusScriptLoaded = false
          }

          document.head.appendChild(script)
          disqusScriptLoaded = true
        } else {
          // Script exists, reset Disqus
          if (window.DISQUS) {
            window.DISQUS.reset({
              reload: true,
              config: window.disqus_config,
            })
          }
        }
      } else if (window.DISQUS) {
        // Script already loaded, just reset
        window.DISQUS.reset({
          reload: true,
          config: window.disqus_config,
        })
      }
    }

    // Initialize Disqus
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initDisqus)
    } else {
      initDisqus()
    }

    // Cleanup function
    return () => {
      // Remove error handler and restore console.error
      window.removeEventListener('error', errorHandler, true)
      console.error = originalConsoleError
    }
  }, [post.slug, post.title])

  return (
    <div className="bg-terminal-surface border border-terminal-border p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Comments</h2>
      <div id="disqus_thread" className="disqus-thread-wrapper"></div>
      <noscript>
        <p className="text-terminal-gray">
          Please enable JavaScript to view the{' '}
          <a 
            href="https://disqus.com/?ref_noscript" 
            className="text-terminal-green hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            comments powered by Disqus
          </a>
          .
        </p>
      </noscript>
    </div>
  )
}

