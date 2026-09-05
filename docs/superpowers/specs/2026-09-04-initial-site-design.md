# Consulixo do Brasil em Vancouver — Design

## Objetivo
Criar um site independente de crítica, sátira e participação comunitária sobre a experiência de brasileiros com o atendimento consular em Vancouver. O site deve ser visualmente profissional, claramente não-oficial e usar humor para expor padrões de burocracia, demora e comunicação deficiente.

## Arquitetura
Primeira versão estática, sem framework e sem etapa obrigatória de build: HTML semântico, CSS responsivo e JavaScript ES modules. Relatos comunitários reais exigem backend e moderação; nesta fase, o formulário valida os dados, salva uma prévia apenas no navegador via localStorage e deixa uma interface de dados simples pronta para futura integração com API. Nenhum relato fictício será apresentado como depoimento real.

## Páginas
- `index.html`: hero, fluxo “Como funciona?”, clássicos, Índice Consulixo, formulário, relatos da comunidade e manifesto.
- `privacidade.html`: política de privacidade em linguagem clara.
- `termos.html`: termos de uso e regras de publicação/moderação.
- `contato.html`: contato e explicação do caráter independente.

## Identidade visual
- Paleta inspirada em verde/amarelo/azul do Brasil, com off-white de papel e preto editorial.
- Tipografia de sistema para carregamento imediato; títulos condensados visualmente por peso, tracking e caixa alta.
- Elementos de burocracia reinterpretados: carimbos, número de protocolo, fichas, linhas pontilhadas, avisos, status e formulários.
- Humor adulto, seco e inteligente; sem estética infantil, mascote ou excesso de emojis.

## Conteúdo e interação
- Hero com o texto fornecido pelo usuário e CTA “CONTE SUA HISTÓRIA”.
- “Como funciona?” em seis etapas.
- “Os clássicos” em cards satíricos.
- Índice Consulixo com cinco métricas visuais de 1 a 5, explicitamente editoriais/humorísticas e não apresentadas como pesquisa científica.
- Formulário com nome opcional, e-mail opcional, serviço, data, descrição, tempo de espera, resolução, avaliação e consentimento de publicação. Dados pessoais não são exibidos por padrão.
- Filtros de relatos por categoria. Sem backend, a área mostra estado vazio e relatos salvos localmente pelo próprio visitante como prévia, identificados como tal.
- Microinterações: carimbos, ticker de status, contador de protocolo local e feedback do formulário.

## Acessibilidade e qualidade
- HTML semântico, labels reais, foco visível, contraste adequado, `prefers-reduced-motion` e navegação por teclado.
- Responsivo de 360px a telas largas.
- Sem dependências externas necessárias para renderizar ou funcionar.
- Testes automatizados em Node para validação, sanitização/normalização, armazenamento e filtragem dos relatos.

## Limites desta versão
- Não envia relatos para um servidor.
- Não coleta analytics.
- Não inclui relatos reais sem fonte/consentimento.
- A futura API poderá substituir o adaptador local sem reescrever a interface.
