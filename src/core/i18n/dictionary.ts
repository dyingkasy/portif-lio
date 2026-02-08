import type { Lang } from "../../types";

interface Dictionary {
  welcome: string;
  hint: string;
  commandNotFound: string;
  emptyProjects: string;
  noRepoFound: string;
  languageChanged: string;
  themeChanged: string;
  contactOpened: string;
  contactTitle: string;
  contactHint: string;
  helpTitle: string;
  whoamiTitle: string;
  skillsTitle: string;
  experienceTitle: string;
  projectsTitle: string;
  socialTitle: string;
  locationLabel: string;
  stackLabel: string;
  urlLabel: string;
  starsLabel: string;
  usageProject: string;
  usageLang: string;
  usageRepo: string;
  usageTheme: string;
  matrixEnabled: string;
  hackLine1: string;
  hackLine2: string;
  hackLine3: string;
  coffeeMessage: string;
  journeyTitle: string;
  journeyLine1: string;
  journeyLine2: string;
  journeyLine3: string;
}

export const dictionaries: Record<Lang, Dictionary> = {
  pt: {
    welcome: "Booting portfolio terminal... pronto.",
    hint: "Digite 'help' para ver os comandos disponíveis.",
    commandNotFound: "Comando não encontrado.",
    emptyProjects: "Nenhum projeto encontrado no momento.",
    noRepoFound: "Repositório não encontrado.",
    languageChanged: "Idioma alterado para Português.",
    themeChanged: "Tema alternado.",
    contactOpened: "Formulário de contato aberto.",
    contactTitle: "Contato",
    contactHint: "Preencha e envie uma mensagem.",
    helpTitle: "Comandos disponíveis:",
    whoamiTitle: "Perfil",
    skillsTitle: "Habilidades",
    experienceTitle: "Experiência",
    projectsTitle: "Projetos",
    socialTitle: "Redes",
    locationLabel: "Localização",
    stackLabel: "Stack",
    urlLabel: "URL",
    starsLabel: "Estrelas",
    usageProject: "Uso: project <slug|nome>",
    usageLang: "Uso: lang <pt|en>",
    usageRepo: "Uso: repo <nome-do-repo>",
    usageTheme: "Uso: theme <green|amber|crt>",
    matrixEnabled: "[efeito] matrix ativado",
    hackLine1: "Inicializando handshake...",
    hackLine2: "Bypass no firewall...",
    hackLine3: "Acesso negado. Era brincadeira.",
    coffeeMessage: "Cafe detectado. Produtividade +25%.",
    journeyTitle: "Jornada",
    journeyLine1: "2024: comecei publicando projetos e automacoes no GitHub.",
    journeyLine2: "2025: foquei em sistemas para operacao, APIs e produtividade.",
    journeyLine3: "2026: construindo experiencias interativas e unicas para web."
  },
  en: {
    welcome: "Booting portfolio terminal... ready.",
    hint: "Type 'help' to list available commands.",
    commandNotFound: "Command not found.",
    emptyProjects: "No projects found right now.",
    noRepoFound: "Repository not found.",
    languageChanged: "Language switched to English.",
    themeChanged: "Theme toggled.",
    contactOpened: "Contact form opened.",
    contactTitle: "Contact",
    contactHint: "Fill in the form and send a message.",
    helpTitle: "Available commands:",
    whoamiTitle: "Profile",
    skillsTitle: "Skills",
    experienceTitle: "Experience",
    projectsTitle: "Projects",
    socialTitle: "Social",
    locationLabel: "Location",
    stackLabel: "Stack",
    urlLabel: "URL",
    starsLabel: "Stars",
    usageProject: "Usage: project <slug|name>",
    usageLang: "Usage: lang <pt|en>",
    usageRepo: "Usage: repo <repo-name>",
    usageTheme: "Usage: theme <green|amber|crt>",
    matrixEnabled: "[effect] matrix enabled",
    hackLine1: "Initializing handshake...",
    hackLine2: "Bypassing firewall...",
    hackLine3: "Access denied. Just kidding.",
    coffeeMessage: "Coffee detected. Productivity +25%.",
    journeyTitle: "Journey",
    journeyLine1: "2024: I started publishing projects and automations on GitHub.",
    journeyLine2: "2025: I focused on systems for operations, APIs and productivity.",
    journeyLine3: "2026: building unique and interactive web experiences."
  }
};

export function t(lang: Lang, key: keyof Dictionary): string {
  return dictionaries[lang][key];
}
