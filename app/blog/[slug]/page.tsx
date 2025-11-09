import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import Link from 'next/link'

async function getBlogPost(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <Header />
      <main>
        <article className="py-20 bg-terminal-bg min-h-screen">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="mb-8">
              <Link
                href="/blog"
                className="text-terminal-green hover:text-white transition-colors mb-4 inline-block"
              >
                <span className="text-terminal-gray">josh@security:~$</span> cd ..
              </Link>
            </div>

            <div className="mb-12">
              <div className="text-terminal-gray mb-2">josh@security:~$ cat {post.slug}.md</div>
              <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
              <div className="text-terminal-gray text-sm">
                Published: {format(new Date(post.created_at), 'MMMM dd, yyyy')}
              </div>
            </div>

            <div className="bg-terminal-surface border border-terminal-border p-8">
              <div
                className="text-terminal-gray leading-relaxed blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-terminal-surface px-3 py-1 text-sm border border-terminal-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}

