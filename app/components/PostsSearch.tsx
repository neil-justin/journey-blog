"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface PostSearchItem {
  slug: string;
  title: string;
  excerpt: string;
  phaseLabel: string;
  /** Plain-text version of the post content (markdown stripped). */
  plainText: string;
}

function Highlighted({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const parts: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < text.length) {
    const idx = lowerText.indexOf(lowerQuery, i);
    if (idx === -1) {
      parts.push(text.slice(i));
      break;
    }
    if (idx > i) parts.push(text.slice(i, idx));
    parts.push(
      <mark key={key++} className="bg-[#ffc857]/20 text-[#ffc857]">
        {text.slice(idx, idx + query.length)}
      </mark>,
    );
    i = idx + query.length;
  }

  return <>{parts}</>;
}

export default function PostsSearch({ items }: { items: PostSearchItem[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.phaseLabel.toLowerCase().includes(q) ||
        item.plainText.toLowerCase().includes(q),
    );
  }, [items, query]);

  return (
    <>
      <div className="mt-12">
        <label
          htmlFor="posts-search"
          className="text-[10px] font-mono tracking-[0.4em] text-[#4a79bb]"
        >
          SEARCH THE JOURNEY
        </label>
        <input
          id="posts-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search titles, excerpts, and full text…"
          className="mt-3 w-full border border-[#223247] bg-[#07070a]/80 px-4 py-3 text-sm text-[#e6f1ff] font-light placeholder:text-[#8fa8c0] outline-none transition-colors focus:border-[#ffc857]/60"
        />
      </div>

      <p className="mt-6 text-[10px] font-mono tracking-[0.4em] text-[#8fa8c0]">
        {results.length} / {items.length} POSTS
      </p>

      {items.length === 0 ? (
        <div className="mt-6 border border-[#223247] bg-[#07070a]/80 p-6 text-sm text-[#8fa8c0] font-light">
          Nothing published yet. Posts land here as they are written.
        </div>
      ) : results.length === 0 ? (
        <div className="mt-6 border border-[#223247] bg-[#07070a]/80 p-6 text-sm text-[#8fa8c0] font-light">
          No posts match &ldquo;{query.trim()}&rdquo;.
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {results.map((item) => (
            <Link
              key={item.slug}
              href={`/posts/${item.slug}`}
              className="reveal block border border-[#223247] bg-[#07070a]/80 p-6 transition-colors hover:border-[#ffc857]/60"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <img
                  src={`/posts/${item.slug}.jpg`}
                  alt=""
                  aria-hidden
                  className="block w-full shrink-0 border border-[#223247] object-cover object-right sm:w-52"
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-mono tracking-[0.4em] text-[#4a79bb]">
                    {item.phaseLabel}
                  </p>
                  <h2 className="mt-4 text-lg sm:text-xl font-display">
                    <Highlighted text={item.title} query={query.trim()} />
                  </h2>
                  <p className="mt-3 text-sm text-[#c8d6e5] font-light leading-relaxed">
                    <Highlighted text={item.excerpt} query={query.trim()} />
                  </p>
                  <p className="mt-4 text-[11px] font-mono tracking-[0.25em] text-[#4a79bb]">
                    READ →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
