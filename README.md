# Consulixo do Brasil em Vancouver

Site independente de crítica, sátira e participação comunitária sobre a experiência de brasileiros com o atendimento consular em Vancouver.

> **Não é um site oficial do Governo do Brasil ou do Consulado-Geral do Brasil em Vancouver.**

## Rodar localmente

Não há dependências de runtime nem etapa de build.

```bash
python3 -m http.server 8080
```

Abra `http://localhost:8080`.

Para rodar os testes:

```bash
npm test
npm run check
```

## Estrutura

- `index.html` — página principal
- `styles.css` — identidade visual e responsividade
- `js/complaints.js` — validação, normalização, filtro e storage dos relatos
- `js/app.js` — integração da interface
- `privacidade.html` — política de privacidade
- `termos.html` — termos de uso
- `contato.html` — contato e transparência
- `tests/` — testes automatizados com o runner nativo do Node

## Relatos nesta versão

O formulário funciona como **prévia local**: relatos são armazenados apenas no `localStorage` do navegador do visitante. Nada é enviado ou publicado.

Isso é intencional. A publicação comunitária real deverá entrar junto com backend, moderação e regras claras de privacidade, em vez de fingir que um site estático possui uma base comunitária que ainda não existe.

## Publicação

Como o projeto é estático, pode ser hospedado diretamente em GitHub Pages, Cloudflare Pages, Netlify ou serviço equivalente.
