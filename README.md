# Journey Blog

A CS-student journey blog — from 1st year foundations to OJT — built as the final project for Software Engineering 1.

**Live site:** https://journey-blog.vercel.app *(placeholder — confirm final URL)*

## Features

- **Journey timeline homepage** — posts organized into chronological "chapters" of the CS degree, with an interactive WebGL starfield backdrop (three.js / react-three-fiber)
- **Blog posts** — MDX articles rendered server-side with full markdown support
- **Full-text search** — client-side search across all post content (`PostsSearch.tsx`)
- **About page** — background on the author and the project
- **Contact form** — powered by Formspree (`NEXT_PUBLIC_FORMSPREE_FORM_ID`)
- **Responsive design** — built with Tailwind CSS 4

## Tech Stack

| Layer      | Technology                                        |
| ---------- | ------------------------------------------------- |
| Framework  | Next.js 16 (App Router), React 19, TypeScript     |
| Styling    | Tailwind CSS 4 (via Turbopack)                    |
| Content    | MDX, gray-matter, next-mdx-remote (RSC)           |
| 3D / WebGL | three.js, @react-three/fiber, @react-three/drei   |
| Forms      | Formspree                                         |
| Hosting    | Vercel                                            |

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/neil-justin/journey-blog.git
cd journey-blog

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
# → http://localhost:3000

# 4. Production build
npm run build
npm run start
```

Optional: set `NEXT_PUBLIC_FORMSPREE_FORM_ID` in `.env.local` to enable the contact form.

## Project Structure

```
journey-blog/
├── app/                  # App Router pages, layouts, and components
│   ├── (main)/           # /posts, /posts/[slug], /about, /contact
│   ├── components/       # SiteNav, JourneyPage, PostsSearch, WorldCanvas, ContactForm
│   └── layout.tsx        # Root layout
├── content/
│   └── posts/            # MDX blog posts
├── lib/
│   └── posts.ts          # Post loading, frontmatter parsing, search helpers
├── public/               # Static assets
└── next.config.ts        # MDX + Turbopack configuration
```

## Writing Posts

Add a new `.mdx` file to `content/posts/`. The filename becomes the post's URL slug (e.g. `first-year-foundations.mdx` → `/posts/first-year-foundations`).

Each post uses YAML frontmatter with these fields:

```mdx
---
title: 1st Year — Foundations
phase: 1st-year        # one of: 1st-year | 2nd-year | 3rd-year | 4th-year | ojt | reflection
order: 1               # position in the journey timeline (1 = first)
date: 2026-11-27       # ISO date (YYYY-MM-DD)
excerpt: One-line summary shown on cards and lists.
---

Body content in markdown/MDX...
```

Posts are sorted by `order`, grouped by `phase` on the journey timeline, and automatically included in search.

## Author

Neil Justin — BS Computer Science student. Built for the Software Engineering 1 final project.
