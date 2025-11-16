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
                // Suppress harmless errors from third-party scripts (Disqus/Google Sign-In)
                // These errors don't affect functionality but clutter the console
                
                // Wrap MutationObserver to prevent errors when third-party scripts try to observe non-existent elements
                if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
                  const OriginalMutationObserver = window.MutationObserver;
                  window.MutationObserver = function(callback) {
                    const observer = new OriginalMutationObserver(callback);
                    const originalObserve = observer.observe.bind(observer);
                    observer.observe = function(target, options) {
                      if (!target || !(target instanceof Node)) {
                        return; // Silently fail if target is invalid
                      }
                      try {
                        return originalObserve(target, options);
                      } catch (e) {
                        // Suppress MutationObserver errors from third-party scripts
                        if (e && e.message && e.message.includes('must be an instance of Node')) {
                          return;
                        }
                        throw e;
                      }
                    };
                    return observer;
                  };
                  Object.setPrototypeOf(window.MutationObserver, OriginalMutationObserver);
                  window.MutationObserver.prototype = OriginalMutationObserver.prototype;
                }
                
                // Suppress console errors for MutationObserver issues
                if (typeof console !== 'undefined') {
                  const originalError = console.error;
                  console.error = function(...args) {
                    const message = String(args.join(' '));
                    if (message.includes('MutationObserver.observe') && message.includes('must be an instance of Node')) {
                      return; // Suppress this specific error
                    }
                    originalError.apply(console, args);
                  };
                  
                  // Suppress Google deprecation warnings
                  const originalWarn = console.warn;
                  console.warn = function(...args) {
                    const message = String(args.join(' '));
                    if (message.includes('deprecated') && message.includes('Google') && message.includes('authentication')) {
                      return; // Suppress this warning
                    }
                    originalWarn.apply(console, args);
                  };
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

