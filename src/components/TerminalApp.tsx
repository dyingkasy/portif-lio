import { portfolioContent } from "../core/data/content";
import { dictionaries, t as translate } from "../core/i18n/dictionary";
import {
  commandCatalog,
  executeCommand,
  listAutocompleteTargets
} from "../core/terminal/commands";
import type { Lang, ProjectView, TerminalLine, ThemeName } from "../types";
import { useEffect, useMemo, useState } from "react";
import ContactForm from "../features/contact/ContactForm";
import ProjectsWindow from "../features/projects/ProjectsWindow";
import OutputStream from "./terminal/OutputStream";
import PromptInput from "./terminal/PromptInput";

interface EffectState {
  matrix: boolean;
  hack: boolean;
}

const COMMAND_TARGETS = listAutocompleteTargets();

function initialLocalProjects(lang: Lang): ProjectView[] {
  return portfolioContent.featuredProjects.map((project) => ({
    id: project.slug,
    name: project.name,
    description: project.description[lang],
    highlights: project.highlights ? project.highlights[lang] : undefined,
    stack: project.stack,
    url: project.url,
    liveUrl: project.liveUrl,
    source: "local"
  }));
}

function createLine(kind: TerminalLine["kind"], text: string): TerminalLine {
  return {
    id: crypto.randomUUID(),
    kind,
    text
  };
}

function longestCommonPrefix(values: string[]): string {
  if (values.length === 0) {
    return "";
  }

  let prefix = values[0];

  for (const value of values.slice(1)) {
    while (!value.startsWith(prefix) && prefix.length > 0) {
      prefix = prefix.slice(0, -1);
    }
  }

  return prefix;
}

function createBootLines(lang: Lang): TerminalLine[] {
  const banner = [
    "____   ___  ____  _____ _____ ___ _     ___ ___",
    "|  _ \\ / _ \\|  _ \\|_   _|  ___|_ _| |   |_ _/ _ \\",
    "| |_) | | | | |_) | | | | |_   | || |    | | | | |",
    "|  __/| |_| |  _ <  | | |  _|  | || |___ | | |_| |",
    "|_|    \\___/|_| \\_\\ |_| |_|   |___|_____|___\\___/"
  ];

  const intro =
    lang === "pt"
      ? [
          "Session: Igor | Full-Stack Developer | 18y",
          "Ambiente carregado. Digite comandos para explorar meu trabalho.",
          "Quick start: whoami | skills | projects | story | tour | contact",
          "Dica: use TAB para autocomplete e setas para histórico."
        ]
      : [
          "Session: Igor | Full-Stack Developer | 18y",
          "Environment loaded. Type commands to explore my work.",
          "Quick start: whoami | skills | projects | story | tour | contact",
          "Tip: use TAB for autocomplete and arrows for history."
        ];

  return [
    ...banner.map((line) => createLine("system", line)),
    createLine("system", "------------------------------------------------------------"),
    ...intro.map((line) => createLine("text", line)),
    createLine("system", translate(lang, "welcome")),
    createLine("text", translate(lang, "hint")),
    createLine("system", "------------------------------------------------------------")
  ];
}

export default function TerminalApp() {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("portfolio-lang");
    return saved === "en" ? "en" : "pt";
  });
  const [theme, setTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem("portfolio-theme");
    return saved === "amber" || saved === "crt" ? saved : "green";
  });
  const [lines, setLines] = useState<TerminalLine[]>(() => createBootLines(lang));
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("portfolio-history");
      if (!saved) {
        return [];
      }
      const parsed = JSON.parse(saved) as string[];
      return Array.isArray(parsed) ? parsed.slice(-80) : [];
    } catch {
      return [];
    }
  });
  const [contactOpen, setContactOpen] = useState(false);
  const [effects, setEffects] = useState<EffectState>({ matrix: false, hack: false });
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [languageGateOpen, setLanguageGateOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [projectsQuery, setProjectsQuery] = useState<string | undefined>(undefined);
  const [tourRunning, setTourRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem("portfolio-lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("portfolio-history", JSON.stringify(history.slice(-80)));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("portfolio-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (media?.matches) {
      return;
    }

      const onMove = (event: MouseEvent) => {
      const dx = event.clientX / Math.max(1, window.innerWidth) - 0.5;
      const dy = event.clientY / Math.max(1, window.innerHeight) - 0.5;

      const p1x = dx * 6;
      const p1y = dy * 4;
      const p2x = dx * 12;
      const p2y = dy * 8;
      const p3x = dx * 18;
      const p3y = dy * 12;

      const root = document.documentElement.style;
      root.setProperty("--p1x", `${p1x}px`);
      root.setProperty("--p1y", `${p1y}px`);
      root.setProperty("--p1xN", `${-p1x}px`);
      root.setProperty("--p1yN", `${-p1y}px`);
      root.setProperty("--p2x", `${p2x}px`);
      root.setProperty("--p2y", `${p2y}px`);
      root.setProperty("--p2xN", `${-p2x}px`);
      root.setProperty("--p2yN", `${-p2y}px`);
      root.setProperty("--p3x", `${p3x}px`);
      root.setProperty("--p3y", `${p3y}px`);
      root.setProperty("--p3xN", `${-p3x}px`);
      root.setProperty("--p3yN", `${-p3y}px`);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const localProjects = useMemo(() => initialLocalProjects(lang), [lang]);

  const title = lang === "pt" ? "Terminal do Portifolio" : "Portfolio Terminal";

  function applyLanguageChoice(nextLang: Lang) {
    setLang(nextLang);
    setLines(createBootLines(nextLang));
    setInputValue("");
    setSuggestions([]);
    setLanguageGateOpen(false);
  }

  async function streamLines(nextLines: Array<Omit<TerminalLine, "id">>) {
    setIsTyping(true);

    for (const nextLine of nextLines) {
      await new Promise<void>((resolve) => {
        window.setTimeout(() => {
          setLines((prev) => [...prev, createLine(nextLine.kind, nextLine.text)]);
          resolve();
        }, 38);
      });
    }

    setIsTyping(false);
  }

  async function runInput(rawInput: string) {
    const trimmed = rawInput.trim();

    if (!trimmed) {
      return;
    }

    setLines((prev) => [...prev, createLine("command", `$ ${trimmed}`)]);
    setHistory((prev) => [...prev, trimmed]);

    const rendered = await executeCommand(trimmed, {
      lang,
      theme,
      content: portfolioContent,
      setLang: (nextLang) => {
        setLang(nextLang);
      },
      setTheme: (nextTheme) => {
        if (nextTheme) {
          setTheme(nextTheme);
          return;
        }

        setTheme((prev) => {
          if (prev === "green") {
            return "amber";
          }

          if (prev === "amber") {
            return "crt";
          }

          return "green";
        });
      },
      clearOutput: () => {
        setLines([]);
      },
      openContact: () => {
        setContactOpen(true);
      },
      openProjects: (query) => {
        setProjectsOpen(true);
        setProjectsQuery(query);
      },
      runTour: () => {
        void (async () => {
          if (tourRunning) return;
          setTourRunning(true);

          const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
          const steps = ["whoami", "skills", "projects", "project app.menufaz", "theme crt", "story", "contact"];

          for (const step of steps) {
            await sleep(260);
            await runInput(step);
          }

          setTourRunning(false);
        })();
      },
      triggerEffect: (effect) => {
        setEffects((prev) => ({ ...prev, [effect]: true }));
        window.setTimeout(() => {
          setEffects((prev) => ({ ...prev, [effect]: false }));
        }, effect === "matrix" ? 2600 : 1800);
      },
      localProjects
    });

    if (rendered.length > 0) {
      await streamLines(rendered);
    }
  }

  function handleAutocomplete(value: string): string {
    const token = value.trim();

    if (!token || token.includes(" ")) {
      setSuggestions([]);
      return value;
    }

    const matches = COMMAND_TARGETS.filter((item) => item.startsWith(token.toLowerCase()));

    setSuggestions(matches.slice(0, 6));

    if (matches.length === 0) {
      return value;
    }

    if (matches.length === 1) {
      return `${matches[0]} `;
    }

    const prefix = longestCommonPrefix(matches);

    return prefix.length > token.length ? prefix : value;
  }

  function onInputChange(value: string) {
    setInputValue(value);

    const token = value.trim().toLowerCase();
    if (!token || token.includes(" ")) {
      setSuggestions([]);
      return;
    }

    const matches = commandCatalog
      .map((item) => item.name)
      .filter((name) => name.startsWith(token));
    setSuggestions(matches.slice(0, 6));
  }

  return (
    <main className="terminal-page">
      <div className="room-backdrop" aria-hidden="true">
        <div className="room-window">
          <div className="cityline" />
          <div className="curtains" />
        </div>
        <div className="room-shelf">
          <span />
          <span />
          <span />
        </div>
        <div className="room-lamp" />
        <div className="room-poster" />
        <div className="room-led-strip" />
        <div className="room-plant" />
        <div className="room-chair" />
        <div className="room-rug" />
      </div>

      <div className="scene-glow scene-glow-left" />
      <div className="scene-glow scene-glow-right" />

      <section className="workstation" aria-label="Modern workstation">
        <div className="monitor-shell">
          <div className="monitor-notch" />
          <div className="monitor-bezel">
            <section
              className={`terminal-window ${effects.matrix ? "is-matrix" : ""} ${
                effects.hack ? "is-hack" : ""
              }`}
            >
              <header className="terminal-header">
                <div className="dots">
                  <span />
                  <span />
                  <span />
                </div>
                <p>{title}</p>
              </header>

              <OutputStream lines={lines} />

        <PromptInput
          inputValue={inputValue}
          onInputValueChange={onInputChange}
                onAutocomplete={handleAutocomplete}
                onSubmit={async (value) => {
                  setInputValue("");
                  setSuggestions([]);
                  await runInput(value);
          }}
          history={history}
          lang={lang}
          disabled={isTyping || languageGateOpen || tourRunning}
        />

              {suggestions.length > 0 ? (
                <div className="terminal-suggestions" aria-live="polite">
                  {suggestions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={async () => {
                        setInputValue("");
                        setSuggestions([]);
                        await runInput(item);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ) : null}
            </section>
          </div>
        </div>

        <div className="monitor-stand" />
        <div className="desk-surface">
          <div className="keyboard" />
          <div className="mousepad" />
          <div className="desk-mouse" />
        </div>
      </section>

      {languageGateOpen ? (
        <section className="language-gate" role="dialog" aria-modal="true" aria-label="Choose language">
          <div className="language-card">
            <p className="language-eyebrow">Welcome</p>
            <h2>Choose your language</h2>
            <p>Select how you want to explore this terminal portfolio.</p>
            <div className="language-actions">
              <button type="button" onClick={() => applyLanguageChoice("pt")}>
                Portugues (BR)
              </button>
              <button type="button" onClick={() => applyLanguageChoice("en")}>
                English (US)
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {contactOpen ? (
        <ContactForm
          lang={lang}
          dict={dictionaries[lang]}
          onClose={() => setContactOpen(false)}
        />
      ) : null}

      {projectsOpen ? (
        <ProjectsWindow
          lang={lang}
          localProjects={localProjects}
          initialQuery={projectsQuery}
          onClose={() => {
            setProjectsOpen(false);
            setProjectsQuery(undefined);
          }}
        />
      ) : null}
    </main>
  );
}
