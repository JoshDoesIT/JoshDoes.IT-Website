import Link from 'next/link'

export default function Footer() {
  return (
    <footer id="footer" className="bg-terminal-bg border-t border-terminal-border py-8">
      <div className="container mx-auto px-6 text-center">
        <div className="text-terminal-gray">
          <div className="mb-4">josh@joshdoes.it:~$ echo "Thanks for visiting!"</div>
          <div className="mb-4">© 2025 Josh Jones. All rights reserved.</div>
          <div className="flex justify-center space-x-4 text-sm">
            <Link href="/privacy" className="text-terminal-gray hover:text-terminal-green transition-colors">
              ./privacy
            </Link>
            <span className="text-terminal-gray">|</span>
            <Link href="/accessibility" className="text-terminal-gray hover:text-terminal-green transition-colors">
              ./accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

