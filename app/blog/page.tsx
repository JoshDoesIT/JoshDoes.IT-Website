import Link from 'next/link'
import { getAllPosts } from './posts'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BlogList from './BlogList'

export const metadata = {
  title: 'Blog - Josh Does IT',
  description: 'Blog posts about GRC engineering, security automation, and compliance.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <Header />
      <main>
        <section id="blog" className="py-8 bg-terminal-bg min-h-screen">
          <div className="container mx-auto px-6 max-w-6xl">
            {/* Breadcrumb */}
            <div className="mb-6">
              <div className="text-terminal-gray text-sm flex items-center space-x-2">
                <Link href="/" className="hover:text-terminal-green transition-colors">
                  josh@joshdoes.it:~$
                </Link>
                <i className="fa-solid fa-chevron-right text-xs"></i>
                <span className="text-terminal-green">blog</span>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Blog Posts</h2>
            </div>
            <BlogList posts={posts} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

