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
  experienceTitle: string;
  projectsTitle: string;
  socialTitle: string;
  usageProject: string;
  usageLang: string;
  usageRepo: string;
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
    experienceTitle: "Experiência",
    projectsTitle: "Projetos",
    socialTitle: "Redes",
    usageProject: "Uso: project <slug|nome>",
    usageLang: "Uso: lang <pt|en>",
    usageRepo: "Uso: repo <nome-do-repo>"
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
    experienceTitle: "Experience",
    projectsTitle: "Projects",
    socialTitle: "Social",
    usageProject: "Usage: project <slug|name>",
    usageLang: "Usage: lang <pt|en>",
    usageRepo: "Usage: repo <repo-name>"
  }
};

export function t(lang: Lang, key: keyof Dictionary): string {
  return dictionaries[lang][key];
}
