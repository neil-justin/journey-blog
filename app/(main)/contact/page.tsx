import ContactLinks from "../../components/ContactLinks";

export const metadata = {
  title: "Contact — Neil Justin Mallari",
};

export default function ContactPage() {
  return (
    <section className="pt-16">
      <h1 className="text-2xl sm:text-3xl font-display">Contact</h1>
      <p className="mt-4 text-sm text-[#c8d6e5] font-light">
        Want to reach out about the journey, the work, or anything in between?
      </p>
      <ContactLinks />
    </section>
  );
}
