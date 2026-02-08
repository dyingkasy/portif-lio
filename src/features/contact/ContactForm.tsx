import type { Lang, ContactPayload } from "../../types";
import { useEffect, useRef, useState, type FormEvent } from "react";

interface ContactFormProps {
  lang: Lang;
  dict: {
    contactTitle: string;
    contactHint: string;
  };
  onClose: () => void;
}

const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT || "";
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || "dyingkasy@outlook.com";

export default function ContactForm({ lang, dict, onClose }: ContactFormProps) {
  const [form, setForm] = useState<ContactPayload>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "redirected">(
    "idle"
  );
  const panelRef = useRef<HTMLElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusables = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );

      if (focusables.length === 0) {
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener("keydown", handleKeyDown);

    return () => {
      panel.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function openMailClient() {
    const subject = `[Portfolio] ${form.name}`;
    const body = `${lang === "pt" ? "Nome" : "Name"}: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(mailtoUrl, "_self");
    setStatus("redirected");
    setForm({ name: "", email: "", message: "" });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!endpoint) {
      openMailClient();
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
        openMailClient();
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      openMailClient();
    }
  }

  return (
    <aside
      ref={panelRef}
      className="contact-panel"
      role="dialog"
      aria-modal="true"
      aria-label={dict.contactTitle}
    >
      <header>
        <h2>{dict.contactTitle}</h2>
        <button
          type="button"
          aria-label={lang === "pt" ? "Fechar contato" : "Close contact"}
          onClick={onClose}
        >
          x
        </button>
      </header>
      <p>{dict.contactHint}</p>

      <form onSubmit={submit}>
        <input
          ref={firstInputRef}
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
      {status === "redirected" ? (
        <p className="success">
          {lang === "pt"
            ? "Cliente de e-mail aberto para envio direto."
            : "Email client opened for direct sending."}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="error">
          {lang === "pt" ? "Falha ao enviar mensagem." : "Failed to send message."}
        </p>
      ) : null}
    </aside>
  );
}
