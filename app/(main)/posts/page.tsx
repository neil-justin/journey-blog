import Link from "next/link";
import { getAllPosts, PHASE_LABELS, type Post } from "../../../lib/posts";

export const metadata = {
  title: "Posts — Neil Justin Mallari",
};

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="block border border-[#223247] bg-[#07070a]/80 p-6 transition-colors hover:border-[#ffc857]/60"
    >
      <p className="text-[10px] font-mono tracking-[0.4em] text-[#4a79bb]">
        {post.date} — {PHASE_LABELS[post.phase]}
      </p>
      <h2 className="mt-4 text-xl sm:text-2xl font-display">{post.title}</h2>
      <p className="mt-3 text-base text-[#c8d6e5] font-light leading-relaxed">
        {post.excerpt}
      </p>
      <p className="mt-4 text-[11px] font-mono tracking-[0.25em] text-[#4a79bb]">
        READ →
      </p>
    </Link>
  );
}

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <section className="pt-16">
      <h1 className="text-3xl sm:text-4xl font-display">Posts</h1>
      <p className="mt-4 text-base text-[#c8d6e5] font-light">
        The whole journey, in order — 1st year through OJT, ending with a final
        reflection.
      </p>

      {posts.length === 0 ? (
        <div className="mt-12 border border-[#223247] bg-[#07070a]/80 p-6 text-sm text-[#8fa8c0] font-light">
          Nothing published yet. Posts land here as they are written.
        </div>
      ) : (
        <div className="mt-12 space-y-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
