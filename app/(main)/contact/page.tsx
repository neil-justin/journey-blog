import ContactForm from "../../components/ContactForm";

export const metadata = {
  title: "Contact — Neil Justin Mallari",
};

const DIRECT = [
  {
    href: "mailto:neiljustin.mallari@proton.me",
    label: "neiljustin.mallari@proton.me",
    hint: "EMAIL",
  },
  {
    href: "https://github.com/neil-justin",
    label: "github.com/neil-justin",
    hint: "GITHUB",
  },
  {
    href: "https://www.linkedin.com/in/neil-mallari/",
    label: "linkedin.com/in/neil-mallari",
    hint: "LINKEDIN",
  },
];

export default function ContactPage() {
  return (
    <section className="pt-16">
      <h1 className="text-3xl sm:text-4xl font-display">Contact</h1>
      <p className="mt-4 text-base text-[#c8d6e5] font-light">
        Want to reach out about the journey, the work, or anything in between?
        The form below sends straight to my inbox.
      </p>

      <ContactForm />

      <div className="mt-14">
        <h2 className="text-xs font-mono tracking-[0.4em] text-[#4a79bb]">
          OR FIND ME DIRECTLY
        </h2>
        <ul className="mt-6 space-y-4">
          {DIRECT.map((l) => (
            <li key={l.hint} className="border border-[#223247] bg-[#07070a]/80 p-5">
              <p className="text-[10px] font-mono tracking-[0.4em] text-[#4a79bb]">
                {l.hint}
              </p>
              <a
                href={l.href}
                className="mt-2 block text-sm text-[#e6f1ff] hover:text-[#ffc857]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
