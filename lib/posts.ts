import { readFile, readdir } from "fs/promises";
import path from "path";
import matter from "gray-matter";

export type Phase =
  | "1st-year"
  | "2nd-year"
  | "3rd-year"
  | "4th-year"
  | "ojt"
  | "reflection";

export interface PostMeta {
  slug: string;
  title: string;
  phase: Phase;
  /** Ordering within the journey timeline, 1 = first post. */
  order: number;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  excerpt: string;
}

export interface Post extends PostMeta {
  content: string;
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export const PHASE_LABELS: Record<Phase, string> = {
  "1st-year": "1st Year",
  "2nd-year": "2nd Year",
  "3rd-year": "3rd Year",
  "4th-year": "4th Year",
  ojt: "OJT",
  reflection: "Final Reflection",
};

function parsePost(slug: string, raw: string): Post {
  const { data, content } = matter(raw);
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date);
  return {
    slug,
    title: data.title,
    phase: data.phase,
    order: data.order,
    date,
    excerpt: data.excerpt,
    content,
  };
}

export async function getAllPosts(): Promise<Post[]> {
  "use cache";
  const files = (await readdir(POSTS_DIR)).filter((f) => f.endsWith(".mdx"));
  const posts = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = await readFile(path.join(POSTS_DIR, file), "utf8");
      return parsePost(slug, raw);
    }),
  );
  return posts.sort((a, b) => a.order - b.order);
}

export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  try {
    const raw = await readFile(path.join(POSTS_DIR, `${slug}.mdx`), "utf8");
    return parsePost(slug, raw);
  } catch {
    return null;
  }
}
