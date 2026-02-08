import { portfolioContent } from "../core/data/content";
import { dictionaries, t as translate } from "../core/i18n/dictionary";
import {
  commandCatalog,
  executeCommand,
  listAutocompleteTargets
} from "../core/terminal/commands";
import type { Lang, ProjectView, TerminalLine, ThemeName } from "../types";
import { useEffect, useMemo, useRef, useState } from "react";
import ContactForm from "../features/contact/ContactForm";
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
    stack: project.stack,
    url: project.url,
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

export default function TerminalApp() {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("portfolio-lang");
    return saved === "en" ? "en" : "pt";
  });
  const [theme, setTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem("portfolio-theme");
    return saved === "amber" ? "amber" : "green";
  });
  const [lines, setLines] = useState<TerminalLine[]>(() => [
    createLine("system", translate(lang, "welcome")),
    createLine("text", translate(lang, "hint"))
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [contactOpen, setContactOpen] = useState(false);
  const [effects, setEffects] = useState<EffectState>({ matrix: false, hack: false });
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem("portfolio-lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("portfolio-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [lines, contactOpen]);

  const localProjects = useMemo(() => initialLocalProjects(lang), [lang]);

  const title = lang === "pt" ? "Terminal do Portifolio" : "Portfolio Terminal";

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
      toggleTheme: () => {
        setTheme((prev) => (prev === "green" ? "amber" : "green"));
      },
      clearOutput: () => {
        setLines([]);
      },
      openContact: () => {
        setContactOpen(true);
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
      setLines((prev) => [
        ...prev,
        ...rendered.map((line) => createLine(line.kind, line.text))
      ]);
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

        <div ref={endRef} />
      </section>

      {contactOpen ? (
        <ContactForm
          lang={lang}
          dict={dictionaries[lang]}
          onClose={() => setContactOpen(false)}
        />
      ) : null}
    </main>
  );
}
