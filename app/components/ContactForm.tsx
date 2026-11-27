"use client";

import { useState } from "react";

const MY_EMAIL = "neiljustin.mallari@proton.me";

type Fields = { from: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (!fields.from.trim()) errors.from = "Your email is the return address — I need it.";
  else if (!EMAIL_RE.test(fields.from.trim()))
    errors.from = "That doesn't look like a valid email address.";
  if (!fields.subject.trim()) errors.subject = "Every email needs a subject.";
  if (!fields.message.trim()) errors.message = "The body is empty.";
  else if (fields.message.trim().length < 10)
    errors.message = "A few more words — at least 10 characters.";
  return errors;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-mono tracking-[0.4em] text-[#4a79bb]">
        {label}
      </span>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-xs text-[#ff6b4a]">
          {error}
        </span>
      )}
    </label>
  );
}

const inputClass = (invalid: boolean) =>
  `mt-2 w-full border bg-[#10161f]/95 px-4 py-3 text-base text-[#e6f1ff] placeholder-[#4a5a70] outline-none transition-colors focus:border-[#ffc857] backdrop-blur-sm ${
    invalid ? "border-[#ff6b4a]" : "border-[#223247]"
  }`;

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>({
    from: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle",
  );

  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;

  function set<K extends keyof Fields>(key: K, value: string) {
    const next = { ...fields, [key]: value };
    setFields(next);
    // clear a field's error as soon as the user fixes it
    if (errors[key]) setErrors(validate(next));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");
    try {
      if (formspreeId) {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: fields.from,
            subject: fields.subject,
            message: fields.message,
          }),
        });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        // no form backend configured yet — open the visitor's mail client
        const subject = encodeURIComponent(fields.subject);
        const body = encodeURIComponent(
          `${fields.message}\n\n— sent from journey-blog by ${fields.from}`,
        );
        window.location.href = `mailto:${MY_EMAIL}?subject=${subject}&body=${body}`;
      }
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-10 border border-[#ffc857]/60 bg-[#07070a]/80 p-8">
        <p className="text-[11px] font-mono tracking-[0.4em] text-[#ffc857]">
          ● MESSAGE ACROSS THE HORIZON
        </p>
        <p className="mt-4 text-base text-[#c8d6e5] font-light">
          Sent. I&apos;ll get back to you at the email you left.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-10 space-y-6">
      {/* the structure of an email: From / To / Subject / body */}
      <Field label="FROM — YOUR EMAIL" error={errors.from}>
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass(!!errors.from)}
          onChange={(e) => set("from", e.target.value)}
        />
      </Field>
      <Field label="TO">
        <input
          type="email"
          value={MY_EMAIL}
          readOnly
          aria-readonly
          className={`${inputClass(false)} cursor-default text-[#8fa8c0]`}
        />
      </Field>
      <Field label="SUBJECT" error={errors.subject}>
        <input
          type="text"
          name="subject"
          placeholder="What is this about?"
          className={inputClass(!!errors.subject)}
          onChange={(e) => set("subject", e.target.value)}
        />
      </Field>
      <Field label="MESSAGE" error={errors.message}>
        <textarea
          name="message"
          rows={6}
          placeholder="Write it out."
          className={`${inputClass(!!errors.message)} resize-y`}
          onChange={(e) => set("message", e.target.value)}
        />
      </Field>

      {status === "failed" && (
        <p role="alert" className="text-xs text-[#ff6b4a]">
          Sending failed — try again, or email me directly below.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="border border-[#ffc857]/60 bg-[#ffc857]/10 px-8 py-3 text-xs font-mono tracking-[0.3em] text-[#ffc857] transition-colors hover:bg-[#ffc857]/20 disabled:opacity-50"
      >
        {status === "sending" ? "SENDING…" : "SEND MESSAGE →"}
      </button>
    </form>
  );
}
