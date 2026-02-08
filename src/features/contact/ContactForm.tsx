import type { Lang, ContactPayload } from "../../types";
import { useState, type FormEvent } from "react";

interface ContactFormProps {
  lang: Lang;
  dict: {
    contactTitle: string;
    contactHint: string;
  };
  onClose: () => void;
}

const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT || "";

export default function ContactForm({ lang, dict, onClose }: ContactFormProps) {
  const [form, setForm] = useState<ContactPayload>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!endpoint) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <aside className="contact-panel" role="dialog" aria-modal="true" aria-label={dict.contactTitle}>
      <header>
        <h2>{dict.contactTitle}</h2>
        <button type="button" onClick={onClose}>
          x
        </button>
      </header>
      <p>{dict.contactHint}</p>

      <form onSubmit={submit}>
        <input
          required
          type="text"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder={lang === "pt" ? "Nome" : "Name"}
        />
        <input
          required
          type="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          placeholder="Email"
        />
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
          placeholder={lang === "pt" ? "Sua mensagem" : "Your message"}
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading"
            ? lang === "pt"
              ? "Enviando..."
              : "Sending..."
            : lang === "pt"
              ? "Enviar"
              : "Send"}
        </button>
      </form>

      {status === "success" ? (
        <p className="success">{lang === "pt" ? "Mensagem enviada." : "Message sent."}</p>
      ) : null}
      {status === "error" ? (
        <p className="error">
          {lang === "pt"
            ? "Falha ao enviar. Configure VITE_FORMSPREE_ENDPOINT."
            : "Failed to send. Configure VITE_FORMSPREE_ENDPOINT."}
        </p>
      ) : null}
    </aside>
  );
}
