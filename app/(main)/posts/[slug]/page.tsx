import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPost, PHASE_LABELS } from "../../../../lib/posts";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/posts/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return { title: `${post.title} — Neil Justin Mallari`, description: post.excerpt };
}

export default async function PostPage({ params }: PageProps<"/posts/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="pt-16">
      <p className="text-[10px] font-mono tracking-[0.4em] text-[#4a79bb]">
        {PHASE_LABELS[post.phase]}
      </p>
      <h1 className="mt-4 text-2xl sm:text-3xl font-display leading-snug">
        {post.title}
      </h1>
      <img
        src={`/posts/${post.slug}.jpg`}
        alt=""
        aria-hidden
        className="mt-8 block w-full border border-[#223247] bg-[#07070a]"
      />
      <div className="reveal prose-invert mt-8 border border-[#223247] bg-[#07070a]/80 p-6 sm:p-8 [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:first:mt-0 [&_li]:text-[#c8d6e5] [&_li]:mt-2 [&_p]:text-sm [&_p]:text-[#c8d6e5] [&_p]:leading-relaxed [&_p]:font-light [&_p]:my-5 [&_p]:first:mt-0 [&_p]:last:mb-0 [&_strong]:text-[#ffc857]">
        <MDXRemote source={post.content} />
      </div>
      <div className="mt-16 flex justify-between text-[11px] font-mono tracking-[0.25em] text-[#4a79bb]">
        <Link href="/posts" className="hover:text-[#ffc857]">
          ← ALL POSTS
        </Link>
      </div>
    </article>
  );
}
