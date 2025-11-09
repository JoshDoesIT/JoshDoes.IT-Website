import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'terminal': {
          'bg': '#0a0a0a',
          'surface': '#1a1a1a',
          'border': '#333333',
          'green': '#00ff41',
          'gray': '#a0a0a0',
          'red': '#ff4444',
          'yellow': '#ffff44'
        }
      }
    },
  },
  plugins: [],
}
export default config

