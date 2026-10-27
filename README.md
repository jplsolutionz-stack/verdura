# Verdura

Projeto editorial conceitual sobre arquitetura, construção e moradia. Não é uma empresa, imobiliária ou prestadora de serviços: os projetos são estudos ilustrativos e nada está à venda.

A página inicial abre com uma jornada visual: a casa é construída da base ao telhado, a câmera se aproxima da entrada e a porta abre revelando o próprio site, em HTML real.

## Rodar

```bash
npm install
npm run dev
```

Em desenvolvimento, `?motion=force` na URL ignora `prefers-reduced-motion`, para testar a jornada em máquinas com animações desligadas no sistema.

```bash
npm run build      # build em dist/
npm run deploy     # build com base /verdura/ e publicação no branch gh-pages
```

## Estrutura

- `src/data/`: conteúdo editorial (`content.ts`, `articles.ts`), projetos conceituais (`projects.ts`) e a sequência da jornada (`journey.ts`).
- `src/pages/`: rotas `/`, `/projetos`, `/projetos/:slug`, `/guia`, `/guia/:slug`, `/salvos`, `/sobre` e 404.
- `src/components/intro/`: jornada de abertura. `geometry.ts` mapeia o vão da porta do quadro 17 para a tela (cover em telas largas, contain em retrato) e monta o recorte `evenodd` que revela o site.
- `scripts/build-hero-media.mjs`: gera os derivados WebP (640, 960 e 1920 px) dos masters PNG.

Stack: React 19, TypeScript, Vite, React Router e Motion. Fonte: San Francisco nos aparelhos Apple (fonte do sistema) e Inter nos demais.

## Jornada

- **Desktop:** abertura com scroll nativo em 600svh, cerca de 23svh por quadro (obra, aproximação e porta), mais "Explorar o conteúdo", "Ver a construção" e "Ir direto ao conteúdo" desde o início. Esc, Tab para o conteúdo ou o fim do scroll concluem a introdução, que não volta durante a sessão.
- **Celular:** o conteúdo abre direto, com a casa pronta e a ação "Ver a construção" (28 s, pode pausar ou pular).
- **Movimento reduzido:** conteúdo direto, sem jornada nem download da sequência.
- **Falha de mídia:** a introdução é concluída e o aviso "A experiência em movimento não está disponível agora" aparece.

## Assets

17 quadros gerados com imagegen (pacote `verdura-informativo-spec-imagens`, ordem de `sequencia.json`), nativos em 1672 × 941 px:

1. Construção (11): terreno, fundações, base, paredes baixas, térreo com laje, paredes superiores parciais, paredes completas, telhado, acabamento parcial, acabamento avançado, casa pronta.
2. Aproximação (6): fachada, escada, degraus, porta fechada, entreaberta e aberta.

Os masters PNG ficam fora do repositório (`media-src/`, ignorado). Para regenerar os derivados, coloque os PNGs numerados em `media-src/` e rode `node scripts/build-hero-media.mjs`. Os estudos Pátio de Luz e Refúgio do Jardim usam plantas esquemáticas em SVG, fora de escala.

**Vídeo Higgsfield: pendente.** A conta usada não tinha plano com geração de vídeo. A jornada usa os quadros estáticos com transições no front-end; quando o vídeo existir, os quadros podem ser trocados por frames extraídos dele.

## Verificação (27/10/2026)

Testado em navegador real (Chrome e o navegador do Claude):

- Jornada no desktop: abertura, abertura da moldura, 11 etapas de obra, 6 de aproximação, porta revelando o HTML real pelo vão e conclusão no topo do conteúdo.
- "Explorar o conteúdo" e "Ir direto ao conteúdo": encerram a introdução na hora e levam o foco para `#conteudo`. Tab para dentro do conteúdo também encerra.
- Celular (390 px): conteúdo direto; "Ver a construção" reproduz a jornada em retrato com a imagem inteira e termina no conteúdo.
- Rotas: filtros e ordenação na URL, estado vazio, 404 de slug inválido, busca sem acento ("iluminacao"), âncoras em URL direta, salvos com aviso.
- Menu e gaveta de filtros: `<dialog>` modal, Esc fecha, o foco volta ao acionador.
- Sem rolagem horizontal em 320, 768 e 1024 px nas oito rotas.
- `tsc`, build e lint passam; o detector do Impeccable não apontou problemas.

Não medidos: LCP/CLS em perfil móvel, zoom de 200% e leitores de tela.
