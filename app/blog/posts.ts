import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  icon: string
  content: string
}

const postsDirectory = path.join(process.cwd(), 'content/blog')

export function getAllPosts(): BlogPost[] {
  // Get all markdown files in the posts directory
  const fileNames = fs.existsSync(postsDirectory)
    ? fs.readdirSync(postsDirectory).filter((name) => name.endsWith('.md'))
    : []

  const allPostsData = fileNames.map((fileName) => {
    // Remove .md extension to get the slug
    const slug = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const { data, content } = matter(fileContents)

    // Combine the data with the slug and content
    return {
      slug,
      title: data.title || '',
      date: data.date || '',
      description: data.description || '',
      tags: data.tags || [],
      icon: data.icon || 'fa-file-code',
      content: content.trim(),
    } as BlogPost
  })

  // Sort posts by date (most recent first)
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  // Validate slug to prevent path traversal - only allow alphanumeric, hyphens, underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
    return undefined
  }

  const fullPath = path.join(postsDirectory, `${slug}.md`)
  
  // Normalize path and verify it's within postsDirectory to prevent path traversal
  const resolvedPath = path.resolve(fullPath)
  const resolvedDir = path.resolve(postsDirectory)
  
  if (!resolvedPath.startsWith(resolvedDir)) {
    return undefined
  }

  if (!fs.existsSync(fullPath)) {
    return undefined
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title || '',
    date: data.date || '',
    description: data.description || '',
    tags: data.tags || [],
    icon: data.icon || 'fa-file-code',
    content: content.trim(),
  } as BlogPost
}
