# Consulixo Initial Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar a primeira versão completa, responsiva e testável do site “Consulixo do Brasil em Vancouver”.

**Architecture:** Site estático multi-página com HTML/CSS e JavaScript ES modules. A lógica de relatos fica isolada em `js/complaints.js`, permitindo testes em Node e futura substituição do armazenamento local por API.

**Tech Stack:** HTML5, CSS3, JavaScript ES2022, Node.js built-in test runner.

**Spec:** `docs/superpowers/specs/2026-09-04-initial-site-design.md`

## Global Constraints
- Sem framework ou dependência runtime obrigatória.
- Não apresentar depoimentos fictícios como relatos reais.
- Dados pessoais não são exibidos sem consentimento explícito.
- Rodapé deve declarar claramente que o site é independente e não oficial.
- Visual inspirado nas cores do Brasil com estética burocrática profissional.

---

### Task 1: Lógica de relatos testável
**Files:** `tests/complaints.test.js`, `js/complaints.js`, `package.json`
**Produces:** `validateComplaint`, `normalizeComplaint`, `filterComplaints`, `saveComplaint`, `loadComplaints`.
- [ ] Escrever testes falhando para validação, normalização, filtro e storage.
- [ ] Rodar `npm test` e confirmar falha por módulo ausente.
- [ ] Implementar funções mínimas.
- [ ] Rodar `npm test` e confirmar sucesso.

### Task 2: Interface principal
**Files:** `index.html`, `styles.css`, `js/app.js`, `data/services.json`
**Consumes:** funções de `js/complaints.js`.
- [ ] Criar estrutura semântica completa e conteúdo do prompt.
- [ ] Implementar identidade visual responsiva e estados de foco/reduced-motion.
- [ ] Conectar formulário, filtros e prévia local.
- [ ] Testar carregamento via servidor HTTP local e verificar links/IDs essenciais.

### Task 3: Páginas legais e contato
**Files:** `privacidade.html`, `termos.html`, `contato.html`
- [ ] Criar páginas consistentes com a identidade visual.
- [ ] Explicar de forma clara o caráter independente, tratamento local de dados nesta versão e regras de moderação.
- [ ] Verificar links internos e rodapés.

### Task 4: Documentação e verificação final
**Files:** `README.md`
- [ ] Documentar execução local, publicação estática e limite atual do backend.
- [ ] Rodar testes automatizados.
- [ ] Rodar checagens de links/arquivos e sintaxe JS.
- [ ] Revisar responsividade por inspeção estrutural e CSS breakpoints.
