# JoshDoes.IT Portfolio Website

A terminal-themed portfolio website for Josh Jones, Security Compliance Engineer, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Terminal-themed Design**: Dark theme with green accents, mimicking a command-line interface
- **Portfolio Sections**: About, Experience, Skills, Projects, and Contact
- **Blog System**: Full-featured blog with Supabase backend
- **Admin Portal**: Create, edit, and manage blog posts
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Once your project is ready, go to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `supabase/migrations/001_create_blog_posts.sql`
4. Execute the SQL to create the `blog_posts` table and set up Row Level Security policies

### 3. Environment Variables

Create a `.env.local` file in the root directory (you can copy from `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

You can find these values in your Supabase project:
- Go to **Settings** → **API**
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `anon` `public` key
- `SUPABASE_SERVICE_ROLE_KEY` = `service_role` `secret` key (keep this secure!)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

### 5. Access Admin Portal

Navigate to `/admin` to access the blog post management interface.

**⚠️ Security Note**: The admin portal is currently open to anyone who knows the URL. For production, you should:
- Add authentication (e.g., Supabase Auth)
- Protect the `/admin` route with middleware
- Restrict the API routes (`/api/posts`) to authenticated users only

## Deployment to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables in Vercel project settings
4. Deploy!

## Blog Post Content Format

The blog content field accepts HTML. You can use HTML tags like:
- `<p>` for paragraphs
- `<h1>`, `<h2>`, etc. for headings
- `<ul>`, `<ol>`, `<li>` for lists
- `<code>` for inline code
- `<pre>` for code blocks
- `<a>` for links
- etc.

Example blog post content:
```html
<p>This is a paragraph about security compliance.</p>
<h2>Key Points</h2>
<ul>
  <li>Point 1</li>
  <li>Point 2</li>
</ul>
<p>For more information, visit <a href="https://example.com">this link</a>.</p>
```

## Project Structure

```
├── app/
│   ├── admin/          # Admin portal for managing blog posts
│   ├── api/            # API routes for blog post CRUD operations
│   ├── blog/           # Blog listing and individual post pages
│   ├── components/     # Reusable components (Header, Footer)
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx          # Home page
├── lib/
│   └── supabase.ts     # Supabase client configuration
├── supabase/
│   └── migrations/     # Database migration files
└── public/             # Static assets
```

## Customization

- Update personal information in `app/page.tsx`
- Modify colors in `tailwind.config.ts`
- Adjust styling in `app/globals.css`
- Add more sections as needed

## License

© 2024 Josh Jones. All rights reserved.
