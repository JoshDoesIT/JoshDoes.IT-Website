'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  published: boolean
  tags: string[]
  created_at: string
  updated_at: string
}

export default function AdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    published: false,
    tags: '',
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const postData = {
        ...formData,
        tags: tagsArray,
        slug: formData.slug || generateSlug(formData.title),
        updated_at: new Date().toISOString(),
      }

      if (editingPost) {
        const response = await fetch('/api/posts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...postData, id: editingPost.id }),
        })
        if (!response.ok) throw new Error('Failed to update post')
      } else {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        })
        if (!response.ok) throw new Error('Failed to create post')
      }

      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        published: false,
        tags: '',
      })
      setEditingPost(null)
      fetchPosts()
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Error saving post. Check console for details.')
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      published: post.published,
      tags: post.tags?.join(', ') || '',
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete post')
      fetchPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post.')
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-terminal-bg py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-12">
            <div className="text-terminal-gray mb-2">josh@security:~$ ./admin.sh</div>
            <h1 className="text-3xl font-bold text-white mb-6">Admin Portal</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="bg-terminal-surface border border-terminal-border p-6 mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-terminal-green mb-2 text-sm">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full bg-terminal-bg border border-terminal-border px-4 py-2 text-white focus:border-terminal-green focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-terminal-green mb-2 text-sm">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full bg-terminal-bg border border-terminal-border px-4 py-2 text-white focus:border-terminal-green focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-terminal-green mb-2 text-sm">Excerpt</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full bg-terminal-bg border border-terminal-border px-4 py-2 text-white focus:border-terminal-green focus:outline-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-terminal-green mb-2 text-sm">Content (HTML)</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full bg-terminal-bg border border-terminal-border px-4 py-2 text-white focus:border-terminal-green focus:outline-none font-mono text-sm"
                      rows={10}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-terminal-green mb-2 text-sm">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full bg-terminal-bg border border-terminal-border px-4 py-2 text-white focus:border-terminal-green focus:outline-none"
                      placeholder="Security, Compliance, AWS"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="published" className="text-terminal-gray">
                      Published
                    </label>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-terminal-green text-black px-6 py-2 hover:bg-terminal-green/90 transition-colors"
                    >
                      {editingPost ? 'Update' : 'Create'} Post
                    </button>
                    {editingPost && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost(null)
                          setFormData({
                            title: '',
                            slug: '',
                            excerpt: '',
                            content: '',
                            published: false,
                            tags: '',
                          })
                        }}
                        className="border border-terminal-border px-6 py-2 hover:border-terminal-green transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">All Posts</h2>
              {loading ? (
                <div className="text-terminal-gray">Loading...</div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-terminal-surface border border-terminal-border p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{post.title}</h3>
                          <div className="text-terminal-gray text-sm mt-1">
                            {format(new Date(post.created_at), 'MMM dd, yyyy')}
                            {post.published ? (
                              <span className="text-terminal-green ml-2">• Published</span>
                            ) : (
                              <span className="text-terminal-yellow ml-2">• Draft</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-terminal-green hover:text-white text-sm transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-terminal-red hover:text-white text-sm transition-colors"
                        >
                          Delete
                        </button>
                        {post.published && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-terminal-green hover:text-white text-sm transition-colors"
                          >
                            View
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

