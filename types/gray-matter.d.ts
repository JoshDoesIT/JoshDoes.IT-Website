declare module 'gray-matter' {
  interface MatterResult {
    data: Record<string, unknown>
    content: string
    excerpt?: string
    orig: Buffer | string
  }

  function matter(
    input: string | Buffer,
    options?: {
      delimiters?: string | string[]
      excerpt?: boolean | ((file: MatterResult) => string)
      excerpt_separator?: string
      engines?: Record<string, (input: string) => unknown>
      language?: string
      parser?: (input: string) => unknown
    }
  ): MatterResult

  export = matter
}
