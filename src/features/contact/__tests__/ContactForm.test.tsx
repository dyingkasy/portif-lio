import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ContactForm from "../ContactForm";

describe("ContactForm", () => {
  it("falls back to mail client when no formspree endpoint exists", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    render(
      <ContactForm
        lang="pt"
        dict={{ contactTitle: "Contato", contactHint: "Preencha e envie uma mensagem." }}
        onClose={() => {}}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Nome"), { target: { value: "Igor" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "dyingkasy@outlook.com" }
    });
    fireEvent.change(screen.getByPlaceholderText("Sua mensagem"), {
      target: { value: "Ola, vim pelo portfolio." }
    });

    fireEvent.submit(screen.getByRole("button", { name: "Enviar" }).closest("form")!);

    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy.mock.calls[0][0]).toContain("mailto:dyingkasy@outlook.com");
    expect(screen.getByText("Cliente de e-mail aberto para envio direto.")).toBeInTheDocument();

    openSpy.mockRestore();
  });

  it("closes on escape key", () => {
    const onClose = vi.fn();

    render(
      <ContactForm
        lang="pt"
        dict={{ contactTitle: "Contato", contactHint: "Preencha e envie uma mensagem." }}
        onClose={onClose}
      />
    );

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
