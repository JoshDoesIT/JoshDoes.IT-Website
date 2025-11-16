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
        <Script
          id="error-suppression"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Suppress MutationObserver errors from third-party scripts (Google Sign-In via Disqus)
                // These errors occur when Google Sign-In scripts try to observe elements that don't exist yet
                const originalError = console.error;
                const originalWarn = console.warn;
                
                // Override console.error to filter out specific errors
                console.error = function(...args) {
                  const message = args.join(' ');
                  if (
                    message.includes('MutationObserver.observe') &&
                    message.includes('must be an instance of Node')
                  ) {
                    return; // Suppress this error
                  }
                  originalError.apply(console, args);
                };
                
                // Override console.warn to filter out deprecation warnings from Google
                console.warn = function(...args) {
                  const message = args.join(' ');
                  if (
                    message.includes('deprecated') &&
                    message.includes('Google') &&
                    message.includes('authentication')
                  ) {
                    return; // Suppress this warning
                  }
                  originalWarn.apply(console, args);
                };
                
                // Global error handler for uncaught exceptions
                window.addEventListener('error', function(event) {
                  if (
                    event.message &&
                    event.message.includes('MutationObserver.observe') &&
                    event.message.includes('must be an instance of Node')
                  ) {
                    event.preventDefault();
                    event.stopPropagation();
                    return true;
                  }
                  return false;
                }, true);
                
                // Handle unhandled promise rejections
                window.addEventListener('unhandledrejection', function(event) {
                  if (
                    event.reason &&
                    typeof event.reason === 'object' &&
                    event.reason.message &&
                    event.reason.message.includes('MutationObserver.observe')
                  ) {
                    event.preventDefault();
                    return true;
                  }
                  return false;
                });
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

