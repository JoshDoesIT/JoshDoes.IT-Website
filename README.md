# Terminal Portfolio Website

A modern, terminal-themed portfolio website template built with Next.js, TypeScript, Tailwind CSS, and Supabase. Perfect for developers, security professionals, or anyone who wants a unique CLI-inspired portfolio.

🌐 **Live Demo**: [joshdoes.it](https://joshdoes.it)

## ✨ Features

- **🖥️ Terminal-themed Design**: Dark theme with green accents, mimicking a command-line interface
- **📄 Portfolio Sections**: About, Experience, Skills, Projects, and Contact
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⚡ Fast & Modern**: Built with Next.js 14 App Router for optimal performance

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
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

3. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to see your site.

## 📦 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Deploy!

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
│   ├── components/     # Reusable components (Header, Footer)
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
└── public/             # Static assets (favicon, etc.)
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

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/JoshDoesIT/JoshDoes.IT-Website/issues).

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by terminal/CLI aesthetics
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ by [Josh Jones](https://joshdoes.it)
