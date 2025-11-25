import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Accessibility Statement - Josh Does IT',
  description: 'Accessibility statement for joshdoes.it',
}

export default function AccessibilityPage() {
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
                <span className="text-terminal-green">accessibility-statement.md</span>
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
                  <i className="fa-solid fa-universal-access text-terminal-green text-xl"></i>
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">Accessibility Statement</h1>

                <p className="text-terminal-gray text-lg leading-relaxed mb-4">
                  I'm committed to ensuring this website is accessible to all users, regardless of ability or technology used.
                </p>
              </div>

              {/* Article Content */}
              <div className="mb-6">
                <div className="text-terminal-gray mb-6">
                  <span className="text-terminal-green">$</span> cat accessibility-statement.md
                </div>

                <div className="prose prose-invert max-w-none">
                  {/* Commitment */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 mt-8">
                      <span className="text-terminal-green"># </span>Commitment
                    </h2>
                    <p className="text-terminal-gray leading-relaxed mb-6">
                      I strive to make this website accessible to all users, following the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA where possible. This website is designed to be usable by people with disabilities and those using assistive technologies.
                    </p>
                  </div>

                  {/* Accessibility Features */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 mt-8">
                      <span className="text-terminal-green"># </span>Accessibility Features
                    </h2>
                    <p className="text-terminal-gray leading-relaxed mb-4">
                      This website includes the following accessibility features:
                    </p>
                    <ul className="list-none space-y-2 mb-6 pl-4">
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> <strong className="text-white">Semantic HTML:</strong> Content is structured with proper heading hierarchy and semantic elements</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> <strong className="text-white">Keyboard Navigation:</strong> All interactive elements can be accessed using a keyboard</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> <strong className="text-white">Alt Text:</strong> Images include descriptive alt text where appropriate</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> <strong className="text-white">Color Contrast:</strong> Text and background colors meet WCAG contrast requirements</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> <strong className="text-white">Focus Indicators:</strong> Interactive elements have visible focus states</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> <strong className="text-white">Responsive Design:</strong> Website works across different screen sizes and devices</li>
                    </ul>
                  </div>

                  {/* Known Issues */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 mt-8">
                      <span className="text-terminal-green"># </span>Known Issues
                    </h2>
                    <p className="text-terminal-gray leading-relaxed mb-4">
                      I'm aware of the following accessibility issues and am working to address them:
                    </p>
                    
                    <h3 className="text-lg font-semibold text-white mb-3 mt-6">
                      <span className="text-terminal-green"># </span>Third-Party Services
                    </h3>
                    <p className="text-terminal-gray leading-relaxed mb-4">
                      Some third-party services used on this site may have accessibility limitations:
                    </p>
                    <ul className="list-none space-y-2 mb-6 pl-4">
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> <strong className="text-white">Disqus Comments:</strong> The Disqus commenting system is provided by a third party. While Disqus has accessibility features, some aspects may not fully meet WCAG 2.1 Level AA standards</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> <strong className="text-white">Font Awesome Icons:</strong> Icons are used with appropriate labels and ARIA attributes where possible</li>
                    </ul>
                  </div>

                  {/* Feedback */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 mt-8">
                      <span className="text-terminal-green"># </span>Feedback
                    </h2>
                    <p className="text-terminal-gray leading-relaxed mb-4">
                      I welcome feedback on the accessibility of this website. If you encounter accessibility barriers, please contact me:
                    </p>
                    <ul className="list-none space-y-2 mb-6 pl-4">
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> Describe the accessibility issue you encountered</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> Include the page URL where the issue occurred</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> Specify the assistive technology or browser you're using, if applicable</li>
                    </ul>
                    <p className="text-terminal-gray leading-relaxed mb-6">
                      I will respond to accessibility feedback and work to address issues promptly.
                    </p>
                  </div>

                  {/* Standards */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 mt-8">
                      <span className="text-terminal-green"># </span>Standards
                    </h2>
                    <p className="text-terminal-gray leading-relaxed mb-4">
                      This website aims to conform to the following accessibility standards:
                    </p>
                    <ul className="list-none space-y-2 mb-6 pl-4">
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> <strong className="text-white">WCAG 2.1 Level AA:</strong> Web Content Accessibility Guidelines 2.1 at Level AA</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> <strong className="text-white">Section 508:</strong> Compliance with Section 508 of the Rehabilitation Act where applicable</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> <strong className="text-white">ARIA:</strong> Use of ARIA attributes to enhance screen reader compatibility</li>
                    </ul>
                  </div>

                  {/* Assistive Technologies */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 mt-8">
                      <span className="text-terminal-green"># </span>Assistive Technologies
                    </h2>
                    <p className="text-terminal-gray leading-relaxed mb-4">
                      This website has been tested with the following assistive technologies:
                    </p>
                    <ul className="list-none space-y-2 mb-6 pl-4">
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> Screen readers (NVDA, JAWS, VoiceOver)</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> Keyboard-only navigation</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> Browser zoom up to 200%</li>
                      <li className="text-terminal-gray"><span className="text-terminal-green">→</span> Mobile devices with accessibility features enabled</li>
                    </ul>
                  </div>

                  {/* Ongoing Improvements */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 mt-8">
                      <span className="text-terminal-green"># </span>Ongoing Improvements
                    </h2>
                    <p className="text-terminal-gray leading-relaxed mb-6">
                      Accessibility is an ongoing effort. I regularly review and update this website to improve accessibility. As I add new features or content, I strive to ensure they meet accessibility standards.
                    </p>
                  </div>

                  {/* Contact */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 mt-8">
                      <span className="text-terminal-green"># </span>Contact
                    </h2>
                    <p className="text-terminal-gray leading-relaxed mb-6">
                      If you have accessibility concerns or suggestions, please contact me:
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
                  <span className="text-terminal-green">$</span> echo "End of accessibility statement"
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

