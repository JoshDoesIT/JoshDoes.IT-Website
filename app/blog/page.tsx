import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

async function getBlogPosts() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching blog posts:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <>
      <Header />
      <main>
        <section className="py-20 bg-terminal-bg min-h-screen">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-12">
              <div className="text-terminal-gray mb-2">josh@security:~$ ls blog/</div>
              <h1 className="text-3xl font-bold text-white mb-6">Blog Posts</h1>
            </div>

            {posts.length === 0 ? (
              <div className="bg-terminal-surface border border-terminal-border p-8 text-center">
                <p className="text-terminal-gray">No blog posts found. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post: any) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="block bg-terminal-surface border border-terminal-border p-6 hover:border-terminal-green transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-xl font-semibold text-white">{post.title}</h2>
                      <div className="text-terminal-gray text-sm">
                        {format(new Date(post.created_at), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    {post.excerpt && (
                      <p className="text-terminal-gray mb-4">{post.excerpt}</p>
                    )}
                    <div className="flex items-center text-terminal-green text-sm">
                      <span>cat {post.slug}.md</span>
                      <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 448 512">
                        <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

