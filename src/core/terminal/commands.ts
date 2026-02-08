import { fetchGitHubRepoByName, fetchGitHubProjects } from "../data/github";
import { t as translate } from "../i18n/dictionary";
import { resolveLang } from "../i18n";
import { parseCommand } from "./parse";
import type { Lang, PortfolioContent, ProjectView, TerminalLine, ThemeName } from "../../types";

export interface CommandInfo {
  name: string;
  aliases: string[];
  description: Record<Lang, string>;
}

export const commandCatalog: CommandInfo[] = [
  {
    name: "help",
    aliases: ["ajuda"],
    description: {
      pt: "Lista comandos disponíveis",
      en: "List available commands"
    }
  },
  {
    name: "clear",
    aliases: ["cls", "limpar"],
    description: {
      pt: "Limpa o terminal",
      en: "Clear terminal output"
    }
  },
  {
    name: "whoami",
    aliases: ["sobre", "about"],
    description: {
      pt: "Mostra perfil profissional",
      en: "Show professional profile"
    }
  },
  {
    name: "skills",
    aliases: ["habilidades"],
    description: {
      pt: "Lista principais tecnologias",
      en: "List key technologies"
    }
  },
  {
    name: "experience",
    aliases: ["exp", "experiencia"],
    description: {
      pt: "Mostra experiências",
      en: "Show experience history"
    }
  },
  {
    name: "projects",
    aliases: ["projetos"],
    description: {
      pt: "Lista projetos em destaque",
      en: "List featured projects"
    }
  },
  {
    name: "project",
    aliases: ["projeto"],
    description: {
      pt: "Detalha um projeto específico",
      en: "Show project details"
    }
  },
  {
    name: "repo",
    aliases: [],
    description: {
      pt: "Busca repositório do GitHub por nome",
      en: "Find GitHub repository by name"
    }
  },
  {
    name: "contact",
    aliases: ["contato"],
    description: {
      pt: "Abre formulário de contato",
      en: "Open contact form"
    }
  },
  {
    name: "social",
    aliases: ["redes"],
    description: {
      pt: "Mostra links sociais",
      en: "Show social links"
    }
  },
  {
    name: "lang",
    aliases: ["idioma"],
    description: {
      pt: "Alterna idioma pt/en",
      en: "Switch language pt/en"
    }
  },
  {
    name: "theme",
    aliases: ["tema"],
    description: {
      pt: "Tema: green, amber ou crt",
      en: "Theme: green, amber or crt"
    }
  },
  {
    name: "matrix",
    aliases: [],
    description: {
      pt: "Ativa efeito Matrix",
      en: "Enable Matrix effect"
    }
  },
  {
    name: "hack",
    aliases: [],
    description: {
      pt: "Simula sequência de hacking",
      en: "Run fake hacking sequence"
    }
  },
  {
    name: "coffee",
    aliases: [],
    description: {
      pt: "Mostra mensagem easter egg",
      en: "Show easter egg message"
    }
  },
  {
    name: "banner",
    aliases: ["logo"],
    description: {
      pt: "Exibe o banner ASCII do portifolio",
      en: "Print portfolio ASCII banner"
    }
  },
  {
    name: "story",
    aliases: ["historia"],
    description: {
      pt: "Mostra narrativa curta da jornada",
      en: "Show a short journey narrative"
    }
  },
  {
    name: "tour",
    aliases: ["demo", "guia"],
    description: {
      pt: "Roda uma demo guiada automatica",
      en: "Run an automated guided demo"
    }
  }
];

interface CommandRuntime {
  lang: Lang;
  theme: ThemeName;
  content: PortfolioContent;
  setLang: (lang: Lang) => void;
  setTheme: (theme?: ThemeName) => void;
  clearOutput: () => void;
  openContact: () => void;
  openProjects: (query?: string) => void;
  runTour: () => void;
  triggerEffect: (effect: "matrix" | "hack") => void;
  localProjects: ProjectView[];
}

function line(kind: TerminalLine["kind"], text: string): Omit<TerminalLine, "id"> {
  return { kind, text };
}

function asLines(lines: Array<Omit<TerminalLine, "id">>): Array<Omit<TerminalLine, "id">> {
  return lines;
}

function resolveCommandName(inputName: string): string | null {
  const command = commandCatalog.find(
    (item) => item.name === inputName || item.aliases.includes(inputName)
  );

  return command?.name || null;
}

export function listAutocompleteTargets(): string[] {
  return commandCatalog.flatMap((command) => [command.name, ...command.aliases]);
}

export async function executeCommand(
  rawInput: string,
  runtime: CommandRuntime
): Promise<Array<Omit<TerminalLine, "id">>> {
  const parsed = parseCommand(rawInput);

  if (!parsed.name) {
    return [];
  }

  const commandName = resolveCommandName(parsed.name);
  const { lang, content } = runtime;
  const t = (key: Parameters<typeof translate>[1]) => translate(lang, key);

  if (!commandName) {
    return [line("error", `${t("commandNotFound")} '${parsed.name}'`), line("system", t("hint"))];
  }

  switch (commandName) {
    case "help": {
      const lines = [line("system", t("helpTitle"))];

      for (const command of commandCatalog) {
        lines.push(
          line(
            "text",
            `- ${command.name}${command.aliases.length ? ` (${command.aliases.join(", ")})` : ""}: ${command.description[lang]}`
          )
        );
      }

      return asLines(lines);
    }

    case "clear": {
      runtime.clearOutput();
      return [];
    }

    case "whoami": {
      return asLines([
        line("system", t("whoamiTitle")),
        line("text", `${content.profile.name} | ${content.profile.role[lang]}`),
        line("text", content.profile.summary[lang]),
        line("text", `${t("locationLabel")}: ${content.profile.location}`)
      ]);
    }

    case "skills": {
      return asLines([
        line("system", t("skillsTitle")),
        ...content.skills.map((skill) => line("text", `- ${skill}`))
      ]);
    }

    case "experience": {
      const lines: Array<Omit<TerminalLine, "id">> = [line("system", t("experienceTitle"))];

      for (const exp of content.experience) {
        lines.push(line("text", `${exp.company} | ${exp.role[lang]} | ${exp.period}`));
        for (const bullet of exp.bullets[lang]) {
          lines.push(line("text", `  - ${bullet}`));
        }
      }

      return lines;
    }

    case "projects": {
      runtime.openProjects();

      return [
        line("system", lang === "pt" ? "Janela de projetos aberta." : "Projects window opened."),
        line("text", lang === "pt" ? "Clique em um projeto para ver detalhes." : "Click a project to see details.")
      ];
    }

    case "project": {
      const remote = await fetchGitHubProjects();
      const projects = dedupeProjects(runtime.localProjects, remote);

      const query = parsed.args.join(" ").trim().toLowerCase();

      runtime.openProjects(query || undefined);

      if (!query) {
        return [
          line("system", lang === "pt" ? "Janela de projetos aberta." : "Projects window opened."),
          line("text", lang === "pt" ? "Use: project <nome> para selecionar." : "Use: project <name> to select.")
        ];
      }

      const match = projects.find(
        (project) => project.id.toLowerCase() === query || project.name.toLowerCase() === query
      );

      if (!match) {
        return [line("error", t("emptyProjects"))];
      }

      return [
        line("system", lang === "pt" ? "Selecionado no painel:" : "Selected in panel:"),
        line("text", match.name)
      ];
    }

    case "repo": {
      const query = parsed.args.join(" ").trim();

      if (!query) {
        return [line("error", t("usageRepo"))];
      }

      const repo = await fetchGitHubRepoByName(query);

      if (!repo) {
        return [line("error", t("noRepoFound"))];
      }

      return [
        line("system", repo.name),
        line("text", repo.description),
        line("text", `${t("urlLabel")}: ${repo.url}`),
        line("text", `${t("starsLabel")}: ${repo.stars ?? 0}`)
      ];
    }

    case "contact": {
      runtime.openContact();
      return [line("system", t("contactOpened")), line("text", t("contactHint"))];
    }

    case "social": {
      return asLines([
        line("system", t("socialTitle")),
        ...content.social.map((item) => line("text", `- ${item.label}: ${item.url}`))
      ]);
    }

    case "lang": {
      const target = resolveLang(parsed.args[0] || "");

      if (!target) {
        return [line("error", t("usageLang"))];
      }

      runtime.setLang(target);
      return [line("system", translate(target, "languageChanged"))];
    }

    case "theme": {
      const requested = (parsed.args[0] || "").trim().toLowerCase();
      const validThemes: ThemeName[] = ["green", "amber", "crt"];

      if (requested && !validThemes.includes(requested as ThemeName)) {
        return [line("error", t("usageTheme"))];
      }

      runtime.setTheme(requested ? (requested as ThemeName) : undefined);
      return [line("system", t("themeChanged"))];
    }

    case "matrix": {
      runtime.triggerEffect("matrix");
      return [line("system", t("matrixEnabled"))];
    }

    case "hack": {
      runtime.triggerEffect("hack");
      return [
        line("system", t("hackLine1")),
        line("text", t("hackLine2")),
        line("text", t("hackLine3"))
      ];
    }

    case "coffee": {
      return [line("text", t("coffeeMessage"))];
    }

    case "banner": {
      return [
        line("system", "____   ___  ____  _____ _____ ___ _     ___ ___"),
        line("system", "|  _ \\ / _ \\|  _ \\|_   _|  ___|_ _| |   |_ _/ _ \\"),
        line("system", "| |_) | | | | |_) | | | | |_   | || |    | | | | |"),
        line("system", "|  __/| |_| |  _ <  | | |  _|  | || |___ | | |_| |"),
        line("system", "|_|    \\___/|_| \\_\\ |_| |_|   |___|_____|___\\___/")
      ];
    }

    case "story": {
      return [
        line("system", t("journeyTitle")),
        line("text", t("journeyLine1")),
        line("text", t("journeyLine2")),
        line("text", t("journeyLine3"))
      ];
    }

    case "tour": {
      runtime.runTour();
      return [
        line("system", lang === "pt" ? "Iniciando tour..." : "Starting tour..."),
        line("text", lang === "pt" ? "Dica: voce pode continuar digitando depois." : "Tip: you can keep typing afterwards.")
      ];
    }

    default:
      return [line("error", t("commandNotFound"))];
  }
}

function dedupeProjects(localProjects: ProjectView[], remoteProjects: ProjectView[]): ProjectView[] {
  const map = new Map<string, ProjectView>();

  for (const project of [...remoteProjects, ...localProjects]) {
    map.set(project.id.toLowerCase(), project);
  }

  return [...map.values()];
}
