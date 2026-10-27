export type ProjectImage =
  | { kind: 'photo'; file: string; alt: string; isGenerated: true }
  | { kind: 'plan'; plan: 'patio' | 'jardim'; alt: string }

export type ConceptProject = {
  id: string
  slug: string
  title: string
  badge: string
  type: 'casa' | 'estudo'
  typeLabel: string
  isConcept: true
  /** Parâmetro do estudo de layout, nunca medição tirada da imagem. */
  areaM2: number
  bedrooms: number
  outdoor: string
  integration: string
  materials: string[]
  themes: string[]
  keywords: string[]
  summary: string
  meta: string[]
  observe: string
  action: string
  rooms: string[]
  observationPoints: { title: string; body: string }[]
  images: ProjectImage[]
  related: string[]
}

export const PROJECTS: ConceptProject[] = [
  {
    id: 'p1',
    slug: 'casa-entre-planos',
    title: 'Casa Entre Planos',
    badge: 'Projeto conceitual',
    type: 'casa',
    typeLabel: 'Residência de dois pavimentos',
    isConcept: true,
    areaM2: 240,
    bedrooms: 3,
    outdoor: 'Jardim frontal e varanda no pavimento superior',
    integration: 'Estar e jantar integrados no térreo',
    materials: ['Pedra', 'Madeira', 'Vidro'],
    themes: ['Entrada e fachada', 'Materiais'],
    keywords: ['escada', 'porta', 'recuo', 'iluminação', 'garagem', 'construção', 'etapas da obra'],
    summary:
      'Volumes claros, pedra escura e madeira criam uma entrada marcada por profundidade. A escada e o paisagismo conduzem o olhar até a porta, enquanto o pavimento superior acrescenta sombra e diferentes planos à fachada.',
    meta: ['Residência de dois pavimentos', 'Materiais: pedra, madeira e vidro', 'Tema: entrada e fachada'],
    observe: 'Como a posição da porta, os recuos e a iluminação ajudam a identificar o acesso principal.',
    action: 'Explorar o projeto',
    rooms: ['Entrada com escada', 'Estar e jantar', 'Cozinha', 'Três quartos', 'Varanda superior', 'Garagem'],
    observationPoints: [
      {
        title: 'A entrada se anuncia sem placa',
        body: 'A porta de madeira fica entre dois vidros laterais, sob um forro também de madeira. O recuo cria sombra e diferencia o acesso dos planos claros ao redor.',
      },
      {
        title: 'Planos em profundidades diferentes',
        body: 'O volume superior avança sobre o térreo, a pedra marca um plano vertical e a garagem recua. Cada camada muda a leitura da fachada conforme a luz.',
      },
      {
        title: 'A luz desenha o percurso',
        body: 'Os degraus iluminados e as arandelas junto à porta tornam a chegada legível ao entardecer. Vale observar se a luz orienta o caminho ou só produz efeito.',
      },
    ],
    images: [
      { kind: 'photo', file: '12-entrada-fachada', alt: 'Fachada da casa ao entardecer, com escada iluminada, pedra escura e porta de madeira.', isGenerated: true },
      { kind: 'photo', file: '11-casa-pronta', alt: 'Vista frontal da casa a partir da rua, com garagem, jardim e pavimento superior recuado.', isGenerated: true },
      { kind: 'photo', file: '14-entrada-degraus', alt: 'Degraus de pedra clara levando à porta de madeira entre vidros laterais.', isGenerated: true },
      { kind: 'photo', file: '17-porta-aberta', alt: 'Porta aberta revelando o corredor iluminado e a sala ao fundo.', isGenerated: true },
    ],
    related: ['como-uma-casa-e-construida', 'materiais'],
  },
  {
    id: 'p2',
    slug: 'patio-de-luz',
    title: 'Pátio de Luz',
    badge: 'Estudo de organização espacial',
    type: 'estudo',
    typeLabel: 'Estudo conceitual de térreo',
    isConcept: true,
    areaM2: 180,
    bedrooms: 2,
    outdoor: 'Pátio central descoberto',
    integration: 'Estar, jantar e cozinha voltados ao pátio',
    materials: ['Vidro', 'Concreto', 'Vegetação'],
    themes: ['Luz e circulação', 'Planta integrada'],
    keywords: ['pátio', 'luz natural', 'circulação', 'planta', 'ventilação', 'percurso'],
    summary:
      'Um pátio pode aproximar os ambientes de uma área aberta e criar diferentes relações de luz, vista e circulação. Este estudo apresenta perguntas para avaliar essa organização, sem pressupor que uma única planta funcione para todas as rotinas.',
    meta: ['Estudo conceitual', 'Tema: luz e circulação', 'Leitura: relação entre ambientes'],
    observe: 'Quais espaços se abrem para o pátio e como os percursos conectam as áreas da casa.',
    action: 'Conhecer o estudo',
    rooms: ['Entrada', 'Estar', 'Jantar e cozinha', 'Dois quartos', 'Pátio central'],
    observationPoints: [
      {
        title: 'O pátio organiza os percursos',
        body: 'No esquema, a circulação contorna o pátio. Isso pode deixar o centro livre para permanência, mas alonga alguns trajetos. A pergunta é quais caminhos se repetem no dia a dia.',
      },
      {
        title: 'Luz que chega por mais de um lado',
        body: 'Ambientes voltados ao pátio podem receber luz de duas direções. O comportamento real depende de orientação, altura das paredes e proteção das aberturas, que um esquema não mostra.',
      },
      {
        title: 'Privacidade em volta de um vazio',
        body: 'Quando tudo se abre para o mesmo pátio, o que se vê de um quarto a partir da sala? Observe as posições de portas e janelas no desenho.',
      },
    ],
    images: [
      { kind: 'plan', plan: 'patio', alt: 'Planta esquemática: ambientes dispostos em volta de um pátio central, com circulação contornando o vazio.' },
    ],
    related: ['guia-de-ambientes', 'luz-ventilacao-e-conforto'],
  },
  {
    id: 'p3',
    slug: 'refugio-do-jardim',
    title: 'Refúgio do Jardim',
    badge: 'Estudo de áreas externas',
    type: 'estudo',
    typeLabel: 'Estudo conceitual de implantação',
    isConcept: true,
    areaM2: 150,
    bedrooms: 2,
    outdoor: 'Varanda coberta, deque e jardim em camadas',
    integration: 'Estar aberto para a varanda',
    materials: ['Madeira', 'Vegetação', 'Pedra'],
    themes: ['Exterior e paisagismo'],
    keywords: ['jardim', 'varanda', 'sombra', 'paisagismo', 'transição', 'exterior'],
    summary:
      'A relação com o jardim pode começar antes da entrada e continuar pelas janelas e varandas. Este estudo explora transições entre áreas abertas e cobertas, com atenção aos usos de cada espaço.',
    meta: ['Estudo conceitual', 'Tema: exterior e paisagismo', 'Leitura: transições de uso'],
    observe: 'Onde existem sombra, permanência e passagem, e como essas funções se relacionam.',
    action: 'Explorar as relações com o jardim',
    rooms: ['Caminho de chegada', 'Estar', 'Varanda coberta', 'Dois quartos', 'Deque e jardim'],
    observationPoints: [
      {
        title: 'Coberto, semicoberto e aberto',
        body: 'O esquema separa a varanda coberta, uma faixa de transição e o jardim. Cada faixa sugere um uso diferente: ficar, passar ou apenas olhar.',
      },
      {
        title: 'O jardim começa na chegada',
        body: 'O caminho de entrada atravessa canteiros antes da porta. Vale observar se a vegetação orienta o percurso ou se esconde o acesso.',
      },
      {
        title: 'Plantas mudam com o tempo',
        body: 'Porte, posição e crescimento alteram sombra e passagem. O desenho de hoje é um ponto de partida, não o jardim de daqui a alguns anos.',
      },
    ],
    images: [
      { kind: 'plan', plan: 'jardim', alt: 'Planta esquemática de implantação: casa, varanda coberta, deque e jardim em faixas sucessivas.' },
    ],
    related: ['guia-de-ambientes', 'materiais'],
  },
]

export const PROJECT_TYPES = [
  { value: 'casa', label: 'Casa' },
  { value: 'estudo', label: 'Estudo' },
]

export const AREA_RANGES = [
  { value: 'ate-160', label: 'Até 160 m²', test: (a: number) => a <= 160 },
  { value: '160-220', label: 'De 160 a 220 m²', test: (a: number) => a > 160 && a <= 220 },
  { value: 'acima-220', label: 'Acima de 220 m²', test: (a: number) => a > 220 },
]

export const THEMES = ['Entrada e fachada', 'Luz e circulação', 'Planta integrada', 'Exterior e paisagismo', 'Materiais']

export const findProject = (slug: string) => PROJECTS.find((p) => p.slug === slug)
