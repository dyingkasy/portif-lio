import type { PortfolioContent } from "../../types";

export const portfolioContent: PortfolioContent = {
  profile: {
    name: "dyingkasy",
    role: {
      pt: "Desenvolvedor de Software",
      en: "Software Developer"
    },
    summary: {
      pt: "Construo soluções práticas, automatizadas e com foco em performance para web e sistemas de negócio.",
      en: "I build practical, automated, high-performance solutions for web and business systems."
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
