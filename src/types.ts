export type Lang = "pt" | "en";

export type ThemeName = "green" | "amber" | "crt";

export type LineKind = "text" | "error" | "system" | "command";

export interface TerminalLine {
  id: string;
  kind: LineKind;
  text: string;
}

export interface FeaturedProject {
  slug: string;
  name: string;
  description: Record<Lang, string>;
  stack: string[];
  url: string;
}

export interface PortfolioContent {
  profile: {
    name: string;
    role: Record<Lang, string>;
    summary: Record<Lang, string>;
    location: string;
  };
  skills: string[];
  experience: Array<{
    company: string;
    role: Record<Lang, string>;
    period: string;
    bullets: Record<Lang, string[]>;
  }>;
  social: Array<{
    label: string;
    url: string;
  }>;
  featuredProjects: FeaturedProject[];
}

export interface ProjectView {
  id: string;
  name: string;
  description: string;
  stack: string[];
  url: string;
  source: "local" | "github";
  stars?: number;
  updatedAt?: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}
