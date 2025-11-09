# Terminal Portfolio Website

A modern, terminal-themed portfolio website template built with Next.js, TypeScript, Tailwind CSS, and Supabase. Perfect for developers, security professionals, or anyone who wants a unique CLI-inspired portfolio.

🌐 **Live Demo**: [joshdoes.it](https://joshdoes.it)

## ✨ Features

- **🖥️ Terminal-themed Design**: Dark theme with green accents, mimicking a command-line interface
- **📄 Portfolio Sections**: About, Experience, Skills, Projects, and Contact
- **📝 Blog System**: Full-featured blog with Supabase backend
- **🔧 Admin Portal**: Create, edit, and manage blog posts through a web interface
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⚡ Fast & Modern**: Built with Next.js 14 App Router for optimal performance

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works great)
- A Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JoshDoesIT/JoshDoes.IT-Website.git
   cd JoshDoes.IT-Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase/migrations/001_create_blog_posts.sql`
   - Execute the SQL to create the `blog_posts` table

4. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```
   
   Find these values in your Supabase project under **Settings** → **API**

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to see your site.

6. **Access the admin portal**
   
   Navigate to `/admin` to manage blog posts.

   ⚠️ **Security Note**: For production, add authentication to protect the admin portal.

## 📦 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your environment variables in Vercel project settings
4. Deploy!

The site will automatically deploy on every push to your main branch.

### Other Platforms

This is a standard Next.js application and can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

## 📁 Project Structure

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

## 🎨 Customization

### Update Content

- **Personal Information**: Edit `app/page.tsx` to update your name, title, experience, skills, etc.
- **Colors**: Modify the terminal color scheme in `tailwind.config.ts`
- **Styling**: Adjust global styles in `app/globals.css`
- **Components**: Customize reusable components in `app/components/`

### Terminal Theme Colors

The default terminal theme uses:
- Background: `#0a0a0a` (terminal-bg)
- Surface: `#1a1a1a` (terminal-surface)
- Border: `#333333` (terminal-border)
- Green: `#00ff41` (terminal-green)
- Gray: `#a0a0a0` (terminal-gray)

You can customize these in `tailwind.config.ts`.

## 📝 Blog System

The blog system supports:
- **HTML Content**: Write posts using HTML for rich formatting
- **Tags**: Categorize posts with tags
- **Draft/Published**: Control post visibility
- **SEO-friendly URLs**: Automatic slug generation from titles

### Example Blog Post Content

```html
<p>This is a paragraph about security compliance.</p>
<h2>Key Points</h2>
<ul>
  <li>Point 1</li>
  <li>Point 2</li>
</ul>
<p>For more information, visit <a href="https://example.com">this link</a>.</p>
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/JoshDoesIT/JoshDoes.IT-Website/issues).

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by terminal/CLI aesthetics
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Backend powered by [Supabase](https://supabase.com/)

---

Made with ❤️ by [Josh Jones](https://joshdoes.it)
