import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Josh Jones - Compliance Engineering & Security Automation Specialist',
  description: 'josh@joshdoes.it:~$ whoami\n\nCompliance Engineering & Security Automation Specialist. Operationalizing SOC 2, PCI, and HITRUST programs through code, integrations, and workflow automation.',
  openGraph: {
    title: 'Josh Jones - View CV & Portfolio',
    description: 'https://joshdoes.it',
    url: 'https://joshdoes.it',
    images: [
      {
        url: 'https://joshdoes.it/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Josh Jones - Compliance Engineering & Security Automation Specialist',
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
    icon: '/favicon.ico',
    apple: '/favicon.ico',
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
        <link rel="icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-title" content="Josh Jones" />
        <meta property="og:title" content="Josh Jones - View CV & Portfolio" />
        <meta property="og:description" content="https://joshdoes.it" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://joshdoes.it" />
        <meta property="og:image" content="https://joshdoes.it/og-image.png" />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          integrity="sha384-63b2d22b0a18f82da2c9fbbfa2ea4d9e418437712003ab24989795839032424eedb5c8d7d17b0b4449a6b895bf49d6d4"
        />
      </head>
      <body className="bg-terminal-bg text-terminal-green font-mono">
        {children}
      </body>
    </html>
  )
}

