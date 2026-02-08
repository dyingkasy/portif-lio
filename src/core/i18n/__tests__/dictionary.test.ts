import { describe, expect, it } from "vitest";
import { resolveLang } from "../index";
import { t } from "../dictionary";

describe("i18n", () => {
  it("resolves aliases", () => {
    expect(resolveLang("pt-BR")).toBe("pt");
    expect(resolveLang("english")).toBe("en");
  });

  it("returns null for invalid value", () => {
    expect(resolveLang("de")).toBeNull();
  });

  it("reads dictionary values", () => {
    expect(t("pt", "helpTitle")).toContain("Comandos");
    expect(t("en", "helpTitle")).toContain("Available");
  });
});
