import { notFound } from 'next/navigation'
import Link from 'next/link'

import fs from 'fs'
import path from 'path'
import { getAllPosts, getPostBySlug, type BlogPost } from '../posts'
import {
  formatDate,
  estimateReadTime,
  getIconElement,
  getPreviousPost,
  getNextPost,
  getRelatedPosts
} from '../utils'
import { formatContent } from '../markdown'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import DisqusComments from '../../components/DisqusComments'
import ImageModal from '../../components/ImageModal'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const baseUrl = 'https://www.joshdoes.it'
  const postUrl = `${baseUrl}/blog/${post.slug}`

  // Check if blog post has a specific OG image
  // Blog post images are stored in /public/blog_post_images/{slug}/og-image.png
  const publicDir = path.join(process.cwd(), 'public')
  const postImageDir = path.join(publicDir, 'blog_post_images', post.slug)
  const postOgImagePath = path.join(postImageDir, 'og-image.png')

  // Use post-specific OG image if it exists, otherwise use default
  const ogImage = fs.existsSync(postOgImagePath)
    ? `${baseUrl}/blog_post_images/${post.slug}/og-image.png`
    : `${baseUrl}/og-image.png`

  return {
    title: `${post.title} - Josh Does IT Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: postUrl,
      siteName: 'Josh Does IT',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.date,
      authors: ['Josh Jones'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const formattedContent = formatContent(post.content)
  const readTime = estimateReadTime(post.content)
  const previousPost = getPreviousPost(post.slug)
  const nextPost = getNextPost(post.slug)
  const relatedPosts = getRelatedPosts(post.slug)

  return (
    <>
      <Header />
      <main>
        <section className="py-8 bg-terminal-bg min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            {/* Breadcrumb */}
            <div className="mb-6">
              <div className="text-terminal-gray text-sm flex items-center space-x-2">
                <Link href="/" className="hover:text-terminal-green transition-colors">
                  josh@joshdoes.it:~$
                </Link>
                <span className="text-terminal-gray">/</span>
                <Link href="/blog" className="hover:text-terminal-green transition-colors">
                  blog
                </Link>
                <span className="text-terminal-gray">/</span>
                <span className="text-terminal-green">{post.slug}.md</span>
              </div>
            </div>

            {/* Article */}
            <article className="bg-terminal-surface border border-terminal-border p-4 sm:p-6 md:p-8">
              {/* Article Header */}
              <div className="mb-8 pb-6 border-b border-terminal-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-terminal-gray text-sm">{formatDate(post.date)}</span>
                    <span className="text-terminal-gray">•</span>
                    <span className="text-terminal-gray text-sm">{readTime} min read</span>
                  </div>
                  <i className={`${getIconElement(post.icon)} text-terminal-green text-xl`}></i>
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>

                <p className="text-terminal-gray text-lg leading-relaxed mb-4">
                  {post.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-terminal-bg px-3 py-1 text-sm border border-terminal-border text-terminal-green"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Article Content */}
              <div className="mb-6">
                <div className="text-terminal-gray mb-6">
                  <span className="text-terminal-green">$</span> cat {post.slug}.md
                </div>

                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: formattedContent }}
                />
              </div>

              {/* Article Footer */}
              <div className="mt-12 pt-6 border-t border-terminal-border">
                <div className="text-terminal-gray text-sm">
                  <span className="text-terminal-green">$</span> echo "End of post"
                </div>
              </div>
            </article>

            {/* Image Modal */}
            <ImageModal />

            {/* Comments */}
            <div className="mt-8">
              <DisqusComments post={post} />
            </div>

            {/* Navigation */}
            <div className="mt-8 flex justify-between items-center">
              {previousPost ? (
                <Link
                  href={`/blog/${previousPost.slug}`}
                  className="flex items-center space-x-2 text-terminal-gray hover:text-terminal-green transition-colors"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                  <span>← Previous Post</span>
                </Link>
              ) : (
                <div></div>
              )}

              <Link
                href="/blog"
                className="bg-terminal-surface border border-terminal-border px-4 py-2 hover:border-terminal-green transition-colors"
              >
                <i className="fa-solid fa-list mr-2"></i>
                All Posts
              </Link>

              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="flex items-center space-x-2 text-terminal-gray hover:text-terminal-green transition-colors"
                >
                  <span>Next Post →</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </Link>
              ) : (
                <div></div>
              )}
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <h3 className="text-lg font-semibold text-white mb-6">
                  <span className="text-terminal-green">$ </span>Related Posts
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="bg-terminal-surface border border-terminal-border p-4 hover:border-terminal-green transition-colors cursor-pointer block"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-terminal-gray text-xs">{formatDate(relatedPost.date)}</span>
                        <i className={`${getIconElement(relatedPost.icon)} text-terminal-green`}></i>
                      </div>
                      <h4 className="text-white font-medium mb-2">{relatedPost.title}</h4>
                      <p className="text-terminal-gray text-sm">{relatedPost.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

    </>
  )
}

