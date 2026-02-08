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
        pt: "Aplicativo completo de delivery com painel administrativo, fluxo de pedidos e infraestrutura de deploy em Docker, combinando frontend React/Vite e backend Node/Express com PostgreSQL.",
        en: "A full delivery application with admin workflow and Docker-based deployment, combining a React/Vite frontend and a Node/Express backend backed by PostgreSQL."
      },
      highlights: {
        pt: [
          "Arquitetura full-stack: React/Vite no frontend + API Express no backend.",
          "Banco PostgreSQL com schema inicial e evolucao via migrations/ensure tables.",
          "Autenticacao via JWT, controle de roles e validacao de UUID em rotas.",
          "Deploy em producao com Docker Compose e proxy (Caddy) com SSL automatico.",
          "Camadas de dominio usando JSONB para dados flexiveis por loja/produto/pedido."
        ],
        en: [
          "Full-stack architecture: React/Vite frontend + Express API backend.",
          "PostgreSQL with initial schema and ongoing schema hardening (ensure tables).",
          "JWT authentication, role-based behavior, and UUID validation in routes.",
          "Production deployment via Docker Compose + reverse proxy (Caddy) with auto SSL.",
          "JSONB-based domain storage for flexible store/product/order data."
        ]
      },
      stack: ["React", "Vite", "TypeScript", "Node.js", "Express", "PostgreSQL", "Docker"],
      url: "https://github.com/dyingkasy/app.menufaz",
      liveUrl: "https://app.menufaz.com"
    },
    {
      slug: "qualifaz-entragas",
      name: "Qualifaz-Entragas",
      description: {
        pt: "Hub operacional para pedidos e entregas: dashboard React com modulos (cozinha, kanban, financeiro, usuarios) e backend Node/Express + Postgres com eventos em tempo real (SSE).",
        en: "An operations hub for orders and deliveries: a React dashboard with modules (kitchen, kanban, finance, users) plus a Node/Express + Postgres backend with real-time updates (SSE)."
      },
      highlights: {
        pt: [
          "Frontend com dashboard e graficos (Recharts) e varios modulos operacionais.",
          "Backend Express com endpoints de saude, downloads e fluxo de pedidos.",
          "Atualizacoes em tempo real via SSE para acompanhar pedidos por empresa.",
          "Infra Docker Compose com web + api + Postgres para ambiente reproduzivel.",
          "Camada de autenticacao por token e separacao por companyId."
        ],
        en: [
          "Dashboard frontend with charts (Recharts) and multiple operations modules.",
          "Express backend with health, downloads, and order workflow endpoints.",
          "Real-time updates via SSE to track orders per company.",
          "Docker Compose stack (web + api + Postgres) for reproducible environments.",
          "Token-based authentication layer and company-bound access."
        ]
      },
      stack: ["React", "Vite", "TypeScript", "Node.js", "Express", "PostgreSQL", "Docker", "SSE"],
      url: "https://github.com/dyingkasy/Qualifaz-Entragas"
    },
    {
      slug: "fichamovel",
      name: "FichaMovel",
      description: {
        pt: "Aplicativo Flutter para operacao (venda, resgate, fechamento e relatorios) com estado via Provider e persistencia local com Hive, organizado por camadas (data/domain/screens/widgets).",
        en: "A Flutter operations app (sell, redeem, close, reports) using Provider for state and Hive for local persistence, organized into layers (data/domain/screens/widgets)."
      },
      highlights: {
        pt: [
          "Flutter + Provider para gerenciamento de estado e navegacao por perfis (roles).",
          "Persistencia offline com Hive/Hive Flutter e inicializacao no bootstrap.",
          "Tela por modulos: Sell, Redeem (scanner), Close, Reports e Live.",
          "Camada de tema e design system (colors/typography/spacing/widgets).",
          "Export/compartilhamento com CSV/PDF/Printing e integracoes de utilidade."
        ],
        en: [
          "Flutter + Provider for state management and role-based navigation.",
          "Offline persistence with Hive/Hive Flutter initialized at app bootstrap.",
          "Module-based screens: Sell, Redeem (scanner), Close, Reports and Live.",
          "Theme layer and design system (colors/typography/spacing/widgets).",
          "Export/sharing via CSV/PDF/Printing and utility integrations."
        ]
      },
      stack: ["Flutter", "Dart", "Provider", "Hive", "Mobile Scanner", "PDF/Printing"],
      url: "https://github.com/dyingkasy/FichaMovel"
    }
  ]
};
