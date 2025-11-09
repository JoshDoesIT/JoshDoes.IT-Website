import Link from 'next/link'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-terminal-bg py-20">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="bg-terminal-surface border border-terminal-border p-8">
            <div className="text-terminal-gray mb-4">josh@security:~$ cat blog-post.md</div>
            <h1 className="text-3xl font-bold text-white mb-4">404: Post Not Found</h1>
            <p className="text-terminal-gray mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/blog"
              className="inline-block border border-terminal-green px-6 py-3 hover:bg-terminal-green hover:text-black transition-all"
            >
              cd ../blog
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

