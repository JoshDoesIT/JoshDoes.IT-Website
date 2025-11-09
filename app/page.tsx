import Header from './components/Header'
import Footer from './components/Footer'
import LocalTime from './components/LocalTime'
import TypingAnimation from './components/TypingAnimation'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section id="hero" className="h-[600px] flex items-center justify-center bg-terminal-bg">
          <div className="text-center max-w-4xl mx-auto px-6">
            <div className="mb-6">
              <LocalTime />
              <div className="text-xl mb-4">
                josh@joshdoes.it:~$ <TypingAnimation text="whoami" speed={100} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Josh</span> <span className="text-terminal-green">Jones</span>
            </h1>
            <div className="text-xl md:text-2xl mb-8 text-terminal-gray">
              <span className="text-terminal-green">&gt;</span> GRC Engineering & Security Automation Specialist
            </div>
            <div className="text-terminal-gray mb-8">
              Operationalizing GRC programs through code, integrations, and workflow automation across enterprise environments.
            </div>
            <div className="flex justify-center space-x-4">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-terminal-surface border border-terminal-green px-6 py-3 hover:bg-terminal-green hover:text-black transition-all"
              >
                cat resume.pdf
              </a>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-terminal-surface">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-12">
              <div className="text-terminal-gray mb-2">josh@joshdoes.it:~$ cat about.txt</div>
              <h2 className="text-3xl font-bold text-white mb-6">About Me</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="bg-terminal-bg border border-terminal-border p-6">
                  <div className="text-terminal-green mb-4">// Professional Summary</div>
                  <p className="text-terminal-gray leading-relaxed">
                    GRC engineering and security automation specialist with deep experience operationalizing 
                    GRC programs through code, integrations, and workflow automation. Skilled at 
                    turning compliance frameworks into scalable controls, building audit-ready systems, and bridging 
                    regulatory and engineering worlds in fast-paced environments. Experienced across IT and security 
                    domains including security architecture, security governance, security risk management, system 
                    administration, networking, and application development.
                  </p>
                </div>
                <div className="bg-terminal-bg border border-terminal-border p-6">
                  <div className="text-terminal-green mb-4">// Certifications</div>
                  <ul className="space-y-2 text-terminal-gray">
                    <li><span className="text-terminal-green">&gt;</span> CISSP - Certified Information Systems Security Professional</li>
                    <li><span className="text-terminal-green">&gt;</span> CISA - Certified Information Systems Auditor</li>
                    <li><span className="text-terminal-green">&gt;</span> CSIS (A+, Network+, Security+)</li>
                    <li><span className="text-terminal-green">&gt;</span> PCI ISA - PCI Internal Security Assessor</li>
                    <li><span className="text-terminal-green">&gt;</span> PCIP - Payment Card Industry Professional</li>
                    <li><span className="text-terminal-green">&gt;</span> Project+</li>
                    <li><span className="text-terminal-green">&gt;</span> ISO 42001:2023 Lead Auditor</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-terminal-bg border border-terminal-border p-6">
                  <div className="text-terminal-green mb-4">// Contact Info</div>
                  <div className="space-y-2 text-terminal-gray">
                    <div><span className="text-terminal-green">email:</span> contact@joshdoes.it</div>
                    <div><span className="text-terminal-green">phone:</span> 423-967-9970</div>
                    <div><span className="text-terminal-green">location:</span> Johnson City, TN</div>
                    <div><span className="text-terminal-green">website:</span> joshdoes.it</div>
                  </div>
                </div>
                <div className="bg-terminal-bg border border-terminal-border p-6">
                  <div className="text-terminal-green mb-4">// Education</div>
                  <div className="space-y-2 text-terminal-gray">
                    <div><span className="text-terminal-green">degree:</span> BS, IT - Information Assurance and Security</div>
                    <div><span className="text-terminal-green">school:</span> Capella University</div>
                    <div><span className="text-terminal-green">status:</span> Graduated Summa Cum Laude (4.0 GPA)</div>
                    <div className="text-xs mt-2">NSA & DHS Designated National Center of Academic Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="py-20 bg-terminal-bg">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-12">
              <div className="text-terminal-gray mb-2">josh@joshdoes.it:~$ cat experience.log</div>
              <h2 className="text-3xl font-bold text-white mb-6">Work Experience</h2>
            </div>
            <div className="space-y-8">
              <div className="bg-terminal-surface border border-terminal-border p-6">
                <div className="mb-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white mb-1">Compliance Programs Manager, Security and Healthcare</h3>
                    <div className="text-terminal-gray md:text-right md:ml-4 md:flex-shrink-0">06/2024 - Present</div>
                  </div>
                  <div className="text-terminal-green">InComm Payments • Atlanta, GA</div>
                </div>
                <ul className="space-y-2 text-terminal-gray">
                  <li><span className="text-terminal-green">&gt;</span> Built the enterprise Compliance Engineering function, automating continuous monitoring across Azure, M365, AWS, OCI, and on-premises environments</li>
                  <li><span className="text-terminal-green">&gt;</span> Reduced audit prep time by 60% through automated audit evidence collection, saving engineering teams countless hours</li>
                  <li><span className="text-terminal-green">&gt;</span> Used Copilot Studio to build a custom AI agent to match customer questionnaire questions to standard Q&A responses, cutting review time by more than 80%</li>
                  <li><span className="text-terminal-green">&gt;</span> Successfully completed over 25 external audits or assessments annually covering PCI DSS, PCI Secure Software Standard, HITRUST, SOC1, SOC2, SOC3, and partner audits</li>
                  <li><span className="text-terminal-green">&gt;</span> Partnered with DevOps, Security, and Infrastructure teams to embed compliance into CI/CD pipelines</li>
                </ul>
              </div>
              <div className="bg-terminal-surface border border-terminal-border p-6">
                <div className="mb-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white mb-1">Security & Healthcare Compliance Analyst IV, Lead</h3>
                    <div className="text-terminal-gray md:text-right md:ml-4 md:flex-shrink-0">01/2022 - 06/2024</div>
                  </div>
                  <div className="text-terminal-green">InComm Payments • Atlanta, GA</div>
                </div>
                <ul className="space-y-2 text-terminal-gray">
                  <li><span className="text-terminal-green">&gt;</span> Served as the primary internal PCI subject matter expert covering four level one PCI DSS ROCs and one PCI Secure Software Standard product</li>
                  <li><span className="text-terminal-green">&gt;</span> Led internal Operational Readiness reviews for hundreds of projects and new products, partnering with product and engineering teams</li>
                  <li><span className="text-terminal-green">&gt;</span> Collaborated with PCI SSC's Special Interest Group (SIG) to help develop industry guidance "PCI DSS Scoping and Segmentation Guidance for Modern Network Architectures"</li>
                  <li><span className="text-terminal-green">&gt;</span> Participated in RFCs as a PCI SSC Participating Organization, helping to develop numerous PCI standards</li>
                  <li><span className="text-terminal-green">&gt;</span> Implemented a GRC tool (Hyperproof and internally developed M365 stack) and created a common control set for the enterprise</li>
                </ul>
              </div>
              <div className="bg-terminal-surface border border-terminal-border p-6">
                <div className="mb-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white mb-1">Senior PCI Security Analyst</h3>
                    <div className="text-terminal-gray md:text-right md:ml-4 md:flex-shrink-0">06/2021 - 12/2021</div>
                  </div>
                  <div className="text-terminal-green">Information & Infrastructure Technologies, Inc. • Herndon, VA</div>
                </div>
                <ul className="space-y-2 text-terminal-gray">
                  <li><span className="text-terminal-green">&gt;</span> Worked with numerous high-profile clients to improve security readiness and compliance with PCI DSS</li>
                  <li><span className="text-terminal-green">&gt;</span> Reviewed technical controls, system configurations, policies, and procedures to assess compliance and recommend improvements</li>
                  <li><span className="text-terminal-green">&gt;</span> Worked closely with company executives and clients on the development of a SaaS-based integrated risk management (IRM) platform capable of supporting 800+ compliance standards</li>
                </ul>
              </div>
              <div className="bg-terminal-surface border border-terminal-border p-6">
                <div className="mb-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white mb-1">Information Security Analyst</h3>
                    <div className="text-terminal-gray md:text-right md:ml-4 md:flex-shrink-0">01/2021 - 06/2021</div>
                  </div>
                  <div className="text-terminal-green">Information & Infrastructure Technologies, Inc. • Herndon, VA</div>
                </div>
                <ul className="space-y-2 text-terminal-gray">
                  <li><span className="text-terminal-green">&gt;</span> Worked under the PCI QSA and assisted with PCI assessments</li>
                  <li><span className="text-terminal-green">&gt;</span> Wrote various scripts to assist with the collection of evidence</li>
                </ul>
              </div>
              <div className="bg-terminal-surface border border-terminal-border p-6">
                <div className="mb-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white mb-1">Systems Analyst</h3>
                    <div className="text-terminal-gray md:text-right md:ml-4 md:flex-shrink-0">10/2019 - 01/2021</div>
                  </div>
                  <div className="text-terminal-green">City of Kingsport • Kingsport, TN</div>
                </div>
                <ul className="space-y-2 text-terminal-gray">
                  <li><span className="text-terminal-green">&gt;</span> Administered numerous systems including ERP, ITAM, POS, E-Mail, Document/Records Management, M365, Public Safety, and more</li>
                  <li><span className="text-terminal-green">&gt;</span> Administered a mixed environment of Windows, Linux, and IBM i operating systems</li>
                  <li><span className="text-terminal-green">&gt;</span> Implemented various security technologies such as the Elastic Stack for SIEM and centralized logging capability as well as CrowdStrike for EDR</li>
                  <li><span className="text-terminal-green">&gt;</span> Wrote various scripts and utilities to assist with patch management, automation, and more</li>
                  <li><span className="text-terminal-green">&gt;</span> Assisted with security compliance related activities (PCI DSS and CJIS)</li>
                </ul>
              </div>
              <div className="bg-terminal-surface border border-terminal-border p-6">
                <div className="mb-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white mb-1">IT Helpdesk Analyst</h3>
                    <div className="text-terminal-gray md:text-right md:ml-4 md:flex-shrink-0">03/2019 - 10/2019</div>
                  </div>
                  <div className="text-terminal-green">City of Kingsport • Kingsport, TN</div>
                </div>
                <ul className="space-y-2 text-terminal-gray">
                  <li><span className="text-terminal-green">&gt;</span> Triaged and routed all IT service requests as the sole Help Desk Analyst</li>
                  <li><span className="text-terminal-green">&gt;</span> Provided tier 1 & 2 technical support for over 600 users and 800 devices including mobile phones, laptops, desktops and servers</li>
                  <li><span className="text-terminal-green">&gt;</span> Performed Active Directory administration including the management of users, organizational units, security groups, and group policies</li>
                </ul>
              </div>
              <div className="bg-terminal-surface border border-terminal-border p-6">
                <div className="mb-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white mb-1">Co-Founder</h3>
                    <div className="text-terminal-gray md:text-right md:ml-4 md:flex-shrink-0">05/2018 - 09/2019</div>
                  </div>
                  <div className="text-terminal-green">Cell4More.com • Kingsport, TN</div>
                </div>
                <ul className="space-y-2 text-terminal-gray">
                  <li><span className="text-terminal-green">&gt;</span> Developed web application front-end and back-end for e-waste recycling business</li>
                  <li><span className="text-terminal-green">&gt;</span> Operated e-waste recycling business, refurbishing and reselling used electronics including cell phones, laptops, desktops, and more</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="py-20 bg-terminal-surface">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-12">
              <div className="text-terminal-gray mb-2">josh@joshdoes.it:~$ ls skills/</div>
              <h2 className="text-3xl font-bold text-white mb-6">Technical Skills</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-terminal-bg border border-terminal-border p-6">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-terminal-green mr-3" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8l0 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-white">Frameworks & Standards</h3>
                </div>
                <ul className="space-y-2 text-terminal-gray">
                  <li>• PCI DSS, Secure Software Standard, Secure Software Lifecycle, Key Management Operations, Point-to-Point Encryption, PIN</li>
                  <li>• SOC 1, SOC 2, SOC 3</li>
                  <li>• HITRUST CSF</li>
                  <li>• ISO 42001</li>
                  <li>• CJIS</li>
                  <li>• More...</li>
                </ul>
              </div>
              <div className="bg-terminal-bg border border-terminal-border p-6">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-terminal-green mr-3" fill="currentColor" viewBox="0 0 640 512">
                    <path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-white">Tools & Technologies</h3>
                </div>
                <ul className="space-y-2 text-terminal-gray">
                  <li>• Wiz, ImPAC, Qualys, Snyk</li>
                  <li>• ServiceNow, Jira</li>
                  <li>• Copilot Studio</li>
                  <li>• Power Automate, Python, Bash, PowerShell</li>
                  <li>• Elastic Stack, Exabeam, CrowdStrike</li>
                  <li>• Hyperproof</li>
                </ul>
              </div>
              <div className="bg-terminal-bg border border-terminal-border p-6">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-terminal-green mr-3" fill="currentColor" viewBox="0 0 640 512">
                    <path d="M0 336c0 79.5 64.5 144 144 144H512c70.7 0 128-57.3 128-128c0-61.9-44-113.6-102.4-125.4c4.1-10.7 6.4-22.4 6.4-34.6c0-53-43-96-96-96c-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32C167.6 32 96 103.6 96 192c0 2.7 .1 5.4 .2 8.1C40.2 219.8 0 273.2 0 336z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-white">Cloud Platforms</h3>
                </div>
                <ul className="space-y-2 text-terminal-gray">
                  <li>• AWS</li>
                  <li>• Azure</li>
                  <li>• OCI</li>
                  <li>• Microsoft 365 Security</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="py-20 bg-terminal-bg">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-12">
              <div className="text-terminal-gray mb-2">josh@joshdoes.it:~$ ls projects/</div>
              <h2 className="text-3xl font-bold text-white mb-6">Key Projects</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-terminal-surface border border-terminal-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Compliance Engineering Automation</h3>
                  <svg className="w-6 h-6 text-terminal-green" fill="currentColor" viewBox="0 0 640 512">
                    <path d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z" />
                  </svg>
                </div>
                <p className="text-terminal-gray mb-4">
                  Built enterprise Compliance Engineering function automating continuous monitoring across Azure, M365, 
                  AWS, OCI, and on-premises environments. Reduced audit prep time by 60% through automated audit evidence collection.
                </p>
                <div className="flex space-x-2">
                  <span className="bg-terminal-bg px-2 py-1 text-xs border border-terminal-border">Python</span>
                  <span className="bg-terminal-bg px-2 py-1 text-xs border border-terminal-border">Power Automate</span>
                  <span className="bg-terminal-bg px-2 py-1 text-xs border border-terminal-border">Wiz</span>
                  <span className="bg-terminal-bg px-2 py-1 text-xs border border-terminal-border">ServiceNow</span>
                </div>
              </div>
              <div className="bg-terminal-surface border border-terminal-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">AI-Powered Questionnaire Automation</h3>
                  <svg className="w-6 h-6 text-terminal-green" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
                  </svg>
                </div>
                <p className="text-terminal-gray mb-4">
                  Used Copilot Studio to build a custom AI agent that matches questions from customer questionnaires 
                  to answers from a curated list of standard Q&A responses, cutting review time by more than 80%.
                </p>
                <div className="flex space-x-2">
                  <span className="bg-terminal-bg px-2 py-1 text-xs border border-terminal-border">Copilot Studio</span>
                  <span className="bg-terminal-bg px-2 py-1 text-xs border border-terminal-border">AI/ML</span>
                  <span className="bg-terminal-bg px-2 py-1 text-xs border border-terminal-border">M365</span>
                </div>
              </div>
              <div className="bg-terminal-surface border border-terminal-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Enterprise GRC Platform</h3>
                  <svg className="w-6 h-6 text-terminal-green" fill="currentColor" viewBox="0 0 576 512">
                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                  </svg>
                </div>
                <p className="text-terminal-gray mb-4">
                  Implemented a GRC tool (Hyperproof and internally developed M365 stack) and created a common control 
                  set for the enterprise.
                </p>
                <div className="flex space-x-2">
                  <span className="bg-terminal-bg px-2 py-1 text-xs border border-terminal-border">Hyperproof</span>
                  <span className="bg-terminal-bg px-2 py-1 text-xs border border-terminal-border">M365</span>
                  <span className="bg-terminal-bg px-2 py-1 text-xs border border-terminal-border">GRC</span>
                </div>
              </div>
              <div className="bg-terminal-surface border border-terminal-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">PCI DSS Industry Standards and Guidance</h3>
                  <svg className="w-6 h-6 text-terminal-green" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M80 104a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm80-24c0 32.8-19.7 61-48 73.3v87.8c18.8-10.9 40.7-17.1 64-17.1h96c35.3 0 64-28.7 64-64v-6.7C307.7 141 288 112.8 288 80c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3V160c0 70.7-57.3 128-128 128H176c-35.3 0-64 28.7-64 64v6.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3V352 153.3C19.7 141 0 112.8 0 80C0 35.8 35.8 0 80 0s80 35.8 80 80zm232 0a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zM80 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
                  </svg>
                </div>
                <p className="text-terminal-gray mb-4">
                  Participated in numerous PCI SSC standard RFCs and collaborated with PCI SSC's Special Interest Group (SIG) to help develop and produce the industry 
                  guidance "PCI DSS Scoping and Segmentation Guidance for Modern Network Architectures".
                </p>
                <div className="flex space-x-2">
                  <span className="bg-terminal-bg px-2 py-1 text-xs border border-terminal-border">PCI SSC</span>
                  <span className="bg-terminal-bg px-2 py-1 text-xs border border-terminal-border">Industry Standards</span>
                  <span className="bg-terminal-bg px-2 py-1 text-xs border border-terminal-border">Technical Writing</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-terminal-surface">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <div className="mb-12">
              <div className="text-terminal-gray mb-2">josh@joshdoes.it:~$ ./contact.sh</div>
              <h2 className="text-3xl font-bold text-white mb-6">Get In Touch</h2>
            </div>
            <div className="bg-terminal-bg border border-terminal-border p-8 max-w-2xl mx-auto">
              <p className="text-terminal-gray mb-8">
                Ready to discuss security compliance challenges or explore collaboration opportunities? 
                Drop me a message and let's secure the digital world together.
              </p>
              <div className="space-y-4">
                <a href="mailto:contact@joshdoes.it" className="block bg-terminal-surface border border-terminal-green px-6 py-3 hover:bg-terminal-green hover:text-black transition-all">
                  <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                  </svg>
                  contact@joshdoes.it
                </a>
                <div className="flex justify-center space-x-4">
                  <a href="https://www.linkedin.com/in/joshua-jones-security/" target="_blank" rel="noopener noreferrer" className="text-terminal-gray hover:text-terminal-green transition-colors">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 448 512">
                      <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                    </svg>
                  </a>
                  <a href="https://github.com/JoshDoesIT" target="_blank" rel="noopener noreferrer" className="text-terminal-gray hover:text-terminal-green transition-colors">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 496 512">
                      <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

