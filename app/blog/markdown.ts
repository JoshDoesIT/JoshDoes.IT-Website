/**
 * @fileoverview Markdown to HTML Formatter
 *
 * Converts markdown content to terminal-themed HTML with security protections
 * against XSS attacks through proper HTML escaping and URL sanitization.
 *
 * @module blog/markdown
 */

/**
 * Escapes HTML entities to prevent XSS attacks.
 *
 * @param text - Raw text to escape
 * @returns Escaped text safe for HTML rendering
 */
export function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

/**
 * Validates a URL is safe (not a dangerous protocol).
 *
 * @param url - URL to validate
 * @returns True if URL is safe for use in hrefs
 */
export function isSafeUrl(url: string): boolean {
    const sanitizedUrl = url.trim().toLowerCase()

    // Block dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:']
    if (dangerousProtocols.some(proto => sanitizedUrl.startsWith(proto))) {
        return false
    }

    // Only allow safe protocols
    return (
        url.trim().startsWith('http://') ||
        url.trim().startsWith('https://') ||
        url.trim().startsWith('mailto:') ||
        url.trim().startsWith('/') ||
        url.trim().startsWith('#')
    )
}

/**
 * Validates an image path is safe.
 *
 * @param imagePath - Image path to validate
 * @returns True if path is safe for img src
 */
export function isSafeImagePath(imagePath: string): boolean {
    const path = imagePath.trim().toLowerCase()

    // Block dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:']
    if (dangerousProtocols.some(proto => path.startsWith(proto))) {
        return false
    }

    // Only allow relative paths or http(s)
    return (
        imagePath.trim().startsWith('/') ||
        imagePath.trim().startsWith('https://') ||
        imagePath.trim().startsWith('http://')
    )
}

/**
 * Converts markdown content to terminal-themed HTML.
 *
 * Features:
 * - Code blocks with language indicator
 * - Headers (h1-h4) with terminal prefix
 * - Lists with terminal arrow bullets
 * - Links with XSS protection
 * - Images with lightbox support
 * - Inline code and bold formatting
 *
 * @param content - Raw markdown content
 * @returns HTML string safe for dangerouslySetInnerHTML
 */
export function formatContent(content: string): string {
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
                const escapedCode = escapeHtml(codeBlockContent)
                const escapedLang = escapeHtml(codeBlockLang)
                html += `<div class="bg-terminal-bg border border-terminal-border rounded p-4 my-6 overflow-x-auto code-block-wrapper">
            ${codeBlockLang ? `<div class="text-terminal-gray text-sm mb-2"><span class="text-terminal-green">$</span> ${escapedLang}</div>` : ''}
            <pre class="text-terminal-green text-sm code-block-pre"><code class="code-block-code">${escapedCode.trim()}</code></pre>
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

        // Headers with terminal-style prefix
        // Note: inList is always false here because line 133 closes the list for any non-list content
        if (line.startsWith('# ')) {
            const headerText = escapeHtml(line.substring(2))
            html += `<h1 class="text-3xl font-bold text-white mb-4 mt-8"><span class="text-terminal-green"># </span>${headerText}</h1>`
        } else if (line.startsWith('## ')) {
            const headerText = escapeHtml(line.substring(3))
            html += `<h2 class="text-xl font-semibold text-white mb-4 mt-8"><span class="text-terminal-green"># </span>${headerText}</h2>`
        } else if (line.startsWith('### ')) {
            const headerText = escapeHtml(line.substring(4))
            html += `<h3 class="text-lg font-semibold text-white mb-3 mt-6"><span class="text-terminal-green"># </span>${headerText}</h3>`
        } else if (line.startsWith('#### ')) {
            const headerText = escapeHtml(line.substring(5))
            html += `<h4 class="text-base font-semibold text-white mb-2 mt-4"><span class="text-terminal-green"># </span>${headerText}</h4>`
        } else if (isListItem) {
            // List items with terminal arrow
            const listContent = line.substring(2)
            const highlighted = listContent.replace(/\*\*(.*?)\*\*/g, (match, content) => {
                const escaped = escapeHtml(content)
                return `<span class="highlight bg-terminal-bg px-1 py-0.5 rounded border border-terminal-border">${escaped}</span>`
            })
            const parts = highlighted.split(/(<span[^>]*>.*?<\/span>)/g)
            const escapedParts = parts.map(part => {
                if (part.startsWith('<span') && part.endsWith('</span>')) {
                    return part
                }
                return escapeHtml(part)
            })
            html += `<li class="text-terminal-gray"><span class="text-terminal-green">→</span> ${escapedParts.join('')}</li>`
        } else if (line.trim() === '') {
            if (inList) {
                html += '</ul>'
                inList = false
            }
            if (!imageBlockOpen) {
                html += '<br />'
            }
        } else if (line.trim().startsWith('$')) {
            const escapedLine = escapeHtml(line)
            html += `<div class="text-terminal-gray mb-6"><span class="text-terminal-green">${escapedLine}</span></div>`
        } else if (line.trim().match(/^!\[.*?\]\(.*?\)$/)) {
            // Image markdown
            if (imageBlockOpen) {
                html += '</div>'
                imageBlockOpen = false
            }
            const imageMatch = line.trim().match(/^!\[(.*?)\]\((.*?)\)$/)
            if (imageMatch) {
                const rawAltText = imageMatch[1]
                const rawImagePath = imageMatch[2].trim()

                if (isSafeImagePath(rawImagePath)) {
                    const escapedAltText = escapeHtml(rawAltText)
                    const escapedImagePath = escapeHtml(rawImagePath)
                    html += `<div class="my-8"><img src="${escapedImagePath}" alt="${escapedAltText}" class="w-full rounded border border-terminal-border cursor-pointer hover:opacity-90 transition-opacity blog-image" data-image-src="${escapedImagePath}" data-image-alt="${escapedAltText}" /><p class="text-terminal-gray text-xs italic text-center mt-1 opacity-75"><i class="fa-solid fa-expand mr-1"></i> Click to expand</p>`
                    imageBlockOpen = true
                }
            }
        } else if (line.trim().startsWith('*') && line.trim().endsWith('*') && line.trim().length > 2 && !line.trim().includes('**')) {
            // Italic caption
            const captionText = line.trim().substring(1, line.trim().length - 1)
            const escapedCaption = escapeHtml(captionText)

            if (imageBlockOpen) {
                html += `<p class="text-terminal-gray text-sm italic mt-2 mb-6 text-center">${escapedCaption}</p></div>`
                imageBlockOpen = false
            } else {
                html += `<p class="text-terminal-gray text-sm italic mb-6 text-center">${escapedCaption}</p>`
            }
        } else {
            if (imageBlockOpen) {
                html += '</div>'
                imageBlockOpen = false
            }

            // Regular paragraphs
            let processedLine = line

            // Process markdown links
            processedLine = processedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
                if (!isSafeUrl(url)) {
                    return escapeHtml(text)
                }
                const escapedText = escapeHtml(text)
                const escapedUrl = escapeHtml(url.trim())
                return `<a href="${escapedUrl}" class="text-terminal-green hover:text-white underline" target="_blank" rel="noopener noreferrer">${escapedText}</a>`
            })

            // Process bold text
            processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, (match, content) => {
                if (/<[^>]+>/.test(content)) {
                    return match
                }
                const escaped = escapeHtml(content)
                return `<span class="highlight bg-terminal-bg px-1 py-0.5 rounded border border-terminal-border">${escaped}</span>`
            })

            // Process inline code
            processedLine = processedLine.replace(/`(.*?)`/g, (match, content) => {
                if (/<[^>]+>/.test(content)) {
                    return match
                }
                const escaped = escapeHtml(content)
                return `<code class="bg-terminal-bg px-1 py-0.5 text-terminal-green rounded text-sm border border-terminal-border">${escaped}</code>`
            })

            // Escape remaining text outside of HTML tags
            const parts = processedLine.split(/(<[^>]+>)/g)
            const escapedParts = parts.map(part => {
                if (part.startsWith('<') && part.endsWith('>')) {
                    return part
                }
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
