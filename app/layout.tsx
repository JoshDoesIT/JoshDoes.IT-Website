import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Josh Jones - GRC Engineering & Security Automation Specialist',
  description: 'josh@joshdoes.it:~$ whoami\n\nGRC Engineering & Security Automation Specialist. Operationalizing GRC programs through code, integrations, and workflow automation across enterprise environments.',
  openGraph: {
    title: 'Josh Jones - View CV & Portfolio',
    description: 'https://joshdoes.it',
    url: 'https://joshdoes.it',
    images: [
      {
        url: 'https://joshdoes.it/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Josh Jones - GRC Engineering & Security Automation Specialist',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Josh Jones - View CV & Portfolio',
    description: 'https://joshdoes.it',
    images: ['https://joshdoes.it/og-image.png'],
  },
  appleWebApp: {
    title: 'Josh Jones',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/favicon.ico', sizes: '180x180', type: 'image/x-icon' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-title" content="Josh Jones" />
        <meta property="og:title" content="Josh Jones - View CV & Portfolio" />
        <meta property="og:description" content="https://joshdoes.it" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://joshdoes.it" />
        <meta property="og:image" content="https://joshdoes.it/og-image.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                'use strict';
                // Suppress MutationObserver errors from third-party scripts (Google Sign-In via Disqus)
                // These errors occur when Google Sign-In scripts try to observe elements that don't exist yet
                
                // Wrap MutationObserver.observe IMMEDIATELY to catch errors before they're thrown
                if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
                  const OriginalMutationObserver = window.MutationObserver;
                  window.MutationObserver = function(callback) {
                    const observer = new OriginalMutationObserver(callback);
                    const originalObserve = observer.observe.bind(observer);
                    observer.observe = function(target, options) {
                      // Check if target is valid before calling observe
                      if (!target || !(target instanceof Node)) {
                        return; // Silently fail if target is not a Node
                      }
                      try {
                        return originalObserve(target, options);
                      } catch (e) {
                        // Silently suppress MutationObserver errors
                        if (!e || !e.message || e.message.includes('must be an instance of Node') || e.message.includes('MutationObserver')) {
                          return;
                        }
                        throw e; // Re-throw other errors
                      }
                    };
                    return observer;
                  };
                  // Preserve prototype chain
                  Object.setPrototypeOf(window.MutationObserver, OriginalMutationObserver);
                  window.MutationObserver.prototype = OriginalMutationObserver.prototype;
                }
                
                // Override console methods to filter errors
                if (typeof console !== 'undefined') {
                  const originalError = console.error;
                  const originalWarn = console.warn;
                  
                  console.error = function(...args) {
                    const message = String(args.join(' '));
                    if (
                      message.includes('MutationObserver') ||
                      message.includes('credentials-library.js') ||
                      (message.includes('observe') && message.includes('instance of Node'))
                    ) {
                      return; // Suppress these errors
                    }
                    originalError.apply(console, args);
                  };
                  
                  console.warn = function(...args) {
                    const message = String(args.join(' '));
                    if (
                      message.includes('deprecated') && message.includes('Google') ||
                      message.includes('Migration Guide') && message.includes('identity/gsi') ||
                      message.includes('authentication') && message.includes('authorization')
                    ) {
                      return; // Suppress these warnings
                    }
                    originalWarn.apply(console, args);
                  };
                }
                
                // Global error handler for uncaught exceptions (capture phase - runs first)
                if (typeof window !== 'undefined') {
                  window.addEventListener('error', function(event) {
                    if (event.message && (
                      event.message.includes('MutationObserver') ||
                      event.message.includes('must be an instance of Node') ||
                      (event.filename && event.filename.includes('credentials-library.js'))
                    )) {
                      event.preventDefault();
                      event.stopPropagation();
                      event.stopImmediatePropagation();
                      return true;
                    }
                    return false;
                  }, true);
                  
                  // Handle unhandled promise rejections
                  window.addEventListener('unhandledrejection', function(event) {
                    const reason = event.reason;
                    if (reason && typeof reason === 'object' && reason.message && reason.message.includes('MutationObserver')) {
                      event.preventDefault();
                      return true;
                    }
                    return false;
                  }, true);
                }
              })();
            `,
          }}
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="bg-terminal-bg text-terminal-green font-mono">
        {children}
      </body>
    </html>
  )
}

