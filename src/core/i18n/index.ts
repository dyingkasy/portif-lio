import type { Lang } from "../../types";

export function resolveLang(value: string): Lang | null {
  const normalized = value.trim().toLowerCase();

  if (["pt", "pt-br", "br", "portugues", "portuguese"].includes(normalized)) {
    return "pt";
  }

  if (["en", "en-us", "english"].includes(normalized)) {
    return "en";
  }

  return null;
}
