import type { PortfolioContent } from "../../types";

export const portfolioContent: PortfolioContent = {
  profile: {
    name: "Igor",
    role: {
      pt: "Desenvolvedor Full-Stack",
      en: "Full-Stack Developer"
    },
    summary: {
      pt: "Tenho 18 anos e transformo ideias em produtos web completos, conectando frontend, backend e automações com foco em performance, usabilidade e resultado real.",
      en: "I am 18 years old and I turn ideas into complete web products, connecting frontend, backend and automation with focus on performance, usability and real impact."
    },
    location: "Brazil"
  },
  skills: [
    "TypeScript",
    "React",
    "Node.js",
    "Pascal",
    "APIs",
    "Automation",
    "GitHub Actions"
  ],
  experience: [
    {
      company: "Independent Projects",
      role: {
        pt: "Desenvolvedor de Software",
        en: "Software Developer"
      },
      period: "2024 - Atual",
      bullets: {
        pt: [
          "Desenvolvimento de aplicações e integrações orientadas a negócios.",
          "Construção de APIs e fluxos automatizados para operações internas.",
          "Criação de interfaces interativas com deploy contínuo."
        ],
        en: [
          "Built business-oriented applications and integrations.",
          "Created APIs and automated workflows for internal operations.",
          "Delivered interactive interfaces with continuous deployment."
        ]
      }
    }
  ],
  social: [
    { label: "GitHub", url: "https://github.com/dyingkasy" },
    { label: "Instagram", url: "https://instagram.com/lg0r_n" },
    { label: "Email", url: "mailto:dyingkasy@outlook.com" },
    { label: "Portfolio Repo", url: "https://github.com/dyingkasy/portif-lio" }
  ],
  featuredProjects: [
    {
      slug: "app-menufaz",
      name: "app.menufaz",
      description: {
        pt: "Aplicação em TypeScript focada em fluxo e produtividade.",
        en: "A TypeScript application focused on workflow and productivity."
      },
      stack: ["TypeScript"],
      url: "https://github.com/dyingkasy/app.menufaz"
    },
    {
      slug: "qualifaz-entragas",
      name: "Qualifaz-Entragas",
      description: {
        pt: "Sistema TypeScript para operação e integração de processos.",
        en: "TypeScript system for operations and process integrations."
      },
      stack: ["TypeScript"],
      url: "https://github.com/dyingkasy/Qualifaz-Entragas"
    },
    {
      slug: "fichamovel",
      name: "FichaMovel",
      description: {
        pt: "Projeto web em HTML para fluxos operacionais leves.",
        en: "HTML web project for lightweight operational workflows."
      },
      stack: ["HTML"],
      url: "https://github.com/dyingkasy/FichaMovel"
    }
  ]
};
