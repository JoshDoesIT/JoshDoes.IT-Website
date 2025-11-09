import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Josh Jones - Compliance Engineering & Security Automation Specialist',
  description: 'josh@joshdoes.it:~$ whoami\n\nCompliance Engineering & Security Automation Specialist. Operationalizing SOC 2, PCI, and HITRUST programs through code, integrations, and workflow automation.',
  openGraph: {
    title: 'Josh Jones - Compliance Engineering & Security Automation Specialist',
    description: 'josh@joshdoes.it:~$ whoami\n\nCompliance Engineering & Security Automation Specialist. Operationalizing SOC 2, PCI, and HITRUST programs through code, integrations, and workflow automation.',
    url: 'https://joshdoes.it',
    siteName: 'Josh Jones Portfolio',
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
    card: 'summary',
    title: 'Josh Jones - Compliance Engineering & Security Automation Specialist',
    description: 'josh@joshdoes.it:~$ whoami\n\nCompliance Engineering & Security Automation Specialist.',
    images: ['https://joshdoes.it/og-image.png'],
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

