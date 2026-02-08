import { useEffect, useMemo, useRef, useState } from "react";
import { fetchGitHubProjects } from "../../core/data/github";
import type { Lang, ProjectView } from "../../types";

interface ProjectsWindowProps {
  lang: Lang;
  localProjects: ProjectView[];
  initialQuery?: string;
  onClose: () => void;
}

type WindowPos = { x: number; y: number };

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function loadPos(): WindowPos {
  try {
    const raw = localStorage.getItem("portfolio-projects-window-pos");
    if (!raw) return { x: 0, y: 0 };
    const parsed = JSON.parse(raw) as WindowPos;
    if (typeof parsed.x !== "number" || typeof parsed.y !== "number") return { x: 0, y: 0 };
    return parsed;
  } catch {
    return { x: 0, y: 0 };
  }
}

function savePos(pos: WindowPos) {
  localStorage.setItem("portfolio-projects-window-pos", JSON.stringify(pos));
}

function getGitHubRepoFromUrl(url: string): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("github.com")) return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1] };
  } catch {
    return null;
  }
}

function projectImageUrl(project: ProjectView): string {
  const github = getGitHubRepoFromUrl(project.url);
  if (github) {
    return `https://opengraph.githubassets.com/1/${github.owner}/${github.repo}`;
  }
  return "";
}

export default function ProjectsWindow({ lang, localProjects, initialQuery, onClose }: ProjectsWindowProps) {
  const [remoteProjects, setRemoteProjects] = useState<ProjectView[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pos, setPos] = useState<WindowPos>(() => loadPos());
  const [query, setQuery] = useState(initialQuery || "");
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  useEffect(() => {
    let active = true;
    fetchGitHubProjects().then((projects) => {
      if (!active) return;
      setRemoteProjects(projects);
    });
    return () => {
      active = false;
    };
  }, []);

  const projects = useMemo(() => {
    const map = new Map<string, ProjectView>();
    const merged = [...(remoteProjects || []), ...localProjects];
    for (const project of merged) {
      map.set(project.id.toLowerCase(), project);
    }
    return [...map.values()];
  }, [localProjects, remoteProjects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
  }, [projects, query]);

  useEffect(() => {
    const initial = (initialQuery || "").trim().toLowerCase();
    if (!initial) {
      if (!selectedId && filtered.length > 0) {
        setSelectedId(filtered[0].id);
      }
      return;
    }

    if (selectedId) return;

    const match = projects.find(
      (p) => p.id.toLowerCase() === initial || p.name.toLowerCase() === initial
    );

    if (match) {
      setSelectedId(match.id);
      return;
    }

    if (filtered.length > 0) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, initialQuery, projects, selectedId]);

  useEffect(() => {
    function handleResize() {
      const maxX = Math.max(0, window.innerWidth - 520);
      const maxY = Math.max(0, window.innerHeight - 520);
      setPos((prev) => ({ x: clamp(prev.x, -maxX / 2, maxX), y: clamp(prev.y, -maxY / 2, maxY) }));
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selected = useMemo(() => {
    const id = (selectedId || "").toLowerCase();
    return projects.find((p) => p.id.toLowerCase() === id) || null;
  }, [projects, selectedId]);

  const title = lang === "pt" ? "Projetos" : "Projects";

  return (
    <aside
      className="projects-window"
      role="dialog"
      aria-modal="false"
      aria-label={title}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    >
      <header
        className="projects-window-header"
        onPointerDown={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest("button") || target.closest("input")) return;

          dragState.current = {
            startX: event.clientX,
            startY: event.clientY,
            originX: pos.x,
            originY: pos.y
          };

          (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!dragState.current) return;
          const dx = event.clientX - dragState.current.startX;
          const dy = event.clientY - dragState.current.startY;

          const next = { x: dragState.current.originX + dx, y: dragState.current.originY + dy };
          setPos(next);
        }}
        onPointerUp={() => {
          if (!dragState.current) return;
          dragState.current = null;
          savePos(pos);
        }}
      >
        <div className="projects-window-title">
          <span className="projects-window-handle" aria-hidden="true" />
          <h3>{title}</h3>
        </div>
        <div className="projects-window-controls">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "pt" ? "buscar" : "search"}
            aria-label={lang === "pt" ? "Buscar projetos" : "Search projects"}
          />
          <button type="button" onClick={onClose} aria-label={lang === "pt" ? "Fechar" : "Close"}>
            x
          </button>
        </div>
      </header>

      <div className="projects-window-body">
        <div className="projects-list" role="list">
          {filtered.map((project) => (
            <button
              key={project.id}
              type="button"
              className={
                selectedId?.toLowerCase() === project.id.toLowerCase()
                  ? "projects-item is-active"
                  : "projects-item"
              }
              onClick={() => setSelectedId(project.id)}
            >
              <div className="thumb" aria-hidden="true">
                {projectImageUrl(project) ? (
                  <img src={projectImageUrl(project)} alt="" loading="lazy" />
                ) : (
                  <div className="thumb-fallback" />
                )}
              </div>
              <div className="meta">
                <p className="name">{project.name}</p>
                <p className="desc">{project.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="projects-details">
          {selected ? (
            <>
              <p className="details-title">{selected.name}</p>
              <p className="details-desc">{selected.description}</p>

              {selected.highlights && selected.highlights.length > 0 ? (
                <ul className="details-highlights">
                  {selected.highlights.slice(0, 8).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}

              <div className="details-tags">
                {selected.stack.slice(0, 6).map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="details-links">
                <a href={selected.url} target="_blank" rel="noreferrer">
                  {lang === "pt" ? "Codigo" : "Code"}
                </a>
                {selected.liveUrl ? (
                  <a href={selected.liveUrl} target="_blank" rel="noreferrer">
                    {lang === "pt" ? "Abrir" : "Live"}
                  </a>
                ) : null}
              </div>

              {selected.stars !== undefined ? (
                <p className="details-foot">
                  {lang === "pt" ? "Estrelas" : "Stars"}: {selected.stars}
                </p>
              ) : null}
            </>
          ) : (
            <p className="details-empty">{lang === "pt" ? "Selecione um projeto" : "Select a project"}</p>
          )}
        </div>
      </div>
    </aside>
  );
}
