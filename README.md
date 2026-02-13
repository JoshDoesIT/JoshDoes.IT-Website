# joshdoes.it

**Live Site**: [joshdoes.it](https://joshdoes.it)

## About

This is my personal website where I share my experience, projects, and blog posts about GRC engineering, security automation, and compliance.

## Features

- **Terminal-themed Design**: Dark theme with green accents inspired by command-line interfaces
- **Blog**: Markdown-based blog with search and pagination
- **Portfolio Sections**: About, Experience, Skills, Projects, and Contact information
- **Responsive Design**: Optimized for desktop and mobile devices
- **Fast and Modern**: Built with Next.js 14 App Router for optimal performance
- **Security**: Comprehensive security measures including XSS protection, path traversal prevention, and input validation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: Markdown files in `content/blog/`
- **Deployment**: Vercel

## Local Development

### Prerequisites

- Node.js 18+ and npm

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/JoshDoesIT/JoshDoes.IT-Website.git
   cd JoshDoes.IT-Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to view the site locally.

## Project Structure

```
├── app/                      # Next.js App Router (routing and React components)
│   ├── blog/
│   │   ├── [slug]/          # Dynamic route folder - renders individual blog posts
│   │   │   └── page.tsx     # Component for /blog/[slug] pages
│   │   ├── BlogList.tsx     # Component for blog listing with search/pagination
│   │   ├── page.tsx         # Blog index page (/blog route)
│   │   └── posts.ts         # Server-side code that reads markdown files
│   ├── components/          # Reusable React components
│   ├── privacy/             # Privacy policy page
│   ├── accessibility/       # Accessibility statement page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Home page
├── content/
│   └── blog/                # Blog post content
│       └── *.md             # Individual blog posts as markdown files
├── public/
│   └── blog_post_images/    # Static images referenced in blog posts
│       └── [post-name]/     # Images organized by blog post
└── types/                   # TypeScript type definitions
```

### How It Works

- **`app/blog/`** - Next.js routing and React components that render blog pages
  - `[slug]/page.tsx` - Creates dynamic routes like `/blog/ai-embeddings-control-mapping`
  - `page.tsx` - Renders the blog listing page at `/blog`
  - `posts.ts` - Server-side code that reads markdown files from `content/blog/`

- **`content/blog/`** - Where blog posts are stored
  - Each `.md` file becomes a blog post
  - Frontmatter (title, date, tags, etc.) is parsed from the file header

- **`public/blog_post_images/`** - Images used in blog posts
  - Images are organized in folders by blog post name
  - Referenced in markdown like: `![alt text](/blog_post_images/post-name/image.png)`

## Blog Posts

Blog posts are written in Markdown and stored in `content/blog/`. Each post includes frontmatter with metadata:

```markdown
---
title: 'Post Title'
date: '2025-11-15'
description: 'Post description'
tags: ['Tag1', 'Tag2']
icon: 'fa-file-code'
---

# Post Content

Markdown content here...
```

## Deployment

The site is deployed to Vercel and automatically deploys on every push to the main branch. The deployment process:

1. Code is pushed to the main branch on GitHub
2. Vercel automatically builds and deploys the site
3. The site is live at [joshdoes.it](https://joshdoes.it)

## Terminal Theme

The site uses a custom terminal color scheme:

- Background: `#0a0a0a` (terminal-bg)
- Surface: `#1a1a1a` (terminal-surface)
- Border: `#333333` (terminal-border)
- Green: `#00ff41` (terminal-green)
- Gray: `#a0a0a0` (terminal-gray)

Colors can be customized in `tailwind.config.ts`.

## Security

The site implements several security measures:

- XSS protection in markdown rendering with URL sanitization
- Path traversal prevention for blog post slugs
- Input validation and length limits on search functionality
- HTML entity escaping throughout the application
- Content Security Policy (CSP) headers configured

For the full security policy, including how to report vulnerabilities, see **[SECURITY.md](SECURITY.md)**.

## Testing

The project includes comprehensive testing with both unit tests and end-to-end tests:

```bash
# Run unit tests (Vitest)
npm run test

# Run E2E tests (Playwright)
npm run test:e2e

# Run unit tests with coverage
npm run test -- --coverage
```

For detailed testing documentation, test structure, and writing guidelines, see the **[Test Suite Documentation](./tests/README.md)**.

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
