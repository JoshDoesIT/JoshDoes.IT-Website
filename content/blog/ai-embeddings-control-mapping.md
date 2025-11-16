---
title: 'Building an AI-Powered Control Mapper: From Concept to Production'
date: '2025-11-15'
description: 'How I built an intelligent workflow using AI embeddings to automatically map security controls between compliance frameworks. A deep dive into embeddings, semantic similarity, and the journey from manual to automated mapping.'
tags: ['AI', 'Machine Learning', 'Compliance', 'Automation']
icon: 'fa-file-code'
---

# Building an AI-Powered Control Mapper: From Concept to Production

Mapping security controls between compliance frameworks has always been one of those tedious, time-consuming tasks that security professionals dread. When you're working with frameworks like PCI DSS, SOC 2, NIST CSF, or SCF, manually mapping hundreds of controls can take weeks or even months. But what if we could teach a machine to understand the semantic meaning of controls and automatically find the best matches? That's exactly what I set out to build.

## The Problem: Manual Control Mapping

In my time working in GRC, I've spent countless hours manually mapping controls between frameworks. The process typically goes like this:

1. Open two spreadsheets side-by-side
2. Read through each control description in the source framework
3. Manually search through the target framework for similar controls
4. Make judgment calls on whether controls are "equivalent," "related," or "not applicable"
5. Document your reasoning
6. Repeat hundreds of times

The problem isn't just the time, it's the inconsistency. Two different people might map the same controls differently. And when frameworks update (which they do regularly), you're starting from scratch.

Luckily there is a better way.

## Enter AI Embeddings

The breakthrough came when I discovered **vector embeddings**: a way to convert text into numerical representations that capture semantic meaning. Unlike keyword matching, embeddings understand context and nuance.

### What Are Embeddings?

At their core, embeddings are dense vectors (arrays of numbers) that represent text in a high-dimensional space. Words or phrases with similar meanings are positioned closer together in this space, while different concepts are farther apart.

Think of it like this: if you plotted the words "encryption" and "cryptography" in a 2D space, they'd be very close together. But "encryption" and "pizza" would be far apart. Embeddings do this in hundreds of dimensions, capturing subtle semantic relationships.

### How Embeddings Work

Modern embedding models like Google's **text-embedding-004** (which I used for this project) work by:

1. **Tokenization**: Breaking text into smaller pieces (tokens)
2. **Contextual Encoding**: Using transformer neural networks to understand each token's meaning in context
3. **Vector Generation**: Producing a high-dimensional vector (typically 768 dimensions) that represents the semantic meaning

The magic is that these vectors capture relationships beyond just synonyms. They understand that "access control" and "authentication" are related security concepts, even though they're not the same thing.

### Why Embeddings Matter for Control Mapping

Traditional approaches to control mapping rely on:

- **Exact keyword matching**: "encryption" matches "encryption"
- **Fuzzy string matching**: "encrypt" might match "encryption"
- **Manual keyword lists**: Painstakingly maintained synonym dictionaries

But what about when two controls say the same thing in completely different ways?

**Example:**

**Source Control (PCI DSS):** "Render cardholder data unreadable anywhere it is stored"

**Target Control (NIST CSF):** "Employ cryptographic mechanisms to protect the confidentiality of sensitive information"

These are essentially the same requirement, but a keyword matcher would never find them. An embedding model can understand that both are talking about protecting data through encryption.

## The Journey: Building AI-Control-Mapper

### Phase 1: Proof of Concept

I wanted something that:
- Could be easily shared with others
- Had a visual workflow interface
- Supported file operations natively
- Was self-hostable

Enter **n8n**: a workflow automation platform perfect for prototyping. It had everything I needed, plus built-in support for Google's Gemini API (which includes the text-embedding-004 model).

### Phase 2: Building the Workflow

The final workflow ([available on GitHub](https://github.com/JoshDoesIT/AI-Control-Mapper)) consists of several key components:

#### 1. Configuration Node

A single place to configure everything:
- Framework names
- CSV file paths
- Column mappings (because every CSV format is different)
- Similarity threshold (how similar controls need to be to match)
- Number of top matches to return per control

#### 2. CSV Loading and Parsing

The workflow reads source and target framework CSVs, handling:
- Different column names ("ID" vs "Control ID" vs "SCF #")
- UTF-8 BOM characters
- Flexible column mapping
- Error handling for malformed files

#### 3. Vector Store Building

This is where the magic happens:
- For each target control, generate an embedding using Google Gemini's text-embedding-004 model
- Store all target controls in an in-memory vector database
- This creates a "semantic search index" of the target framework

**Why build a vector store?** Once you have embeddings for the target framework, you can quickly search through them. It's like creating an index in a book. You don't have to read every page to find what you're looking for.

#### 4. Semantic Matching

For each source control:
- Generate an embedding
- Query the vector store for the most similar target controls
- Calculate similarity scores using **cosine similarity**

**Cosine similarity** measures the angle between two vectors. If two vectors point in the same direction (highly similar), the cosine is close to 1.0. If they're perpendicular (unrelated), it's close to 0.0.

Formula: \`cosine_similarity = (A · B) / (||A|| × ||B||)\`

#### 5. Ranking and Filtering

- Rank matches by similarity score (highest first)
- Filter out matches below the threshold (default 0.7)
- Limit to top N matches per source control
- Assign rank numbers (1 = best match, 2 = second best, etc.)

#### 6. Output Generation

Generate a CSV with:
- Source control ID and description
- Matched target control ID and description
- Similarity score (0.0 to 1.0)
- Rank number

![AI Control Mapper Workflow Diagram](/blog_post_images/ai-embeddings-control-mapping/n8n-control-mapping-workflow.png)

*The complete n8n workflow showing how source and target frameworks are processed, embedded, and matched using Google Gemini embeddings.*

### Phase 3: Fine-Tuning

The first version had some issues:

**Problem 1: Too many false positives**
- Solution: Increased the similarity threshold from 0.5 to 0.7

**Problem 2: Missing some good matches**
- Solution: Added the ability to return multiple matches per control

**Problem 3: Inconsistent CSV formats**
- Solution: Made column mapping completely configurable

## Technical Deep Dive

### How Similarity Scores Work

Similarity scores range from 0.0 (completely different) to 1.0 (identical meaning). Here's what different score ranges mean:

- **0.9-1.0**: Nearly identical requirements
- **0.8-0.9**: Very similar, likely equivalent
- **0.7-0.8**: Related controls, probably cover similar concerns
- **0.6-0.7**: Somewhat related, might be worth reviewing
- **< 0.6**: Probably not related

I use a threshold of 0.7 by default, which strikes a balance between precision and recall.

### Performance Considerations

The workflow processes controls individually rather than in batches because:

1. **Accuracy**: Individual processing ensures each source control gets the most accurate matches
2. **Debugging**: If something goes wrong, it's easier to identify which control caused the issue
3. **Memory**: Processing one at a time prevents memory issues with large frameworks

For a typical mapping (300 source controls × 300 target controls):
- Embedding generation: ~1 minute
- Matching: ~1-2 minutes
- Total: ~2-3 minutes

Compare that to days or weeks of manual work.

### Handling Edge Cases

The workflow handles several edge cases:

- **Empty descriptions**: Skips controls with no description text
- **Very short descriptions**: Works fine, but less descriptive controls may have lower similarity scores
- **Special characters**: Handles UTF-8 encoding properly
- **Case sensitivity**: Column matching is case-insensitive
- **Missing columns**: Provides clear error messages

## Real-World Results

I've tested the workflow on several framework pairs:

**PCI DSS v4.0.1 ↔ SCF 2025.3.1**
- Found the majority of controls had matches above 0.7 similarity
- Top matches were consistently accurate (verified manually)
- Cut mapping time significantly (mostly review time)

**PCI DSS v4.0.1 ↔ NIST CSF 2.0**
- Also found the majority of controls had good matches
- Some controls are truly unique to each framework, which is expected

The key insight: The workflow doesn't replace human judgment, it augments it. You still need to review matches, but instead of searching through hundreds of controls, you're reviewing a curated list of the most likely matches.

## Lessons Learned

### 1. Embeddings Are Powerful, But Not Perfect

AI embeddings are incredible, but they're not magic. They work best when:

- Control descriptions are detailed and meaningful
- Both frameworks use similar terminology
- Controls cover similar security domains

They struggle with:

- Very short or vague descriptions
- Domain-specific jargon that doesn't appear in training data
- Controls that require interpretation of context outside the description

### 2. Configuration Is Key

The biggest challenge wasn't the AI, it was making the workflow flexible enough to handle different CSV formats and use cases. Spending time on good configuration options pays off.

### 3. Human-in-the-Loop Is Essential

Automation should augment, not replace, human expertise. The workflow finds likely matches, but someone working in GRC still needs to:

- Review matches for accuracy
- Understand business context
- Make judgment calls on what "equivalent" means for their organization

### 4. Wrapping Up
By posting this project publicly, I've received feedback that improved it significantly. Plus, others can use it, adapt it, and learn from it.

## What's Next?

I'm exploring several enhancements:

1. **Possible web app**: Turn the n8n workflow into a fully fledged web app.
2. **Multi-language support**: Mapping between frameworks in different languages
3. **Explanation generation**: AI-generated explanations of why controls match
4. **Confidence scoring**: More nuanced confidence metrics beyond similarity scores
5. **Framework updates detection**: Alert when frameworks update and re-mapping is needed
6. **Integration with GRC platforms**: Direct integration with tools like ServiceNow, Archer, etc.

## Getting Started

If you want to try it yourself:

1. **Set up n8n**: Use Docker Compose (instructions in the repo)
2. **Get a Google Gemini API key**: Enable the Generative Language API in Google Cloud Console
3. **Prepare your CSVs**: Make sure they have control IDs and descriptions
4. **Import the workflow**: Load the JSON file into n8n
5. **Configure and run**: Set your paths, frameworks, and thresholds

The full workflow, documentation, and examples are available on [GitHub](https://github.com/JoshDoesIT/AI-Control-Mapper).

## Conclusion

Building this project taught me that AI embeddings are a powerful tool for semantic understanding, but they're just the beginning. The real value comes from combining AI capabilities with human expertise and domain knowledge.

Control mapping may (or perhaps should?) never be fully automated, and that's okay. The goal isn't to remove humans from the process; it's to give them better tools so they can focus on high-value judgment calls rather than tedious searching.

If you're working on similar problems, I'd love to hear from you. And if you try the workflow, let me know what works (and what doesn't).

