// Conteúdo editorial da home, de COPY-SITE.md. A Verdura é um projeto conceitual, não uma empresa.

export const EDITORIAL_NOTICE =
  'Os projetos e as imagens apresentados são conceituais. Este é um espaço informativo sobre arquitetura e moradia.'

export const SEARCH_SUGGESTIONS = ['Luz natural', 'Planta integrada', 'Materiais', 'Etapas da obra']

export type ConstructionGroup = {
  id: string
  title: string
  body: string
  observe: string
  /** Arquivos dos quadros da jornada que ilustram o grupo, em ordem. */
  frames: { file: string; label: string }[]
}

export const CONSTRUCTION_GROUPS: ConstructionGroup[] = [
  {
    id: 'fundacoes',
    title: 'Preparação e fundações',
    body: 'O terreno recebe as marcações que orientam a posição da construção. As fundações fazem a ligação entre a estrutura e o solo, conforme as condições do terreno e as definições do projeto. Nos primeiros quadros, aparecem as valas, as armações e os elementos iniciais da base.',
    observe: 'O contorno da futura casa já começa a ser reconhecido antes de qualquer parede subir.',
    frames: [
      { file: '01-terreno', label: 'Terreno marcado' },
      { file: '02-fundacoes', label: 'Fundações e armações' },
    ],
  },
  {
    id: 'base',
    title: 'Base e início das paredes',
    body: 'Com a base formada, os ambientes começam a ganhar limites. As primeiras fiadas de blocos permitem enxergar percursos, aberturas e divisões que antes existiam apenas na marcação.',
    observe: 'A entrada principal e o espaço da garagem continuam livres, enquanto as paredes começam a definir os demais trechos.',
    frames: [
      { file: '03-base', label: 'Base concluída' },
      { file: '04-paredes-baixas', label: 'Primeiras fiadas' },
    ],
  },
  {
    id: 'estrutura',
    title: 'Estrutura e pavimentos',
    body: 'Pilares, vigas e lajes participam da organização estrutural da casa. Na sequência ilustrada, o térreo se completa antes do avanço das paredes superiores. A laje intermediária separa os pavimentos e recebe a etapa seguinte.',
    observe: 'O volume da casa cresce por partes apoiadas, mantendo os vãos de acesso e a relação entre os andares.',
    frames: [
      { file: '05-terreo-laje', label: 'Térreo e laje' },
      { file: '06-paredes-superiores', label: 'Paredes superiores' },
      { file: '07-paredes-completas', label: 'Pavimento superior' },
    ],
  },
  {
    id: 'cobertura',
    title: 'Cobertura',
    body: 'A cobertura conclui a parte superior do edifício e participa da proteção dos ambientes. Seu desenho também influencia a leitura da fachada, com bordas, recuos e balanços que se relacionam com os volumes abaixo.',
    observe: 'O telhado aparece depois das paredes e da estrutura de apoio. O plano superior da casa fica claramente definido.',
    frames: [{ file: '08-telhado', label: 'Cobertura' }],
  },
  {
    id: 'acabamentos',
    title: 'Acabamentos',
    body: 'Revestimentos, esquadrias, portas e pintura transformam a aparência do conjunto. O mesmo volume passa a apresentar texturas, reflexos e contrastes que ajudam a distinguir entrada, paredes e áreas abertas.',
    observe: 'A diferença entre a alvenaria aparente da obra, o acabamento parcial e a fachada quase concluída.',
    frames: [
      { file: '09-acabamento-parcial', label: 'Acabamento parcial' },
      { file: '10-acabamento-avancado', label: 'Acabamento avançado' },
    ],
  },
  {
    id: 'paisagismo',
    title: 'Acesso, iluminação e paisagismo',
    body: 'Os últimos quadros mostram a finalização dos caminhos e a relação da casa com os espaços externos. Iluminação e vegetação ajudam a compor a chegada e a reconhecer áreas de passagem e permanência.',
    observe: 'Como a escada, a luz e o jardim direcionam o olhar para a entrada sem esconder o desenho da casa.',
    frames: [
      { file: '11-casa-pronta', label: 'Casa pronta' },
      { file: '12-entrada-fachada', label: 'Chegada pela escada' },
    ],
  },
]

export type Topic = { id: string; title: string; body: string; question?: string; image?: { file: string; alt: string } }

export const AMBIENTES: Topic[] = [
  {
    id: 'entrada',
    title: 'Entrada',
    body: 'A chegada conecta o exterior ao interior. É um lugar para observar orientação, proteção, visibilidade e a passagem entre espaços públicos e privados. A porta, os degraus e os materiais podem tornar esse percurso mais legível.',
    question: 'Ao chegar, é fácil reconhecer onde entrar e como seguir para os outros ambientes?',
    image: { file: '15-porta-fechada', alt: 'Porta de madeira entre vidros laterais, sob forro de madeira, com degraus iluminados.' },
  },
  {
    id: 'estar',
    title: 'Estar e convivência',
    body: 'A área de estar reúne atividades que variam ao longo do dia: conversar, ler, receber ou descansar. A disposição dos móveis e a passagem entre os ambientes ajudam a entender se essas atividades podem coexistir.',
    question: 'Os percursos atravessam as áreas de permanência ou existem caminhos claros ao redor delas?',
    image: { file: '17-porta-aberta', alt: 'Vista pela porta aberta: corredor iluminado que termina na sala de estar.' },
  },
  {
    id: 'cozinha',
    title: 'Cozinha e jantar',
    body: 'A relação entre preparo e refeições pode ser mais integrada ou mais separada. Para observar essa escolha, vale pensar nos percursos, nas superfícies de apoio e na relação com os demais ambientes.',
    question: 'Como alguém se desloca entre preparar, servir e sentar à mesa?',
  },
  {
    id: 'quartos',
    title: 'Quartos e privacidade',
    body: 'Os quartos pedem uma leitura que considere descanso, circulação e relação com as áreas de convivência. A posição das portas e janelas também participa da sensação de privacidade.',
    question: 'Que caminhos conectam os quartos aos outros espaços e o que fica exposto quando a porta está aberta?',
  },
  {
    id: 'externas',
    title: 'Áreas externas',
    body: 'Varandas, pátios e jardins podem funcionar como passagem, extensão de um ambiente ou lugar de permanência. Cobertura, orientação e relação com o interior mudam a maneira de usar esses espaços.',
    question: 'A área externa tem um uso claro ou aparece apenas como cenário na imagem?',
  },
]

export const MATERIAIS: Topic[] = [
  {
    id: 'madeira',
    title: 'Madeira',
    body: 'A madeira pode aparecer em portas, painéis, forros e detalhes. A direção das peças e o ritmo dos elementos ajudam a perceber escala e continuidade. Condições de exposição e especificação influenciam seus cuidados ao longo do tempo.',
  },
  {
    id: 'pedra',
    title: 'Pedra',
    body: 'A pedra acrescenta textura e variação às superfícies. No projeto ilustrado, ela destaca um plano vertical junto à entrada. Observe juntas, encontros e a forma como a iluminação revela o relevo e o desenho da superfície.',
  },
  {
    id: 'vidro',
    title: 'Vidro',
    body: 'O vidro pode criar relações de vista entre ambientes e exterior. Transparência, reflexos e enquadramentos mudam a percepção do espaço. Uma grande área envidraçada, sozinha, não permite concluir como será o conforto do ambiente.',
  },
  {
    id: 'concreto',
    title: 'Concreto e superfícies revestidas',
    body: 'Planos de concreto e superfícies com revestimento podem formar volumes contínuos ou destacar partes do edifício. Bordas, espessuras e encontros ajudam a identificar a intenção do desenho, além da cor escolhida.',
  },
  {
    id: 'vegetacao',
    title: 'Vegetação',
    body: 'A vegetação participa da leitura de caminhos, limites e áreas de permanência. Porte, posição e desenvolvimento das plantas precisam ser considerados para além da aparência do primeiro dia.',
  },
]

export const CONFORTO: Topic[] = [
  {
    id: 'luz-natural',
    title: 'Luz natural',
    body: 'Janelas, aberturas e áreas cobertas ajudam a perceber as relações de luz no projeto. Observe a profundidade dos ambientes, a posição das aberturas e a presença de elementos que produzem sombra. O comportamento ao longo do dia depende de informações que uma única imagem não mostra.',
    question: 'Para onde as aberturas estão voltadas, e o que as protege do sol mais forte?',
  },
  {
    id: 'ventilacao',
    title: 'Ventilação',
    body: 'A leitura das aberturas pode levantar perguntas sobre entrada e saída de ar, conexão entre ambientes e possibilidades de uso. Não é possível confirmar o desempenho da ventilação apenas pela aparência da fachada.',
    question: 'Existem aberturas em lados diferentes de um mesmo ambiente ou de ambientes conectados?',
  },
  {
    id: 'iluminacao',
    title: 'Iluminação artificial',
    body: 'A luz artificial pode orientar percursos, destacar texturas e apoiar atividades. Na casa ilustrada, os degraus e a entrada ficam mais legíveis com a iluminação do entardecer. Observe se a luz ajuda a entender o espaço, além de produzir um efeito visual.',
    question: 'A luz mostra onde pisar e por onde entrar, ou só valoriza a fotografia?',
  },
]

export const CRITERIA = [
  { title: 'Organização', body: 'Como os ambientes se conectam e quais percursos são necessários?' },
  { title: 'Relação com o exterior', body: 'Onde existem aberturas, áreas cobertas e lugares de permanência?' },
  { title: 'Privacidade', body: 'O que fica visível a partir da entrada e das áreas de convivência?' },
  { title: 'Materiais', body: 'Como as superfícies se encontram e em que condições serão usadas?' },
  {
    title: 'Escala',
    body: 'As dimensões informadas fazem sentido para a leitura proposta? Quando forem fictícias, devem estar identificadas como ilustrativas.',
  },
]

export const COST_QUESTIONS = [
  'O terreno exige soluções específicas?',
  'O projeto possui grandes vãos ou volumes complexos?',
  'Os materiais têm diferentes exigências de aplicação?',
  'Que itens estão incluídos no valor apresentado?',
]

export const GLOSSARY = [
  { term: 'Fundação', def: 'Conjunto de elementos que faz a ligação da estrutura com o solo, conforme o projeto.' },
  { term: 'Estrutura', def: 'Sistema de elementos que recebe e transmite as ações que atuam na edificação.' },
  { term: 'Vedação', def: 'Elemento que delimita ou separa espaços. Sua função e relação com a estrutura dependem do sistema construtivo.' },
  { term: 'Laje', def: 'Elemento geralmente plano que pode separar pavimentos ou participar da cobertura, conforme o projeto.' },
  { term: 'Cobertura', def: 'Conjunto que compõe a parte superior de proteção da edificação.' },
  { term: 'Esquadria', def: 'Conjunto de peças que compõe portas, janelas e outros fechamentos de vãos.' },
  { term: 'Revestimento', def: 'Camada aplicada sobre uma superfície com funções que dependem do material e do uso.' },
  {
    term: 'Área construída',
    def: 'Informação de área que precisa ser lida com seu critério de medição e contexto. Não deve ser confundida automaticamente com área de terreno ou área privativa.',
  },
  { term: 'Circulação', def: 'Percursos e espaços que conectam os ambientes.' },
]

export const FAQ = [
  {
    q: 'A Verdura é uma empresa real?',
    a: 'Não. A Verdura é um projeto editorial conceitual para apresentar conteúdos sobre arquitetura, construção e moradia.',
  },
  {
    q: 'Os projetos estão à venda?',
    a: 'Não. As fichas são referências e estudos ilustrativos. O site não anuncia disponibilidade de imóveis nem intermedeia negócios.',
  },
  {
    q: 'A animação mostra uma obra real?',
    a: 'Não. As imagens foram criadas para ilustrar uma sequência simplificada de construção e uma experiência visual de entrada na casa.',
  },
  {
    q: 'A sequência é igual em qualquer obra?',
    a: 'Não. Sistema construtivo, projeto e condições de execução podem alterar a organização das etapas. A sequência do site serve para reconhecer visualmente algumas dessas partes.',
  },
  {
    q: 'Posso confirmar áreas e medidas pelas imagens?',
    a: 'Não. Uma perspectiva não permite obter todas as medidas com precisão. Parâmetros fictícios de estudos devem estar acompanhados da indicação “Dimensões ilustrativas”.',
  },
  {
    q: 'Preciso assistir à animação para ler o conteúdo?',
    a: 'Não. Use “Explorar o conteúdo” ou “Ir direto ao conteúdo” a qualquer momento, ou a tecla Esc. A animação é uma abertura opcional.',
  },
  {
    q: 'Como funcionam os itens salvos?',
    a: 'Os projetos e artigos ficam salvos neste navegador. Não é necessário criar uma conta, e os itens não são sincronizados entre dispositivos.',
  },
  {
    q: 'De onde vêm as imagens?',
    a: 'As imagens da jornada da casa são visualizações geradas e refinadas com IA. Referências fornecidas pelo usuário orientam a composição e ficam separadas dos projetos apresentados no portal.',
  },
]

export const MESSAGES = {
  searchEmpty: 'Digite um tema ou explore os conteúdos em destaque.',
  noResults: 'Não encontramos conteúdos com essa combinação. Tente outro termo ou limpe os filtros.',
  savedEmpty: 'Suas referências começam aqui. Salve um projeto ou artigo para encontrar novamente neste navegador.',
  saved: 'Referência salva neste navegador.',
  removed: 'Referência removida dos salvos.',
  storageFailed: 'Não foi possível manter este item salvo após fechar a página. Você pode continuar explorando normalmente.',
  mediaUnavailable: 'A experiência em movimento não está disponível agora. O conteúdo continua acessível abaixo.',
  notFound: 'Este conteúdo não foi encontrado. Volte aos projetos ou explore o guia.',
}
