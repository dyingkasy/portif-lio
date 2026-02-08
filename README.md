# Interactive Terminal Portfolio

Portfolio de programador com interface estilo terminal, bilingue (PT/EN), comandos reais, efeitos visuais e deploy para GitHub Pages.

## Tech

- React + TypeScript + Vite
- Vitest para testes
- GitHub API para projetos dinamicos
- Formspree para contato (opcional)
- GitHub Actions para deploy

## Run locally

```bash
npm install
npm run dev
```

## Tests and build

```bash
npm run test
npm run build
```

## Environment variables

Crie um `.env` local:

```bash
VITE_GITHUB_USERNAME=dyingkasy
VITE_GITHUB_FEATURED_REPOS=app.menufaz,Qualifaz-Entragas,FichaMovel
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/SEU_ID
VITE_CONTACT_EMAIL=dyingkasy@outlook.com
VITE_BASE_PATH=/
```

Se `VITE_FORMSPREE_ENDPOINT` nao estiver configurado, o formulario abre o cliente de e-mail automaticamente.

Para GitHub Pages em repositorio de projeto, o workflow injeta `VITE_BASE_PATH` como `/<nome-do-repo>/`.

## Commands disponiveis

- `help`, `clear`
- `whoami`, `skills`, `experience`
- `projects`, `project <slug|nome>`, `repo <nome-repo>`
- `social`, `contact`
- `lang <pt|en>`, `theme <green|amber|crt>`
- `matrix`, `hack`, `coffee`
- `banner`, `story`

## Deploy

Workflow em `.github/workflows/deploy.yml`:

- Roda `npm ci`, `npm run test`, `npm run build`
- Publica no branch `gh-pages`
- Usa GitHub Repository Variables para:
  - `VITE_GITHUB_USERNAME`
  - `VITE_GITHUB_FEATURED_REPOS`
  - `VITE_FORMSPREE_ENDPOINT`
  - `VITE_CONTACT_EMAIL`

Repositorio alvo:

- `https://github.com/dyingkasy/portif-lio.git`
