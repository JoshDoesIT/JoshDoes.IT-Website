import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import fs from 'fs'
import path from 'path'
import { getAllPosts, getPostBySlug, type BlogPost } from '../posts'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import DisqusComments from '../../components/DisqusComments'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  
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

function getIconElement(iconClass: string) {
  const iconMap: Record<string, string> = {
    'fa-file-code': 'fa-solid fa-file-code',
    'fa-shield': 'fa-solid fa-shield',
    'fa-shield-alt': 'fa-solid fa-shield-halved',
    'fa-bug': 'fa-solid fa-bug',
    'fa-gavel': 'fa-solid fa-gavel',
    'fa-code-branch': 'fa-solid fa-code-branch',
    'fa-network-wired': 'fa-solid fa-network-wired',
    'fa-cloud-arrow-up': 'fa-solid fa-cloud-arrow-up',
    'fa-user-secret': 'fa-solid fa-user-secret',
  }
  
  return iconMap[iconClass] || 'fa-solid fa-file-code'
}

function formatDate(dateString: string) {
  // Parse date string in YYYY-MM-DD format and avoid timezone issues
  const [year, month, day] = dateString.split('-').map(Number)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function estimateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

function getPreviousPost(currentSlug: string): BlogPost | undefined {
  const posts = getAllPosts()
  const currentIndex = posts.findIndex(post => post.slug === currentSlug)
  return currentIndex > 0 ? posts[currentIndex - 1] : undefined
}

function getNextPost(currentSlug: string): BlogPost | undefined {
  const posts = getAllPosts()
  const currentIndex = posts.findIndex(post => post.slug === currentSlug)
  return currentIndex < posts.length - 1 ? posts[currentIndex + 1] : undefined
}

function getRelatedPosts(currentSlug: string, limit: number = 2): BlogPost[] {
  const posts = getAllPosts()
  const currentPost = getPostBySlug(currentSlug)
  if (!currentPost) return []
  
  // Get posts that share at least one tag, excluding the current post
  const related = posts
    .filter(post => 
      post.slug !== currentSlug &&
      post.tags.some(tag => currentPost.tags.includes(tag))
    )
    .slice(0, limit)
  
  // If we don't have enough related posts, fill with most recent posts
  if (related.length < limit) {
    const remaining = posts
      .filter(post => 
        post.slug !== currentSlug && 
        !related.some(r => r.slug === post.slug)
      )
      .slice(0, limit - related.length)
    related.push(...remaining)
  }
  
  return related
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // Enhanced markdown to HTML converter matching terminal theme
  const formatContent = (content: string) => {
    // Helper function to escape HTML entities - defined once at the top
    const escapeHtml = (text: string): string => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }
    
    let html = ''
    let inCodeBlock = false
    let codeBlockContent = ''
    let codeBlockLang = ''
    let inList = false
    let imageBlockOpen = false
    const lines = content.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Code blocks
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          // Close any open list before starting code block
          if (inList) {
            html += '</ul>'
            inList = false
          }
          inCodeBlock = true
          codeBlockContent = ''
          codeBlockLang = line.substring(3).trim()
        } else {
          inCodeBlock = false
          // Escape HTML in code block content
          const escapedCode = codeBlockContent
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
          // Escape code block language
          const escapedLang = codeBlockLang
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
          html += `<div class="bg-terminal-bg border border-terminal-border rounded p-4 my-6 overflow-x-auto">
            ${codeBlockLang ? `<div class="text-terminal-gray text-sm mb-2"><span class="text-terminal-green">$</span> ${escapedLang}</div>` : ''}
            <pre class="text-terminal-green text-sm"><code>${escapedCode.trim()}</code></pre>
          </div>`
          codeBlockContent = ''
        }
        continue
      }
      
      if (inCodeBlock) {
        codeBlockContent += line + '\n'
        continue
      }
      
      // Check if we're starting or ending a list
      const isListItem = line.startsWith('- ')
      if (isListItem && !inList) {
        html += '<ul class="list-none space-y-2 mb-6 pl-4">'
        inList = true
      } else if (!isListItem && inList && line.trim() !== '') {
        html += '</ul>'
        inList = false
      }
      
      // Headers with terminal-style prefix - SECURITY: Escape header content
      if (line.startsWith('# ')) {
        if (inList) {
          html += '</ul>'
          inList = false
        }
        const headerText = escapeHtml(line.substring(2))
        html += `<h1 class="text-3xl font-bold text-white mb-4 mt-8"><span class="text-terminal-green"># </span>${headerText}</h1>`
      } else if (line.startsWith('## ')) {
        if (inList) {
          html += '</ul>'
          inList = false
        }
        const headerText = escapeHtml(line.substring(3))
        html += `<h2 class="text-xl font-semibold text-white mb-4 mt-8"><span class="text-terminal-green"># </span>${headerText}</h2>`
      } else if (line.startsWith('### ')) {
        if (inList) {
          html += '</ul>'
          inList = false
        }
        const headerText = escapeHtml(line.substring(4))
        html += `<h3 class="text-lg font-semibold text-white mb-3 mt-6"><span class="text-terminal-green"># </span>${headerText}</h3>`
      } else if (line.startsWith('#### ')) {
        if (inList) {
          html += '</ul>'
          inList = false
        }
        const headerText = escapeHtml(line.substring(5))
        html += `<h4 class="text-base font-semibold text-white mb-2 mt-4"><span class="text-terminal-green"># </span>${headerText}</h4>`
      } else if (isListItem) {
        // List items with terminal arrow - SECURITY: Escape content before processing bold
        const listContent = line.substring(2)
        // Process bold text: **text** - escape content first
        const highlighted = listContent.replace(/\*\*(.*?)\*\*/g, (match, content) => {
          const escaped = escapeHtml(content)
          return `<span class="highlight bg-terminal-bg px-1 py-0.5 rounded border border-terminal-border">${escaped}</span>`
        })
        // Escape any remaining content that wasn't in bold markers
        const parts = highlighted.split(/(<span[^>]*>.*?<\/span>)/g)
        const escapedParts = parts.map(part => {
          if (part.startsWith('<span') && part.endsWith('</span>')) {
            return part // Already processed bold text
          }
          return escapeHtml(part) // Escape remaining text
        })
        html += `<li class="text-terminal-gray"><span class="text-terminal-green">→</span> ${escapedParts.join('')}</li>`
      } else if (line.trim() === '') {
        if (inList) {
          html += '</ul>'
          inList = false
        }
        // If image block is open, don't add <br /> yet - might have caption coming
        if (!imageBlockOpen) {
          html += '<br />'
        }
      } else if (line.trim().startsWith('$')) {
        if (inList) {
          html += '</ul>'
          inList = false
        }
        // Terminal command style - SECURITY: Escape command content
        const escapedLine = escapeHtml(line)
        html += `<div class="text-terminal-gray mb-6"><span class="text-terminal-green">${escapedLine}</span></div>`
      } else if (line.trim().match(/^!\[.*?\]\(.*?\)$/)) {
        // Image markdown: ![alt text](/path/to/image.png)
        if (inList) {
          html += '</ul>'
          inList = false
        }
        // Close any open image block
        if (imageBlockOpen) {
          html += '</div>'
          imageBlockOpen = false
        }
        const imageMatch = line.trim().match(/^!\[(.*?)\]\((.*?)\)$/)
        if (imageMatch) {
          // Sanitize alt text and image path - SECURITY: Use outer escapeHtml function
          const rawAltText = imageMatch[1]
          const rawImagePath = imageMatch[2].trim()
          
          // SECURITY: Block dangerous protocols in image URLs
          const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:']
          const hasDangerousProtocol = dangerousProtocols.some(proto => 
            rawImagePath.toLowerCase().startsWith(proto)
          )
          
          // Only allow relative paths starting with / or https:// or http://
          const isSafeImagePath = !hasDangerousProtocol && (
            rawImagePath.startsWith('/') || 
            rawImagePath.startsWith('https://') || 
            rawImagePath.startsWith('http://')
          )
          
          if (isSafeImagePath) {
            const escapedAltText = escapeHtml(rawAltText)
            const escapedImagePath = escapeHtml(rawImagePath)
            html += `<div class="my-8"><img src="${escapedImagePath}" alt="${escapedAltText}" class="w-full rounded border border-terminal-border cursor-pointer hover:opacity-90 transition-opacity blog-image" data-image-src="${escapedImagePath}" data-image-alt="${escapedAltText}" /><p class="text-terminal-gray text-xs italic text-center mt-1 opacity-75"><i class="fa-solid fa-expand mr-1"></i> Click to expand</p>`
            imageBlockOpen = true
          }
        }
      } else if (line.trim().startsWith('*') && line.trim().endsWith('*') && line.trim().length > 2 && !line.trim().includes('**')) {
        // Italic caption for images
        if (inList) {
          html += '</ul>'
          inList = false
        }
        const captionText = line.trim().substring(1, line.trim().length - 1)
        // SECURITY: Use outer escapeHtml function
        const escapedCaption = escapeHtml(captionText)
        
        if (imageBlockOpen) {
          // Caption immediately after image (or after blank line)
          html += `<p class="text-terminal-gray text-sm italic mt-2 mb-6 text-center">${escapedCaption}</p></div>`
          imageBlockOpen = false
        } else {
          html += `<p class="text-terminal-gray text-sm italic mb-6 text-center">${escapedCaption}</p>`
        }
      } else {
        if (inList) {
          html += '</ul>'
          inList = false
        }
        // Close any open image block before regular content
        if (imageBlockOpen) {
          html += '</div>'
          imageBlockOpen = false
        }
        // Regular paragraphs
        let processedLine = line
        
        // Process markdown links: [text](url) - with URL sanitization
        // SECURITY: Validate and sanitize URLs to prevent javascript: and data: XSS
        processedLine = processedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
          // Sanitize URL - only allow http://, https://, mailto:, or relative paths starting with /
          const sanitizedUrl = url.trim()
          
          // SECURITY: Block dangerous protocols (javascript:, data:, vbscript:, etc.)
          const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:']
          const hasDangerousProtocol = dangerousProtocols.some(proto => 
            sanitizedUrl.toLowerCase().startsWith(proto)
          )
          
          if (hasDangerousProtocol) {
            // Return escaped plain text if URL uses dangerous protocol
            return escapeHtml(text)
          }
          
          const isSafeUrl = sanitizedUrl.startsWith('http://') || 
                           sanitizedUrl.startsWith('https://') || 
                           sanitizedUrl.startsWith('mailto:') ||
                           sanitizedUrl.startsWith('/') ||
                           sanitizedUrl.startsWith('#')
          
          if (!isSafeUrl) {
            // Return escaped plain text if URL is unsafe
            return escapeHtml(text)
          }
          
          // Escape HTML in link text and URL
          const escapedText = escapeHtml(text)
          const escapedUrl = escapeHtml(sanitizedUrl)
          
          return `<a href="${escapedUrl}" class="text-terminal-green hover:text-white underline" target="_blank" rel="noopener noreferrer">${escapedText}</a>`
        })
        
        // Process bold text: **text** - escape HTML in content
        processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, (match, content) => {
          // Skip if content already contains HTML tags (from links)
          if (/<[^>]+>/.test(content)) {
            return match // Return original if already processed as HTML
          }
          const escaped = escapeHtml(content)
          return `<span class="highlight bg-terminal-bg px-1 py-0.5 rounded border border-terminal-border">${escaped}</span>`
        })
        
        // Process inline code: `code` - escape HTML
        processedLine = processedLine.replace(/`(.*?)`/g, (match, content) => {
          // Skip if content already contains HTML tags (from links)
          if (/<[^>]+>/.test(content)) {
            return match // Return original if already processed as HTML
          }
          const escaped = escapeHtml(content)
          return `<code class="bg-terminal-bg px-1 py-0.5 text-terminal-green rounded text-sm border border-terminal-border">${escaped}</code>`
        })
        
        // Escape any remaining raw HTML in text that wasn't converted to HTML tags
        // Match text outside of HTML tags
        const parts = processedLine.split(/(<[^>]+>)/g)
        const escapedParts = parts.map(part => {
          // If it's an HTML tag, leave it as is
          if (part.startsWith('<') && part.endsWith('>')) {
            return part
          }
          // Otherwise escape HTML entities
          return escapeHtml(part)
        })
        
        html += `<p class="text-terminal-gray leading-relaxed mb-6">${escapedParts.join('')}</p>`
      }
    }
    
    // Close any open list at the end
    if (inList) {
      html += '</ul>'
    }
    
    // Close any open image block at the end
    if (imageBlockOpen) {
      html += '</div>'
    }
    
    return html
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
          <div className="container mx-auto px-6 max-w-4xl">
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
            <article className="bg-terminal-surface border border-terminal-border p-8">
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
            <div id="imageModal" className="fixed inset-0 bg-black bg-opacity-90 z-50 hidden items-center justify-center p-4">
              <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
                <button
                  id="closeModal"
                  className="absolute top-4 right-4 text-white hover:text-terminal-green text-2xl z-10 bg-terminal-bg border border-terminal-border px-4 py-2 rounded"
                  aria-label="Close modal"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
                <img id="modalImage" src="" alt="" className="max-w-full max-h-full object-contain rounded border border-terminal-border" />
              </div>
            </div>

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
      <Script
        id="image-modal-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              let initialized = false;
              
              function initImageModal() {
                if (initialized) return;
                
                const modal = document.getElementById('imageModal');
                const modalImage = document.getElementById('modalImage');
                const closeModal = document.getElementById('closeModal');
                
                if (!modal || !modalImage || !closeModal) {
                  // Retry after a short delay if elements aren't ready
                  setTimeout(initImageModal, 100);
                  return;
                }
                
                initialized = true;
                
                function openModal(src, alt) {
                  // SECURITY: Validate image source to prevent XSS
                  // The src should already be validated from the markdown parser,
                  // but add an extra layer of protection
                  if (typeof src !== 'string' || src.length === 0) {
                    return;
                  }
                  // Block dangerous protocols
                  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:'];
                  const lowerSrc = src.toLowerCase();
                  if (dangerousProtocols.some(proto => lowerSrc.startsWith(proto))) {
                    return;
                  }
                  modalImage.src = src;
                  modalImage.alt = typeof alt === 'string' ? alt : '';
                  modal.classList.remove('hidden');
                  modal.classList.add('flex');
                  document.body.style.overflow = 'hidden';
                }
                
                function closeModalHandler() {
                  modal.classList.add('hidden');
                  modal.classList.remove('flex');
                  document.body.style.overflow = '';
                }
                
                // Use event delegation on the document to handle dynamically added images
                document.addEventListener('click', function(e) {
                  const clickedImage = e.target.closest('.blog-image');
                  if (clickedImage) {
                    e.preventDefault();
                    const src = clickedImage.getAttribute('data-image-src') || clickedImage.src;
                    const alt = clickedImage.getAttribute('data-image-alt') || clickedImage.alt;
                    openModal(src, alt);
                  }
                });
                
                closeModal.addEventListener('click', closeModalHandler);
                
                modal.addEventListener('click', function(e) {
                  // Close if clicking anywhere except the image or close button
                  const clickedElement = e.target;
                  if (clickedElement !== modalImage && 
                      clickedElement !== closeModal &&
                      !modalImage.contains(clickedElement) &&
                      !closeModal.contains(clickedElement)) {
                    closeModalHandler();
                  }
                });
                
                document.addEventListener('keydown', function(e) {
                  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                    closeModalHandler();
                  }
                });
              }

              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initImageModal);
              } else {
                // Use setTimeout to ensure DOM is fully ready
                setTimeout(initImageModal, 0);
              }
            })();
          `,
        }}
      />
    </>
  )
}

