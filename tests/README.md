# Test Suite Documentation

This directory contains the complete test suite for the JoshDoes.IT portfolio website,
organized into **unit tests** (Vitest) and **end-to-end tests** (Playwright).

## 📁 Directory Structure

```
tests/
├── README.md              # This file
├── unit/                  # Vitest unit/integration tests
│   ├── setup.ts           # Global test configuration
│   ├── vitest.d.ts        # TypeScript declarations for jest-dom
│   ├── blog/
│   │   ├── markdown.test.ts   # Markdown formatter tests (XSS protection)
│   │   ├── posts.test.ts      # Blog posts module tests (fs mocking)
│   │   └── utils.test.ts      # Blog utility function tests
│   └── components/
│       ├── BlogList.test.tsx      # BlogList component tests
│       ├── Footer.test.tsx        # Footer component tests
│       ├── Header.test.tsx        # Header/navigation component tests
│       ├── LocalTime.test.tsx     # LocalTime component tests
│       └── TypingAnimation.test.tsx  # TypingAnimation component tests
└── e2e/                   # Playwright E2E tests
    ├── accessibility.spec.ts  # WCAG accessibility tests
    ├── blog-content.spec.ts   # Blog post content tests
    ├── blog.spec.ts           # Blog listing page tests
    ├── contact.spec.ts        # Contact section tests
    ├── disqus.spec.ts         # Disqus comments tests
    ├── homepage.spec.ts       # Homepage functionality tests
    ├── mobile-menu.spec.ts    # Mobile navigation tests
    ├── navigation.spec.ts     # Site navigation tests
    ├── pagination.spec.ts     # Blog pagination tests
    ├── performance.spec.ts    # Core Web Vitals tests
    ├── resume.spec.ts         # Resume link tests
    ├── search.spec.ts         # Blog search tests
    ├── security.spec.ts       # Security headers tests
    ├── seo.spec.ts            # SEO meta tags tests
    ├── social-meta.spec.ts    # OpenGraph/Twitter card tests
    ├── static-pages.spec.ts   # Static page rendering tests
    └── theme.spec.ts          # Terminal theme styling tests
```

---

## 🧪 Test Types

### Unit Tests (`tests/unit/`)

Unit tests verify individual components and modules in isolation. They run in jsdom and use mocked dependencies.

| Test File | Component/Module | Coverage |
|-----------|------------------|----------|
| `setup.ts` | Global config | Jest-dom matchers, timer mocks, browser API mocks |
| `components/LocalTime.test.tsx` | `LocalTime` | Hydration, time formatting, terminal styling |
| `components/TypingAnimation.test.tsx` | `TypingAnimation` | Typewriter effect, erasing animation, pause handling |
| `components/Header.test.tsx` | `Header` | Navigation links, mobile menu toggle, styling |
| `components/Footer.test.tsx` | `Footer` | Links, copyright text, terminal styling |
| `components/BlogList.test.tsx` | `BlogList` | Search, filtering, pagination, accessibility |
| `components/DisqusComments.test.tsx` | `DisqusComments` | Container rendering, environment config, props |
| `blog/posts.test.ts` | `posts.ts` | Frontmatter parsing, file filtering, input validation |
| `blog/utils.test.ts` | `utils.ts` | Date formatting, read time, icon mapping, post navigation |
| `blog/markdown.test.ts` | `markdown.ts` | XSS protection, headers, code blocks, links, images |

### End-to-End Tests (`tests/e2e/`)

E2E tests verify the full application in a real browser. They cover user flows and integration between components.

| Test File | Coverage |
|-----------|----------|
| `homepage.spec.ts` | Page load, sections visibility, terminal theme |
| `navigation.spec.ts` | Link navigation, anchor scrolling |
| `mobile-menu.spec.ts` | Hamburger menu, responsive behavior |
| `blog.spec.ts` | Blog listing, post links |
| `search.spec.ts` | Blog search functionality |
| `pagination.spec.ts` | Blog pagination controls |
| `accessibility.spec.ts` | WCAG compliance, keyboard navigation |
| `seo.spec.ts` | Meta tags, title, description |
| `performance.spec.ts` | Core Web Vitals, load times |
| `security.spec.ts` | Security headers |

---

## 🚀 Running Tests

### Unit Tests (Vitest)

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test -- tests/unit/components/Header.test.tsx
```

### End-to-End Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/homepage.spec.ts

# Run in debug mode
npx playwright test --debug
```

---

## 📝 Writing Tests

### Unit Test Guidelines

1. **Use descriptive test names** that explain the behavior being tested
2. **Group related tests** with `describe` blocks using section comments
3. **Mock external dependencies** (fs, next/link, etc.)
4. **Use fake timers** for time-dependent components
5. **Follow AAA pattern**: Arrange, Act, Assert

#### Example Structure

```typescript
/**
 * @fileoverview Unit Tests for ComponentName
 * @component ComponentName
 * @location app/components/ComponentName.tsx
 * @description Test coverage includes: ...
 */

describe('ComponentName', () => {
    // =========================================================================
    // CATEGORY NAME
    // =========================================================================

    it('should do something specific', () => {
        // Arrange
        render(<ComponentName />)

        // Act
        fireEvent.click(button)

        // Assert
        expect(result).toBeInTheDocument()
    })
})
```

### E2E Test Guidelines

1. **Test user flows** rather than implementation details
2. **Use robust selectors** (role, label, test-id)
3. **Wait for network idle** before assertions
4. **Group by feature area** in separate files

---

## 🔧 Test Configuration

### Vitest Configuration

Located at `vitest.config.ts` in the project root.

```typescript
test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/unit/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
}
```

### Playwright Configuration

Located at `playwright.config.ts` in the project root.

```typescript
testDir: './tests/e2e',
webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
}
```

### Unit Test Setup (`tests/unit/setup.ts`)

The setup file configures:

- **Jest-dom matchers**: `toBeInTheDocument()`, `toHaveClass()`, etc.
- **Timer function preservation**: Ensures timers work with fake timers
- **Test cleanup**: Unmounts components and restores mocks
- **Browser API mocks**:
  - `window.matchMedia` - For responsive components
  - `IntersectionObserver` - For lazy loading
  - `ResizeObserver` - For size-responsive components

### TypeScript Support (`tests/unit/vitest.d.ts`)

Provides type declarations for jest-dom matchers.

---

## 🎯 Coverage Strategy

This project uses a **dual-testing approach**:

| Test Type | What It Tests |
|-----------|---------------|
| **Unit Tests** (Vitest) | Utilities (`utils.ts`, `markdown.ts`, `posts.ts`) and components (`Header`, `Footer`, `LocalTime`, `TypingAnimation`, `BlogList`, `DisqusComments`) |
| **E2E Tests** (Playwright) | Full user flows, page layouts, routing, accessibility, SEO, performance |

**Coverage Philosophy:**

Page components (`page.tsx`, `layout.tsx`) are intentionally tested via E2E rather than unit tests. Unit testing Next.js page components often creates brittle tests with excessive mocking that don't reflect real usage patterns.

The `vitest.config.ts` includes coverage thresholds for tested modules to prevent regression. Run `npm run test -- --coverage` to see current coverage metrics.

---

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Jest-DOM Matchers](https://testing-library.com/docs/ecosystem-jest-dom/)
