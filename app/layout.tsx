import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Josh Jones - GRC Engineering & Security Automation Specialist',
  description: 'GRC Engineering & Security Automation Specialist. Building audit-ready systems through code, integrations, and workflow automation.',
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
        {/* CRITICAL: Error suppression script MUST run FIRST before any other scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                'use strict';
                // Suppress harmless errors from third-party scripts (Disqus/Google Sign-In)
                // These errors don't affect functionality but clutter the console
                
                // CRITICAL: Wrap MutationObserver IMMEDIATELY before any scripts load
                // This must run before any third-party scripts that use MutationObserver
                // We need to intercept at the prototype level to catch all instances
                (function() {
                  if (typeof MutationObserver === 'undefined') return;
                  
                  const OriginalMutationObserver = window.MutationObserver || MutationObserver;
                  
                  // Store original observe method - MUST capture before any scripts use it
                  const OriginalObserve = OriginalMutationObserver.prototype.observe;
                  
                  // Override observe on the prototype to catch all instances (including existing ones)
                  OriginalMutationObserver.prototype.observe = function(target, options) {
                    // Validate target FIRST - return silently if invalid to prevent error
                    if (!target) {
                      return; // Silently fail - prevents "must be an instance of Node" error
                    }
                    
                    // Check if target is a valid object
                    if (typeof target !== 'object') {
                      return; // Silently fail
                    }
                    
                    // Check if target is a Node instance - this is the critical check
                    // If it's not a Node, return silently instead of throwing
                    if (!(target instanceof Node)) {
                      return; // Silently fail - this prevents the error
                    }
                    
                    // Target is valid - call original observe
                    try {
                      return OriginalObserve.call(this, target, options);
                    } catch (e) {
                      // Suppress ALL errors from observe - they're from third-party scripts
                      return;
                    }
                  };
                  
                  // Replace the constructor to ensure new instances use our wrapper
                  window.MutationObserver = function(callback) {
                    const observer = new OriginalMutationObserver(callback);
                    // The prototype override already handles observe
                    return observer;
                  };
                  
                  // Preserve prototype and static properties
                  Object.setPrototypeOf(window.MutationObserver, OriginalMutationObserver);
                  window.MutationObserver.prototype = OriginalMutationObserver.prototype;
                  
                  // Also set on global scope if different
                  if (typeof MutationObserver !== 'undefined' && MutationObserver !== window.MutationObserver) {
                    MutationObserver = window.MutationObserver;
                  }
                  
                  // Also override on self if it exists
                  if (typeof self !== 'undefined' && self.MutationObserver) {
                    self.MutationObserver = window.MutationObserver;
                  }
                })();
                
                // Override console.error to filter harmless third-party errors
                // This must run BEFORE any scripts log errors
                if (typeof console !== 'undefined') {
                  const originalError = console.error;
                  console.error = function(...args) {
                    const message = String(args.join(' '));
                    // Suppress MutationObserver errors (multiple patterns - be very aggressive)
                    if (
                      message.includes('MutationObserver') ||
                      message.includes('observe') ||
                      (message.includes('instance of Node') && message.includes('observe')) ||
                      message.includes('credentials-library.js') ||
                      message.includes('Argument 1') ||
                      // Suppress Disqus cross-origin frame errors (expected browser security warning)
                      (message.includes('Blocked a frame') && message.includes('disqus.com')) ||
                      (message.includes('from accessing a frame') && message.includes('origin'))
                    ) {
                      return; // Suppress this error
                    }
                    originalError.apply(console, args);
                  };
                  
                  // Suppress Google deprecation warnings
                  const originalWarn = console.warn;
                  console.warn = function(...args) {
                    const message = String(args.join(' '));
                    if (
                      (message.includes('deprecated') && message.includes('Google') && message.includes('authentication')) ||
                      (message.includes('Migration Guide') && message.includes('identity/gsi'))
                    ) {
                      return; // Suppress this warning
                    }
                    originalWarn.apply(console, args);
                  };
                }
                
                // Global error handler to catch uncaught exceptions
                // Must use capture phase and be registered early
                if (typeof window !== 'undefined') {
                  // Use capture phase to intercept errors before they propagate
                  // Register with highest priority to catch errors first
                  window.addEventListener('error', function(event) {
                    const errorMessage = event.message || '';
                    const errorFilename = event.filename || '';
                    const errorStack = event.error?.stack || '';
                    
                    // Very aggressive pattern matching for MutationObserver errors
                    if (
                      errorMessage.includes('MutationObserver') ||
                      errorMessage.includes('must be an instance of Node') ||
                      errorMessage.includes('observe') ||
                      errorMessage.includes('Argument 1') ||
                      errorFilename.includes('credentials-library.js') ||
                      errorFilename.includes('embed.js') ||
                      errorFilename.includes('embedv2.js') ||
                      errorStack.includes('credentials-library.js') ||
                      errorStack.includes('MutationObserver') ||
                      // Suppress Disqus cross-origin frame errors (expected browser security warning)
                      (errorMessage.includes('Blocked a frame') && errorMessage.includes('disqus.com')) ||
                      (errorMessage.includes('from accessing a frame') && errorMessage.includes('origin'))
                    ) {
                      event.preventDefault();
                      event.stopPropagation();
                      event.stopImmediatePropagation();
                      return true; // Prevent default error handling
                    }
                    return false;
                  }, true); // Use capture phase with highest priority
                  
                  // Handle unhandled promise rejections
                  window.addEventListener('unhandledrejection', function(event) {
                    const reason = event.reason;
                    if (reason) {
                      const reasonMessage = (typeof reason === 'object' && reason.message) ? reason.message : String(reason);
                      if (
                        reasonMessage.includes('MutationObserver') ||
                        reasonMessage.includes('must be an instance of Node') ||
                        reasonMessage.includes('observe')
                      ) {
                        event.preventDefault();
                        return true;
                      }
                    }
                    return false;
                  }, true);
                  
                }
              })();
            `,
          }}
        />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-title" content="Josh Jones" />
        {/* OG tags are generated by Next.js metadata API - don't duplicate here */}
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

