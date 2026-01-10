/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Ignore optional dependencies in gray-matter that we don't use
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'coffee-script': false,
      'toml': false,
    }
    return config
  },
  async headers() {
    const isDev = process.env.NODE_ENV === 'development'

    // Content Security Policy configuration
    // Based on comprehensive review of all external resources used by the site

    // Script sources: Next.js, Font Awesome, Disqus, Google Sign-In
    const scriptSrc = [
      "'self'",
      "'unsafe-inline'", // Required for inline scripts (error suppression, Next.js)
      ...(isDev ? ["'unsafe-eval'"] : []), // Required for React Fast Refresh in development
      'https://cdnjs.cloudflare.com', // Font Awesome
      'https://*.disqus.com',
      'https://disqus.com',
      'https://*.disquscdn.com',
      'https://*.gstatic.com',
      'https://www.gstatic.com',
      'https://gstatic.com',
      'https://accounts.google.com',
      'https://*.googleapis.com',
      'https://apis.google.com',
      'https://*.liadm.com',
      'https://launchpad-wrapper.privacymanager.io',
      'https://launchpad.privacymanager.io',
      'https://*.privacymanager.io',
    ].join(' ')

    // Style sources: Self, inline styles, Google Fonts, Disqus
    const styleSrc = [
      "'self'",
      "'unsafe-inline'", // Required for Tailwind CSS and inline styles
      'https://fonts.googleapis.com', // Google Fonts CSS
      'https://*.disqus.com',
      'https://disqus.com',
      'https://*.disquscdn.com',
    ].join(' ')

    // Font sources: Self, Google Fonts
    const fontSrc = [
      "'self'",
      'https://fonts.gstatic.com', // Google Fonts
    ].join(' ')

    // Image sources: Self, data URIs, HTTPS/HTTP images (for blog posts), Disqus
    const imgSrc = [
      "'self'",
      'data:',
      'https:',
      'http:', // For blog post images that may use HTTP
      'https://*.disquscdn.com',
    ].join(' ')

    // Connect sources: API calls to Disqus, Google, etc.
    const connectSrc = [
      "'self'",
      'https://*.disqus.com',
      'https://disqus.com',
      'https://*.disquscdn.com',
      'https://*.liadm.com',
      'https://accounts.google.com',
      'https://*.googleapis.com',
      'https://apis.google.com',
      'https://*.gstatic.com',
      'https://www.gstatic.com',
      'https://launchpad-wrapper.privacymanager.io',
      'https://launchpad.privacymanager.io',
      'https://*.privacymanager.io',
    ].join(' ')

    // Frame sources: Disqus iframes, Google Sign-In iframes
    const frameSrc = [
      "'self'",
      'https://*.disqus.com',
      'https://disqus.com',
      'https://*.liadm.com',
      'https://accounts.google.com',
      'https://*.gstatic.com',
      'https://www.gstatic.com',
    ].join(' ')

    // Build the complete CSP directive
    const cspDirectives = [
      `default-src 'self'`,
      `script-src ${scriptSrc}`,
      `style-src ${styleSrc}`,
      `font-src ${fontSrc}`,
      `img-src ${imgSrc}`,
      `connect-src ${connectSrc}`,
      `frame-src ${frameSrc}`,
      `frame-ancestors 'self'`,
      `base-uri 'self'`,
      `form-action 'self'`,
    ]

    // Only upgrade HTTP to HTTPS in production (breaks local dev on HTTP)
    if (!isDev) {
      cspDirectives.push(`upgrade-insecure-requests`)
    }

    const csp = cspDirectives.join('; ')

    // Build headers array
    const headers = [
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on'
      },
    ]

    // HSTS only in production (not needed/appropriate for local dev)
    if (!isDev) {
      headers.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload'
      })
    }

    headers.push(
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()'
      },
      {
        key: 'Content-Security-Policy',
        value: csp
      }
    )

    return [
      {
        source: '/:path*',
        headers: headers,
      },
    ]
  },
}

module.exports = nextConfig

