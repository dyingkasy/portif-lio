import { describe, expect, it } from "vitest";
import { parseCommand } from "../parse";

describe("parseCommand", () => {
  it("parses command name and args", () => {
    expect(parseCommand("projects list now")).toEqual({
      name: "projects",
      args: ["list", "now"]
    });
  });

  it("supports quoted args", () => {
    expect(parseCommand("project \"my app\"")).toEqual({
      name: "project",
      args: ["my app"]
    });
  });

  it("returns empty for whitespace", () => {
    expect(parseCommand("   ")).toEqual({ name: "", args: [] });
  });
});
