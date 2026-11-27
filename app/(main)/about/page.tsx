export const metadata = {
  title: "About — Neil Justin Mallari",
};

export default function AboutPage() {
  return (
    <section className="pt-16">
      <h1 className="text-2xl sm:text-3xl font-display">About</h1>

      <div className="mt-10 space-y-6 text-sm text-[#c8d6e5] font-light leading-relaxed">
        {/* TODO(interview): replace draft bio with Neil's reviewed words */}
        <p>
          I&apos;m Neil Justin Mallari, a computer science student documenting
          the whole trip — from a first &quot;hello world&quot; in 1st year to
          on-the-job training and the final stretch before graduation.
        </p>
        <p>
          Along the way the classroom started to blend into real engineering
          work: I&apos;ve spent time as a software engineer at Career Team LLC
          and as interim lead software engineer at Thorne Consulting, working
          with real teams, real users, and real deadlines.
        </p>
        <p>
          This blog is my SE101 final project, but it&apos;s also the record I
          wish I had when I started: what each year actually felt like, what
          the subjects were really for, and what working in software teaches
          you that school alone can&apos;t.
        </p>
      </div>
    </section>
  );
}
