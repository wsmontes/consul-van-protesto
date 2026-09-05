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
- `js/complaints.js` — validação, normalização e filtro dos relatos
- `js/supabase.js` — cliente REST do Supabase para envio e leitura pública
- `js/app.js` — integração da interface
- `supabase/schema.sql` — referência reproduzível da tabela, grants, RLS e políticas
- `privacidade.html` — política de privacidade
- `termos.html` — termos de uso
- `contato.html` — contato e transparência
- `tests/` — testes automatizados com o runner nativo do Node

## Backend dos relatos

O formulário usa Supabase como base central. Cada envio entra na tabela `public.complaints` com status `pending`.

A publicação é moderada: visitantes anônimos conseguem inserir relatos, mas a leitura pública só retorna registros com status `approved`. A consulta pública também não recebe acesso às colunas de nome completo e e-mail.

Para aprovar um relato nesta fase inicial, altere o campo `status` no painel do Supabase de `pending` para `approved`. Na próxima carga da página, o relato aparece automaticamente na área da comunidade.

O frontend usa apenas uma **publishable key**, própria para código público. Nenhuma secret key ou `service_role` deve ser adicionada ao repositório ou ao navegador.

## Publicação

O frontend continua estático e pode ser hospedado diretamente em GitHub Pages, Cloudflare Pages, Netlify, Hostinger ou serviço equivalente. O backend permanece no Supabase.
