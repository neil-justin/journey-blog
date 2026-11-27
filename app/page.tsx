import { getAllPosts } from "../lib/posts";
import JourneyPage, { type JourneyLinks } from "./components/JourneyPage";

/** Which section's card links to which post, by slug. */
const SECTION_POST_SLUGS: Record<string, string> = {
  "first-year": "first-year-foundations",
  "second-year": "second-year-structure",
  "third-year": "third-year-systems",
  "fourth-year": "fourth-year-now",
  reflection: "two-educations",
};

const OJT_POST_SLUGS: { label: string; slug: string }[] = [
  { label: "FIRST JOB", slug: "first-job-career-team" },
  { label: "INTERIM LEAD", slug: "interim-lead-thorne" },
  { label: "SHIPPING LESSONS", slug: "lessons-from-shipping" },
];

export default async function DeepHome() {
  const posts = await getAllPosts();
  const bySlug = new Set(posts.map((p) => p.slug));

  const cardHrefs: JourneyLinks["cardHrefs"] = {};
  for (const [id, slug] of Object.entries(SECTION_POST_SLUGS)) {
    if (bySlug.has(slug)) cardHrefs[id] = `/posts/${slug}`;
  }

  const ojtLinks: JourneyLinks["ojtLinks"] = OJT_POST_SLUGS.flatMap(({ label, slug }) =>
    bySlug.has(slug) ? [{ label, href: `/posts/${slug}` }] : [],
  );

  return <JourneyPage cardHrefs={cardHrefs} ojtLinks={ojtLinks} />;
}
