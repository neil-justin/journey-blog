export const metadata = {
  title: "About — Neil Justin Mallari",
};

const EXPERIENCE = [
  {
    company: "Thorne Consulting (US, Remote) — Contract",
    role: "Lead Software Engineer (Interim)",
    period: "Mar 2026 — Sept 2026",
    lines: [
      "Second engineer on the founding team of a career-readiness startup; grew into the interim lead role.",
      "Planned features end-to-end — specifying database schemas, API contracts, and frontend component breakdowns that mentored engineers built against — then reviewed the code they shipped.",
      "Managed deployments and releases, and acted as the bridge between engineering and non-technical staff for day-to-day support.",
      "Conducted ~55 technical interviews covering system design and culture fit, directly mentored 2 interns, and onboarded new engineers on the codebase's architecture and engineering process.",
    ],
  },
  {
    company: "Career Team LLC (US, Remote)",
    role: "Software Engineer",
    period: "May 2025 — Jun 2026",
    lines: [
      "Built features on a multi-tenant workforce platform serving thousands of users across government agencies and school organizations, using NestJS, Next.js, and MongoDB.",
      "Built the multi-tenant admin dashboard and improved its load performance by fixing slow MongoDB queries.",
      "Shipped admin profile management and configurable workforce forms used by client organizations.",
      "Facilitated daily standups for a 15-person cross-functional team, acting as the bridge between developers and product to keep sprint goals on track.",
      "Conducted technical interviews for engineering candidates and buddied 2 new engineers through onboarding and codebase walkthroughs.",
    ],
  },
];

export default function AboutPage() {
  return (
    <section className="pt-16">
      <h1 className="text-2xl sm:text-3xl font-display">About</h1>

      <div className="mt-10 space-y-6 text-sm text-[#c8d6e5] font-light leading-relaxed">
        {/* TODO(interview): replace draft bio with Neil's reviewed words */}
        <p>
          I&apos;m Neil Justin Mallari, a computer science student based in
          Cavite, Philippines, documenting the whole trip — from a first
          &quot;hello world&quot; in 1st year to on-the-job training and the
          final stretch before graduation.
        </p>
        <p>
          Along the way the classroom started to blend into real engineering
          work — the experience below is where the OJT chapters of this blog
          come from.
        </p>
      </div>

      <h2 className="mt-14 text-xl sm:text-2xl font-display">
        Professional Experience
      </h2>

      <div className="mt-8 space-y-8">
        {EXPERIENCE.map((job) => (
          <div
            key={job.company}
            className="border border-[#223247] bg-[#07070a]/80 p-6 sm:p-8"
          >
            <h3 className="text-base sm:text-lg font-semibold text-[#e6f1ff]">
              {job.company}
            </h3>
            <p className="mt-1 text-base text-[#ffc857] font-medium">
              {job.role}
            </p>
            <p className="mt-0.5 text-xs text-[#8fa8c0]">{job.period}</p>
            <ul className="mt-5 space-y-3">
              {job.lines.map((line) => (
                <li
                  key={line}
                  className="flex items-baseline gap-3 text-[13px] text-[#8fa8c0] leading-relaxed"
                >
                  <span className="text-[#ffc857]">◦</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
