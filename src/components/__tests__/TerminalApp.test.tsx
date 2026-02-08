import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TerminalApp from "../TerminalApp";

describe("TerminalApp", () => {
  it("executes story command and renders localized output", async () => {
    render(<TerminalApp />);

    fireEvent.click(screen.getByRole("button", { name: "Portugues (BR)" }));

    const input = screen.getByPlaceholderText("digite um comando");
    fireEvent.change(input, { target: { value: "story" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("Jornada")).toBeInTheDocument();
      expect(
        screen.getByText("2026: construindo experiencias interativas e unicas para web.")
      ).toBeInTheDocument();
    });
  });
});
