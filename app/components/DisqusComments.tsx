'use client'

import { useEffect } from 'react'

interface BlogPost {
  slug: string
  title: string
}

interface DisqusCommentsProps {
  post: BlogPost
}

declare global {
  interface Window {
    DISQUS?: any
    disqus_config?: () => void
  }
}

// Global flag to prevent multiple script loads
let disqusScriptLoaded = false

export default function DisqusComments({ post }: DisqusCommentsProps) {
  useEffect(() => {
    // Get Disqus shortname from environment variable
    // Note: The shortname is NOT secret - it's a public identifier
    const DISQUS_SHORTNAME = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME || 'josh-does-it'
    
    // Skip if shortname not configured (only if it's still the placeholder)
    if (!DISQUS_SHORTNAME || DISQUS_SHORTNAME === 'YOUR_DISQUS_SHORTNAME') {
      console.warn('Disqus shortname not configured. Please set NEXT_PUBLIC_DISQUS_SHORTNAME environment variable')
      return
    }

    const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
    const pageIdentifier = post.slug
    const pageTitle = post.title

    // Disqus configuration
    window.disqus_config = function () {
      this.page.url = pageUrl
      this.page.identifier = pageIdentifier
      this.page.title = pageTitle
    }

    // Load Disqus script if not already loaded
    if (!disqusScriptLoaded && typeof window !== 'undefined') {
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

    // Cleanup function
    return () => {
      // Cleanup is handled by Disqus itself
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

