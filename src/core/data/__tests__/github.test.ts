import { describe, expect, it } from "vitest";
import { normalizeRepo } from "../github";

describe("normalizeRepo", () => {
  it("maps GitHub repository payload into ProjectView", () => {
    const result = normalizeRepo({
      name: "terminal-portfolio",
      description: "Interactive terminal portfolio",
      html_url: "https://github.com/x/terminal-portfolio",
      stargazers_count: 10,
      language: "TypeScript",
      topics: ["portfolio", "terminal"],
      fork: false,
      updated_at: "2025-10-10T10:00:00Z"
    });

    expect(result).toEqual({
      id: "terminal-portfolio",
      name: "terminal-portfolio",
      description: "Interactive terminal portfolio",
      stack: ["TypeScript", "portfolio", "terminal"],
      url: "https://github.com/x/terminal-portfolio",
      source: "github",
      stars: 10,
      updatedAt: "2025-10-10T10:00:00Z"
    });
  });
});
