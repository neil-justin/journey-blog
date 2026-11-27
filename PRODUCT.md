# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js + Tailwind CSS, with MDX for posts. Deployed on Vercel. User chose this in a prior decision round over plain HTML/CSS (better code quality, componentized posts, first-class Vercel fit). Not a website builder, CMS, or ready-made template — assignment forbids those.

## Users

**Primary:** the SE101 professor/grader, arriving to score the blog against a 100-point rubric (content completeness, writing, code quality, design/responsiveness, CS+OJT coverage, hosting). Their job: verify every rubric line quickly and read enough of the writing to grade reflection quality.

**Secondary:** public visitors — recruiters, classmates, other students — landing from the portfolio, GitHub, or class showcase.

## Product Purpose

A personal blog documenting Neil Justin Mallari's journey as a Computer Science student, from 1st year through his professional/OJT era. It is the graded deliverable for SE101's Final Project (due Dec 8, 2026) and three recitations. Success means: every rubric item verifiable at a glance, writing that reads as genuinely reflective, and a site that survives the professor's desktop-and-mobile pass without a single broken link or layout break.

## Positioning

A student-journey blog written by someone who already works as a software engineer (2 years of industry experience at US companies, including an interim lead role). Classmates' blogs describe coursework hypothetically; this one narrates real shipped work and real engineering judgment. Nothing neighboring can truthfully copy that.

## Operating Context

- Graded via three recitations: a 5–8 min code-explanation video (Recitation 1), a features/content walkthrough (Recitation 2), a deployment/responsiveness review (Recitation 3).
- Hosted on Vercel from a public GitHub repo; commit history is itself graded.
- The site is evaluated both on desktop and mobile, live, by the professor.

## Capabilities and Constraints

Required content: 4 Year-Level Posts (one per year level), at least 3 OJT Posts drawn from real professional experience (Career Team, Thorne Consulting), exactly 1 Final Reflection. Required pages: navigation menu, About, Contact (links + client-side validated form). Required features beyond baseline: Journey Timeline (animated chronological homepage centerpiece), full-text post search (client-side index), MDX posts (live embedded components). Site must be responsive and all links must work.

Explicitly undecided product facts: none.

Hard constraint: the formal practicum (PRC 101) was never done and is never claimed, never discussed — OJT posts present real work experience as the professional phase of the journey, first person, factual.

## Brand Commitments

- Blog title: **"Neil Justin Mallari"** — name only, deliberately un-cheesy.
- Real identity throughout: About page links to the existing portfolio (https://portfolio-three-mu-53.vercel.app/), LinkedIn (linkedin.com/in/neil-mallari), GitHub (github.com/neil-justin), and email neiljustin.mallari@proton.me.
- The blog is a separate visual identity from the portfolio — same person, own world.

## Evidence on Hand

- Curriculum checklist (local `cs-curriculum.jpg`, gitignored): full subject list per year level — source for Year-Level Post content.
- Real work history: Career Team LLC (Software Engineer, May 2025–Jun 2026, multi-tenant NestJS/Next.js/MongoDB workforce platform) and Thorne Consulting (Interim Lead Software Engineer, Mar–Sep 2026, career-readiness startup, ~55 interviews, 2 interns mentored) — from the portfolio.
- Public projects: MarkNote (MERN + Docker), Tasky (vanilla JS) — GitHub github.com/neil-justin.
- Assignment brief with rubrics (local PDF, gitignored).
- **Absences future work must not fabricate:** no photos exist yet besides the portfolio profile shot; no grades may ever be shown; no testimonials, awards, or metrics beyond the portfolio's confirmed facts.

## Product Principles

1. **Grader-proof navigation.** Every rubric item — posts in order, About, Contact, responsiveness, live URL — is findable in under a minute without a search engine.
2. **Truth only.** Every claim on the site traces to the curriculum, the portfolio, or Neil's direct statements; nothing invented, nothing personal exposed.
3. **The posts are the product.** Reading experience and reflective writing outrank chrome and decoration.
4. **Responsive is a feature, not a property.** Mobile is a graded, first-class target from the first commit, not a media-query afterthought.
5. **Code quality is on display.** The repo will be read by the professor; structure and clarity are part of the score.
