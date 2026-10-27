import { AMBIENTES, CONFORTO, CONSTRUCTION_GROUPS, COST_QUESTIONS, CRITERIA, MATERIAIS } from './content'

export type ArticleSection = {
  id: string
  title: string
  paragraphs: string[]
  /** Destaque de observação ou pergunta, sempre visível. */
  aside?: { label: string; text: string }
  image?: { file: string; alt: string }
}

export type Article = {
  slug: string
  title: string
  headline: string
  summary: string
  themes: string[]
  keywords: string[]
  cover: { file: string; alt: string }
  intro: string[]
  sections: ArticleSection[]
  questions: string[]
  links: { to: string; label: string }[]
}

export const ARTICLES: Article[] = [
  {
    slug: 'como-uma-casa-e-construida',
    title: 'Como uma casa é construída',
    headline: 'Da primeira marcação aos últimos acabamentos.',
    summary:
      'Seis grupos de etapas, da preparação do terreno ao paisagismo, para reconhecer as partes de uma obra e como uma leva à outra.',
    themes: ['Etapas da obra'],
    keywords: ['obra', 'construção', 'fundação', 'laje', 'estrutura', 'cobertura', 'acabamento', 'etapas'],
    cover: { file: '05-terreo-laje', alt: 'Casa em obra: térreo de blocos com a laje intermediária apoiada nos pilares.' },
    intro: [
      'A construção reúne etapas que dependem umas das outras. A sequência visual ajuda a reconhecer essas partes e a perceber a passagem do terreno para uma residência concluída.',
      'A ordem apresentada é simplificada; sistemas construtivos e projetos diferentes podem organizar o trabalho de outras formas. Use este guia para aprender a olhar, não como roteiro de execução.',
    ],
    sections: [
      ...CONSTRUCTION_GROUPS.map((g) => ({
        id: g.id,
        title: g.title,
        paragraphs: [g.body],
        aside: { label: 'Observe no quadro', text: g.observe },
        image: { file: g.frames[g.frames.length - 1].file, alt: `Quadro da etapa: ${g.frames[g.frames.length - 1].label}.` },
      })),
      {
        id: 'como-ler',
        title: 'Como ler uma sequência de obra',
        paragraphs: [
          'Compare quadros vizinhos em vez de saltar do terreno para a casa pronta. A diferença entre duas imagens próximas mostra o que acabou de ser acrescentado e o que ainda falta.',
          'Procure o que permanece: a posição da entrada, o vão da garagem e o contorno da base acompanham toda a sequência. Essas constantes ajudam a entender como cada etapa prepara a seguinte.',
        ],
      },
    ],
    questions: [
      'O que já define a forma da casa antes de as paredes subirem?',
      'Quais vãos permanecem abertos do começo ao fim, e por quê?',
      'O que muda na leitura da fachada quando chegam os acabamentos?',
    ],
    links: [
      { to: '/#construcao', label: 'Rever as etapas na página inicial' },
      { to: '/guia/materiais', label: 'Materiais e suas relações' },
      { to: '/projetos/casa-entre-planos', label: 'Casa Entre Planos' },
    ],
  },
  {
    slug: 'guia-de-ambientes',
    title: 'Guia de ambientes',
    headline: 'O projeto continua depois da fachada.',
    summary: 'Entrada, estar, cozinha e jantar, quartos e áreas externas: o que observar em cada ambiente e que perguntas levar.',
    themes: ['Planta integrada', 'Luz e circulação'],
    keywords: ['ambientes', 'entrada', 'sala', 'estar', 'cozinha', 'jantar', 'quartos', 'privacidade', 'varanda', 'jardim', 'rotina', 'planta integrada'],
    cover: { file: '17-porta-aberta', alt: 'Porta aberta para o corredor iluminado que leva à sala.' },
    intro: [
      'Entender uma casa também significa observar os espaços por dentro. A posição dos ambientes, os percursos e as possibilidades de uso ajudam a relacionar o desenho com diferentes rotinas.',
      'Cada ambiente abaixo traz uma explicação e uma pergunta para observar. Elas funcionam em qualquer projeto, inclusive nos estudos conceituais deste portal.',
    ],
    sections: AMBIENTES.map((a) => ({
      id: a.id,
      title: a.title,
      paragraphs: [a.body],
      aside: a.question ? { label: 'Pergunta para observar', text: a.question } : undefined,
      image: a.image,
    })),
    questions: [
      'Quais percursos se repetem todos os dias, e eles atravessam lugares de permanência?',
      'O que fica visível da entrada?',
      'Cada área externa tem um uso que você consegue descrever?',
    ],
    links: [
      { to: '/projetos/patio-de-luz', label: 'Pátio de Luz: ambientes em volta de um pátio' },
      { to: '/projetos/refugio-do-jardim', label: 'Refúgio do Jardim: transições com o exterior' },
      { to: '/guia/luz-ventilacao-e-conforto', label: 'Luz, ventilação e conforto' },
    ],
  },
  {
    slug: 'materiais',
    title: 'Materiais e suas relações',
    headline: 'Texturas que ajudam a ler o conjunto.',
    summary: 'Madeira, pedra, vidro, concreto e vegetação: onde aparecem, com o que se relacionam e o que observar no uso.',
    themes: ['Materiais'],
    keywords: ['materiais', 'madeira', 'pedra', 'vidro', 'concreto', 'revestimento', 'vegetação', 'textura'],
    cover: { file: '14-entrada-degraus', alt: 'Entrada com pedra escura, forro de madeira, vidros laterais e degraus de pedra clara.' },
    intro: [
      'Um material participa da aparência e do uso de um espaço. Para compreendê-lo, observe onde foi aplicado, com quais superfícies se relaciona e que cuidados aquela aplicação pode exigir.',
      'As descrições abaixo não prometem desempenho ou durabilidade: isso depende de especificação, exposição e execução, que uma imagem não mostra.',
    ],
    sections: MATERIAIS.map((m) => ({ id: m.id, title: m.title, paragraphs: [m.body] })),
    questions: [
      'Onde dois materiais se encontram, e como esse encontro foi resolvido?',
      'O material está exposto ao tempo ou protegido?',
      'A luz revela a textura ou a achata?',
    ],
    links: [
      { to: '/projetos/casa-entre-planos', label: 'Casa Entre Planos: pedra, madeira e vidro' },
      { to: '/guia/como-uma-casa-e-construida', label: 'Como uma casa é construída' },
    ],
  },
  {
    slug: 'luz-ventilacao-e-conforto',
    title: 'Luz, ventilação e conforto',
    headline: 'Uma imagem bonita é o começo da observação.',
    summary: 'Como olhar aberturas, sombras e iluminação sem tirar conclusões que uma fotografia não sustenta.',
    themes: ['Luz e circulação'],
    keywords: ['luz natural', 'ventilação', 'iluminação', 'conforto', 'janelas', 'sombra', 'aberturas'],
    cover: { file: '12-entrada-fachada', alt: 'Fachada ao entardecer com janelas iluminadas e degraus com luz embutida.' },
    intro: [
      'Fotografias de arquitetura costumam ser feitas no melhor momento da luz. Elas mostram uma cena, não o comportamento de um ambiente ao longo do dia e do ano.',
      'Os três tópicos abaixo ajudam a separar o que a imagem mostra do que ela não permite concluir.',
    ],
    sections: CONFORTO.map((c) => ({
      id: c.id,
      title: c.title,
      paragraphs: [c.body],
      aside: c.question ? { label: 'Pergunta útil', text: c.question } : undefined,
    })),
    questions: [
      'Que horário e estação a imagem parece mostrar?',
      'Que informação de orientação do terreno falta para avaliar a luz?',
      'A iluminação artificial orienta o percurso ou só decora?',
    ],
    links: [
      { to: '/projetos/patio-de-luz', label: 'Pátio de Luz' },
      { to: '/guia/guia-de-ambientes', label: 'Guia de ambientes' },
    ],
  },
  {
    slug: 'como-comparar-projetos',
    title: 'Como comparar projetos',
    headline: 'Compare escolhas, não apenas imagens.',
    summary: 'Critérios para comparar referências e as perguntas que vêm antes de qualquer conversa sobre custo.',
    themes: ['Planta integrada', 'Etapas da obra'],
    keywords: ['comparar', 'comparação', 'critérios', 'custo', 'preço', 'área', 'escala', 'privacidade'],
    cover: { file: '11-casa-pronta', alt: 'Vista frontal da casa concluída, com garagem e jardim.' },
    intro: [
      'Projetos podem responder de maneiras diferentes às mesmas necessidades. Ao comparar referências, procure critérios que tenham relação com o que você deseja entender: distribuição, espaços externos, privacidade, acessos e materiais.',
    ],
    sections: [
      ...CRITERIA.map((c) => ({ id: c.title.toLowerCase().replace(/\s+/g, '-'), title: c.title, paragraphs: [c.body] })),
      {
        id: 'custo',
        title: 'O custo não está só no tamanho',
        paragraphs: [
          'Área, sistema construtivo, condições do terreno, complexidade do projeto, materiais e localização podem participar da composição de custos. Duas casas com áreas semelhantes podem reunir escolhas e condições muito diferentes.',
          'Uma imagem não contém todas as informações necessárias para estimar uma obra. Por isso, este portal não atribui preços de mercado aos projetos conceituais. O objetivo é ajudar a reconhecer quais perguntas precisam ser feitas antes de uma comparação de valores.',
        ],
      },
    ],
    questions: COST_QUESTIONS,
    links: [
      { to: '/#comparar', label: 'Comparar projetos conceituais' },
      { to: '/projetos', label: 'Ver todos os projetos' },
    ],
  },
]

export const findArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug)
