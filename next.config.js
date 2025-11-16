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
    // In development, Next.js requires 'unsafe-eval' for React Fast Refresh
    const isDev = process.env.NODE_ENV === 'development'
    const scriptSrc = isDev
      ? "'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://*.disqus.com https://disqus.com https://*.disquscdn.com https://*.liadm.com https://launchpad-wrapper.privacymanager.io https://*.gstatic.com https://www.gstatic.com https://accounts.google.com"
      : "'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://*.disqus.com https://disqus.com https://*.disquscdn.com https://*.liadm.com https://launchpad-wrapper.privacymanager.io https://*.gstatic.com https://www.gstatic.com https://accounts.google.com"
    
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
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
            value: `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.disqus.com https://disqus.com https://*.disquscdn.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: http://cdn.viglink.com; connect-src 'self' https://*.disqus.com https://disqus.com https://*.disquscdn.com https://*.liadm.com https://accounts.google.com https://*.googleapis.com; frame-ancestors 'self'; frame-src 'self' https://*.disqus.com https://disqus.com https://*.liadm.com https://accounts.google.com;`
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig

