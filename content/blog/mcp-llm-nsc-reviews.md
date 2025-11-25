---
title: 'Talking to Network Security Controls: Using MCP and LLMs for Automated Reviews'
date: '2025-11-24'
description: 'An experiment in using Model Context Protocol (MCP) servers with LLMs to review network security controls. I set out to see if it was possible and was pleasantly surprised by the results.'
tags: ['MCP', 'LLM', 'Network Security', 'Automation', 'AWS']
icon: 'fa-shield-alt'
---

# Talking to Network Security Controls: Using MCP and LLMs for Automated Reviews

Reviewing network security controls like AWS Security Groups and Network ACLs is a critical but time-consuming task. Most organizations use specialized tools like Nipper, FireMon, AlgoSec, etc. to automate these reviews. These tools are powerful, but they typically require you to configure specific queries, filters, and rule sets for each type of check you want to perform. But what if you could just ask an AI to review your network security controls in plain English? What if you could say "show me all the rules that allow SSH from the internet" or "are production and development networks properly segmented?" and get intelligent, accurate answers?

That's exactly what I set out to test. I'll be honest, I was skeptical. But the results surprised me in the best way possible.

## The Problem: NSC Review Tools and Their Limitations

Network Security Controls (NSCs) are the rules and policies that govern network traffic flow. In AWS, this includes Security Groups (stateful, instance-level firewalls) and Network ACLs (stateless, subnet-level firewalls). 

Most security teams use specialized tools for these reviews—tools like Tufin, Nipper, FireMon, AlgoSec, and others. These tools are excellent at what they do: they can parse configurations, identify common security issues, and generate compliance reports. But they have limitations:

1. **Configuration overhead**: You need to set up specific queries, filters, and rule sets for each type of check
2. **Query complexity**: Finding complex issues often requires writing custom queries or configuring advanced filtering logic
3. **Limited context**: Tools identify issues but may not provide the same level of contextual analysis that a security engineer would
4. **Rigid workflows**: You're often constrained by the tool's predefined workflows and report formats
5. **Learning curve**: Each tool has its own interface, query language, and way of doing things

The problem isn't that these tools don't work, because they do. The problem is that they still require you to know what questions to ask and how to ask them in the tool's specific language. What if you could use natural language instead?

## The Experiment: Can LLMs + MCP Do This?

I've been following the development of Model Context Protocol (MCP), a standard that enables LLMs to interact with structured data sources through standardized tools. The idea is simple: instead of just chatting with an LLM, you give it access to tools that can fetch real data, and the LLM can use those tools to answer questions.

I wanted to test if this could work as an alternative or complement to traditional NSC review tools. Could natural language querying provide a different way to interact with NSCs? The hypothesis was:

1. **MCP server** provides tools to query AWS Security Groups and Network ACLs
2. **LLM** uses those tools to fetch configurations
3. **LLM analyzes** the configurations using natural language understanding
4. **LLM provides** security analysis, findings, and recommendations

I built a proof-of-concept MCP server that could:
- List VPCs in an AWS account
- Fetch Security Group and Network ACL configurations
- Query rules by various criteria (source, destination, port, protocol)

Then I connected it to Claude (Anthropic's LLM) and started asking questions.

I'll admit, I went into this expecting it to be a fun experiment that might work for simple queries but would fall apart on complex analysis. I was wrong.

## Pleasantly Surprised: The Results

The first thing that surprised me was how accurately the LLM could identify security issues. Not just simple pattern matching but actual understanding of security implications.

### Example 1: Identifying Critical Vulnerabilities

I asked the LLM to review all Security Groups and Network ACLs in my test environment. Here's what it found:

**Critical Issue #1: Public SSH Access to Database Server**

The LLM identified that a Development Database Security Group had SSH (port 22) open to the entire internet (0.0.0.0/0). But it didn't just flag it, it provided context:
```
Affected Resource: sg-0e3ae3e6560ba3262 (Dev-Database-SG)
VPC: vpc-0627541bf1d62805c (Development)
Environment: Development / Network-B

Security Risk:
- Impact: CRITICAL - Direct database compromise possible
- Exposure: Database tier exposed to Internet-wide SSH brute force attacks
- Attack Surface: Any attacker can attempt authentication against production database infrastructure

Immediate Remediation Steps:
1. IMMEDIATE ACTION - Remove the 0.0.0.0/0 SSH rule
2. Create a dedicated bastion/jump host security group
3. Update Dev-Database-SG to only allow SSH from bastion SG
4. Implement AWS Systems Manager Session Manager as SSH alternative
5. Enable VPC Flow Logs to audit existing SSH connection attempts
6. Rotate all database credentials immediately (assume compromise)
```

This wasn't just a rule check. It understood the severity, the attack surface, and provided actionable remediation steps. That's the kind of analysis I'd expect from an experienced security engineer.

### Example 2: Network Segmentation Analysis

Even more impressive was the network segmentation analysis. I asked the LLM to analyze whether production and development networks were properly isolated. The LLM didn't just check if there were rules allowing communication, it analyzed the interaction between Security Groups and Network ACLs, understood the defense-in-depth model, and identified violations at multiple layers.

Here's what it found:

**Critical Finding: Network Segmentation Violations**

The LLM identified that both Network ACL layers contained rules allowing unrestricted cross-environment communication:
```
Production-NACL Rule 150:
- Protocol: ALL (-1)
- Source/Destination: 10.1.0.0/16 (Development VPC)
- Action: ALLOW
- Direction: Both Ingress and Egress

Development-NACL Rule 150:
- Protocol: ALL (-1)
- Source/Destination: 10.0.0.0/16 (Production VPC)
- Action: ALLOW
- Direction: Both Ingress and Egress

Violation Analysis:
- Rule 150 (both directions) creates complete bypass of network segmentation
- Allows every protocol, every port between production and development
- Higher priority than default deny (evaluated before rule 32767)
```

But it went further. It explained the layered interaction:
```
AWS network security operates on a defense-in-depth model with two primary layers:

External Request
       ↓
[Network ACL - Subnet Level]  ← Stateless, evaluated first
       ↓
[Security Group - Instance Level]  ← Stateful, evaluated second
       ↓
EC2 Instance
```

This level of analysis and understanding how different security layers interact, identifying the specific rules causing violations, and explaining the security implications is exactly what you'd want from a security review.

### Example 3: Overly Permissive CIDR Blocks

The LLM also caught subtler issues. It identified that a Production Application Security Group allowed HTTPS from `10.0.0.0/8`, which includes the entire private IP range. While the intent was probably to allow access from the Production VPC (`10.0.0.0/16`), the `/8` CIDR block also includes the Development VPC (`10.1.0.0/16`), creating an unintended cross-environment access path.

The LLM explained:
```
Security Risk:
- Impact: HIGH to CRITICAL - Permits access from unintended networks
- Exposure: The /8 CIDR block (10.0.0.0/8) encompasses 16,777,216 IP addresses
- Current VPCs: Production (10.0.0.0/16) and Development (10.1.0.0/16) only use 131,072 IPs combined
- Blast Radius: Opens application tier to potential future networks or misconfigurations
```

Again, it didn't just flag the issue, it understood the broader implications and provided specific remediation guidance.

## How It Works: MCP Server Architecture

![NSC Reviews with MCP and LLMs Architecture](/blog_post_images/mcp-llm-nsc-reviews/NSC-Reviews-with-MCP-and-LLMs.png)

*Architecture diagram showing how MCP servers enable LLMs to query and analyze Network Security Controls using natural language.*

The MCP server I built provides three main tools for querying network security controls:

### 1. `list_vpcs`

Lists all VPCs in the AWS account with filtering by tags. This helps scope the review to specific environments.

### 2. `get_config`

Loads Network Security Control configurations directly from AWS. It can fetch:
- Security Groups (with all ingress and egress rules)
- Network ACLs (with all ingress and egress rules)
- Associated metadata (VPC IDs, descriptions, tags)

### 3. `query_rules`

Queries NSC rules by various criteria:
- Source IP/CIDR
- Destination IP/CIDR
- Port numbers
- Protocol (TCP, UDP, ICMP, etc.)
- Direction (ingress/egress)
- Or get all rules with no parameters

The MCP server is read-only. It only fetches configurations, never modifies them.

### Natural Language Querying

Once the MCP server is connected to an LLM, you can ask questions in plain English:

- "Show me all Security Groups that allow SSH from the internet"
- "Are production and development networks properly segmented?"
- "Find all rules that allow traffic from 0.0.0.0/0"
- "What are the security risks in the Development VPC?"
- "Compare the security posture of Production vs Development"

The LLM uses the MCP tools to fetch the relevant configurations, analyzes them, and provides detailed security assessments.

### Extensibility

While this implementation uses AWS Security Groups and Network ACLs as examples, the architecture is designed to be extensible. You could add parsers for:

- **Azure Network Security Groups (NSGs)**
- **Google Cloud Platform Firewall Rules**
- **Oracle Cloud Infrastructure Security Lists**
- **Traditional on-premises firewalls** (Palo Alto, Check Point, Fortinet, Cisco)

The pattern is the same: create a parser for the NSC type, add MCP tools to query it, and the LLM can analyze it using natural language.

## Technical Deep Dive

### MCP Server Implementation

The MCP server is built in Python and uses the MCP SDK. It implements the MCP protocol, which provides a standardized way for LLMs to discover and call tools.

**Key Components:**

1. **AWS Integration**: Uses boto3 to interact with AWS EC2 APIs
2. **Parser Layer**: Converts AWS API responses into structured data
3. **Tool Definitions**: Exposes MCP tools that LLMs can call
4. **Error Handling**: Gracefully handles AWS API errors and provides helpful messages

### How Queries Are Processed

When you ask the LLM a question:

1. **LLM analyzes the query** and determines which MCP tools to use
2. **LLM calls the tools** (e.g., `get_config` to fetch Security Groups)
3. **MCP server fetches data** from AWS and returns structured JSON
4. **LLM receives the data** and analyzes it in context
5. **LLM provides analysis** with findings, risk assessments, and recommendations

![Query Processing Flow](/blog_post_images/mcp-llm-nsc-reviews/og-image.png)

*Flow diagram showing how a natural language query is processed through the LLM and MCP server to produce security analysis.*

### Terraform Test Environment

To test this properly, I created a Terraform configuration that provisions:

- **Two VPCs**: Production (10.0.0.0/16) and Development (10.1.0.0/16)
- **Security Groups**: Web, Application, and Database tiers for each VPC
- **Network ACLs**: Subnet-level rules for each VPC
- **Intentionally problematic configurations**: Rules designed to test the LLM's ability to identify security issues

This test environment includes real security issues (like the ones the LLM found) so I could validate that the analysis was accurate.

## Lessons Learned

### 1. LLMs Are Surprisingly Good at Security Analysis

I went into this expecting the LLM to be good at fetching data but needing significant prompting to provide useful security analysis. I was wrong. The LLM did the following well:

- Identified security issues accurately
- Provided appropriate severity ratings
- Explained the security implications clearly
- Suggested actionable remediation steps
- Referenced relevant compliance frameworks (although sometimes the requirement reference #s were not 100% accurate, the general intent was right)

This isn't to say it's perfect. You still need human review, but it's far better than I expected.

### 2. Natural Language Is a Game Changer

The ability to ask questions in plain English instead of writing specific queries or configuring tool filters is powerful. Traditional tools like Tufin or FireMon require you to:

- Learn their query syntax
- Configure specific filters for each check
- Set up rule sets and policies
- Navigate their UI to find the right reports

With the LLM+MCP approach, you can just ask:

> "Show me all the rules that allow SSH from the internet and explain why each one is a security risk"

The LLM handles the query construction, data fetching, analysis, and explanation.

### 3. MCP Makes Structured Data Accessible

MCP provides a clean abstraction layer. The LLM doesn't need to know AWS API specifics, it just calls MCP tools. This makes it easy to extend to other data sources. Want to analyze Azure NSGs? Add an Azure parser and MCP tools then the LLM can use them the same way.

### 4. Context Matters

The LLM's ability to understand context is crucial. It knows that:
- SSH from 0.0.0.0/0 on a database server is critical
- SSH from 0.0.0.0/0 on a bastion host *might* be acceptable (depending on architecture)
- Cross-environment communication violates segmentation principles

This contextual understanding is what makes the analysis valuable, not just the data fetching.

### 5. Human-in-the-Loop Is Still Essential

While the LLM's analysis was impressive, it's not a replacement for human expertise. You still need to:

- Review findings for accuracy
- Understand business context
- Make judgment calls on remediation priorities
- Validate that recommendations are appropriate for your environment

But instead of spending hours searching through configurations, you're reviewing curated, analyzed findings.

## Getting Started

If you want to try this yourself, the complete lab is available on GitHub:

**[Network-Security-Control-Reviews-with-MCP-and-LLMs](https://github.com/JoshDoesIT/Network-Security-Control-Reviews-with-MCP-and-LLMs)**

The repository includes:

- **MCP server implementation** with AWS Security Groups and Network ACLs support
- **Terraform configuration** for the test environment
- **Setup guides** for AWS infrastructure and MCP server configuration
- **LLM usage examples** showing various types of queries and analyses
- **Documentation** on extending to other NSC types

The lab is designed to be educational. You can experiment with different queries, test the LLM's analysis, and see how MCP enables LLMs to interact with structured data.

## Conclusion

The combination of MCP and LLMs creates a powerful tool for security reviews, offering something different compared to the normal NSC review tools: the ability to explore configurations conversationally, ask ad-hoc questions, and get contextual analysis in natural language. The real value isn't just automation, it's the ability to ask questions in natural language and get intelligent, contextual answers. Instead of configuring specific queries or filters for each type of check, you can just ask "what are the security risks?" and get a comprehensive analysis.

If you're working on network security reviews, compliance assessments, or just curious about how MCP and LLMs can work together, I encourage you to check out the lab. And if you try it, let me know what you think. I'd love to hear about your experiences.