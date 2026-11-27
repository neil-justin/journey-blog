import { getAllPosts, PHASE_LABELS, stripMarkdown } from "../../../lib/posts";
import PostsSearch, {
  type PostSearchItem,
} from "../../components/PostsSearch";

export const metadata = {
  title: "Posts — Neil Justin Mallari",
};

export default async function PostsPage() {
  const posts = await getAllPosts();

  const items: PostSearchItem[] = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    phaseLabel: PHASE_LABELS[post.phase],
    plainText: stripMarkdown(post.content),
  }));

  return (
    <section className="pt-16">
      <h1 className="text-2xl sm:text-3xl font-display">Posts</h1>
      <p className="mt-4 text-sm text-[#c8d6e5] font-light">
        The whole journey, in order — from 1st year through the professional
        era to the final stretch, ending with a final reflection.
      </p>

      <PostsSearch items={items} />
    </section>
  );
}
