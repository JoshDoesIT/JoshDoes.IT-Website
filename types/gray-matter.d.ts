declare module 'gray-matter' {
  interface MatterResult {
    data: { [key: string]: any }
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
      engines?: { [key: string]: (input: string) => any }
      language?: string
      parser?: (input: string) => any
    }
  ): MatterResult

  export = matter
}

