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
  // Headers function completely disabled for testing - no CSP or security headers
  // async headers() {
  //   return []
  // },
}

module.exports = nextConfig

