import type { ProjectView } from "../../types";

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
  fork: boolean;
  updated_at: string;
}

const username = import.meta.env.VITE_GITHUB_USERNAME?.trim() || "dyingkasy";
const featured = (import.meta.env.VITE_GITHUB_FEATURED_REPOS || "")
  .split(",")
  .map((item: string) => item.trim().toLowerCase())
  .filter(Boolean);
const defaultFeatured = ["app.menufaz", "qualifaz-entragas", "fichamovel"];

export function normalizeRepo(repo: GitHubRepo): ProjectView {
  return {
    id: repo.name.toLowerCase(),
    name: repo.name,
    description: repo.description || "No description provided.",
    stack: [repo.language, ...(repo.topics || []).slice(0, 3)].filter(
      (value): value is string => Boolean(value)
    ),
    url: repo.html_url,
    source: "github",
    stars: repo.stargazers_count,
    updatedAt: repo.updated_at
  };
}

export async function fetchGitHubProjects(): Promise<ProjectView[]> {
  if (!username) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
    );

    if (!response.ok) {
      return [];
    }

    const repos = (await response.json()) as GitHubRepo[];

    const validRepos = repos.filter((repo) => !repo.fork).map(normalizeRepo);

    const featuredTargets = featured.length > 0 ? featured : defaultFeatured;

    if (featuredTargets.length === 0) {
      return validRepos.slice(0, 6);
    }

    const featuredRepos = validRepos.filter((repo) =>
      featuredTargets.includes(repo.name.toLowerCase())
    );

    return featuredRepos.length > 0 ? featuredRepos : validRepos.slice(0, 6);
  } catch {
    return [];
  }
}

export async function fetchGitHubRepoByName(name: string): Promise<ProjectView | null> {
  if (!username || !name.trim()) {
    return null;
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${name}`);

    if (!response.ok) {
      return null;
    }

    const repo = (await response.json()) as GitHubRepo;

    if (repo.fork) {
      return null;
    }

    return normalizeRepo(repo);
  } catch {
    return null;
  }
}
