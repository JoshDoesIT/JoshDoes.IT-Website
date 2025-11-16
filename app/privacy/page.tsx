import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Privacy Policy - Josh Does IT',
  description: 'Privacy policy for joshdoes.it',
}

export default function PrivacyPage() {
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
                <i className="fa-solid fa-chevron-right text-xs"></i>
                <span className="text-terminal-green">privacy-policy.md</span>
              </div>
            </div>

            {/* Article */}
            <article className="bg-terminal-surface border border-terminal-border p-8">
              {/* Article Header */}
              <div className="mb-8 pb-6 border-b border-terminal-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-terminal-gray text-sm">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <i className="fa-solid fa-shield text-terminal-green text-xl"></i>
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">Privacy Policy</h1>

                <p className="text-terminal-gray text-lg leading-relaxed mb-4">
                  Your privacy is important to me. This policy explains how this website collects, uses, and protects your information.
                </p>
              </div>

              {/* Article Content */}
              <div className="mb-6">
                <div className="text-terminal-gray mb-6">
                  <span className="text-terminal-green">$</span> cat privacy-policy.md
                </div>

                <div className="prose prose-invert max-w-none">
                  {/* Information Collection */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 mt-8">
                      <span className="text-terminal-green"># </span>Information Collection
                    </h2>
                    <p className="text-terminal-gray leading-relaxed mb-6">
                      This website does not directly collect or store personal information. I don't use analytics, tracking pixels, or any form of data collection on my end.
                    </p>
                  </div>

                  {/* Third-Party Services */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 mt-8">
                      <span className="text-terminal-green"># </span>Third-Party Services
                    </h2>
                    <p className="text-terminal-gray leading-relaxed mb-4">
                      This website uses the following third-party services that may collect information:
                    </p>
                    
                    <h3 className="text-lg font-semibold text-white mb-3 mt-6">
                      <span className="text-terminal-green"># </span>Disqus Comments
                    </h3>
                    <p className="text-terminal-gray leading-relaxed mb-4">
                      This website uses Disqus for blog post comments. When you visit a blog post with comments or interact with Disqus, Disqus may:
                    </p>
                    <ul className="list-none space-y-2 mb-6 pl-4">
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> Set cookies to maintain your session and preferences</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> Collect information about your device, browser, and IP address</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> Track your usage if you have a Disqus account</li>
                    </ul>
                    <p className="text-terminal-gray leading-relaxed mb-6">
                      Disqus has its own privacy policy and terms of service. For more information, please visit{' '}
                      <a href="https://help.disqus.com/en/articles/1717103-disqus-privacy-policy" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-terminal-green hover:text-white underline">
                        Disqus Privacy Policy
                      </a>.
                    </p>

                    <h3 className="text-lg font-semibold text-white mb-3 mt-6">
                      <span className="text-terminal-green"># </span>Font Awesome CDN
                    </h3>
                    <p className="text-terminal-gray leading-relaxed mb-6">
                      This website loads icons from the Font Awesome CDN (cdnjs.cloudflare.com). This service may log your IP address and browser information as part of standard CDN operations, but I do not have access to this information.
                    </p>
                  </div>

                  {/* Cookies */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 mt-8">
                      <span className="text-terminal-green"># </span>Cookies
                    </h2>
                    <p className="text-terminal-gray leading-relaxed mb-4">
                      This website itself does not set any cookies. However, third-party services used on this site may set cookies:
                    </p>
                    <ul className="list-none space-y-2 mb-6 pl-4">
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> <strong className="text-white">Disqus</strong> sets cookies for comment functionality, user authentication, and preferences</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> You can control cookies through your browser settings</li>
                    </ul>
                  </div>

                  {/* Data Sharing */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 mt-8">
                      <span className="text-terminal-green"># </span>Data Sharing
                    </h2>
                    <p className="text-terminal-gray leading-relaxed mb-6">
                      I do not share, sell, or trade any personal information. Since I don't collect personal information directly, there's nothing to share. Third-party services (like Disqus) have their own data practices as outlined in their respective privacy policies.
                    </p>
                  </div>

                  {/* Your Rights */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 mt-8">
                      <span className="text-terminal-green"># </span>Your Rights
                    </h2>
                    <p className="text-terminal-gray leading-relaxed mb-4">
                      You have the right to:
                    </p>
                    <ul className="list-none space-y-2 mb-6 pl-4">
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> Control cookies through your browser settings</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> Disable JavaScript if you don't want to use Disqus comments</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> Use browser extensions to block third-party cookies</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> Contact me with questions about this privacy policy</li>
                    </ul>
                  </div>

                  {/* Changes to This Policy */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 mt-8">
                      <span className="text-terminal-green"># </span>Changes to This Policy
                    </h2>
                    <p className="text-terminal-gray leading-relaxed mb-6">
                      I may update this privacy policy from time to time. The "Last Updated" date at the top of this page indicates when changes were made. I encourage you to review this policy periodically.
                    </p>
                  </div>

                  {/* Contact */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 mt-8">
                      <span className="text-terminal-green"># </span>Contact
                    </h2>
                    <p className="text-terminal-gray leading-relaxed mb-6">
                      If you have questions about this privacy policy, you can contact me:
                    </p>
                    <a href="mailto:contact@joshdoes.it" className="block bg-terminal-surface border border-terminal-green px-6 py-3 hover:bg-terminal-green hover:text-black transition-all max-w-md mx-auto text-center mb-6">
                      <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 512 512">
                        <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                      </svg>
                      contact@joshdoes.it
                    </a>
                  </div>
                </div>
              </div>

              {/* Article Footer */}
              <div className="mt-12 pt-6 border-t border-terminal-border">
                <div className="text-terminal-gray text-sm">
                  <span className="text-terminal-green">$</span> echo "End of privacy policy"
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

