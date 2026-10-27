import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ProjectCard } from '../components/ProjectCard'
import { Frame, useTitle } from '../components/ui'
import {
  AMBIENTES,
  CONFORTO,
  CONSTRUCTION_GROUPS,
  COST_QUESTIONS,
  CRITERIA,
  EDITORIAL_NOTICE,
  FAQ,
  GLOSSARY,
  MATERIAIS,
  SEARCH_SUGGESTIONS,
} from '../data/content'
import { PROJECTS } from '../data/projects'
import { useIntro } from '../lib/intro'
import { matches } from '../lib/text'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

export function Home() {
  useTitle('')
  return (
    <>
      <ContentHero />
      <ProjectsSection />
      <ConstructionSection />
      <AmbientesSection />
      <MateriaisSection />
      <ConfortoSection />
      <CompareSection />
      <CostSection />
      <GlossarySection />
      <FaqSection />
      <ClosingSection />
    </>
  )
}

function ContentHero() {
  const navigate = useNavigate()
  const { play } = useIntro()
  const id = useId()
  const [query, setQuery] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
    const q = query.trim()
    navigate(q ? `/guia?q=${encodeURIComponent(q)}` : '/guia')
  }

  return (
    <section className="chapter chapter--ink content-hero" aria-labelledby="titulo-home">
      <div className="container content-hero__grid">
        <div className="content-hero__text">
          <h1 id="titulo-home">Conheça a arquitetura por trás de cada espaço.</h1>
          <p className="lede">
            Uma fachada chama a atenção. A distribuição dos ambientes, a entrada de luz e a escolha dos materiais
            ajudam a entender como aquela casa pode ser vivida. Aqui, você encontra projetos conceituais e explicações
            para olhar além da primeira imagem.
          </p>
          <div className="actions">
            <Link className="button button--light" to="/projetos">
              Explorar projetos
            </Link>
            <a className="text-link" href="#construcao">
              Entender a construção
            </a>
          </div>
        </div>
        <figure className="content-hero__media">
          <Frame
            file="11-casa-pronta"
            alt="Casa conceitual concluída ao entardecer, vista da rua, com garagem, jardim e pavimento superior."
            sizes="(min-width: 1024px) 55vw, 100vw"
            loading="eager"
            fetchPriority="high"
          />
          <figcaption>
            <span>Visualização arquitetônica conceitual.</span>
            <button type="button" className="text-button" onClick={play}>
              Ver a construção
            </button>
          </figcaption>
        </figure>
      </div>

      <div className="container">
        <form className="search-panel" role="search" onSubmit={submit}>
          <label htmlFor={`${id}-q`} className="search-panel__label">
            O que você quer conhecer?
          </label>
          <div className="search-panel__row">
            <input
              id={`${id}-q`}
              type="search"
              placeholder="Busque por ambientes, materiais ou etapas da obra"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="button">
              Buscar
            </button>
          </div>
          <ul className="suggestions" aria-label="Sugestões de busca">
            {SEARCH_SUGGESTIONS.map((s) => (
              <li key={s}>
                <Link to={`/guia?q=${encodeURIComponent(s)}`}>{s}</Link>
              </li>
            ))}
          </ul>
        </form>
        <p className="notice notice--on-ink">{EDITORIAL_NOTICE}</p>
      </div>
    </section>
  )
}

function ProjectsSection() {
  const [first, ...rest] = PROJECTS
  return (
    <section className="chapter" aria-labelledby="titulo-projetos">
      <div className="container">
        <div className="section-head">
          <h2 id="titulo-projetos">Cada projeto revela um jeito de organizar a vida.</h2>
          <p>
            Explore as relações entre fachada, ambientes e áreas externas. As fichas destacam escolhas de projeto e
            pontos que merecem um olhar mais próximo.
          </p>
          <Link className="text-link" to="/projetos">
            Ver todos os projetos
          </Link>
        </div>
        <div className="projects-feature">
          <ProjectCard project={first} large />
          <div className="projects-feature__side">
            {rest.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ConstructionSection() {
  const [group, setGroup] = useState(0)
  const [frame, setFrame] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const current = CONSTRUCTION_GROUPS[group]
  const shown = current.frames[Math.min(frame, current.frames.length - 1)]

  function select(index: number) {
    setGroup(index)
    setFrame(current.frames.length && index === group ? frame : CONSTRUCTION_GROUPS[index].frames.length - 1)
  }

  // Padrão de abas: setas percorrem as etapas, Home e End vão às pontas.
  function onKeyDown(event: KeyboardEvent) {
    const last = CONSTRUCTION_GROUPS.length - 1
    const map: Record<string, number> = {
      ArrowRight: group === last ? 0 : group + 1,
      ArrowDown: group === last ? 0 : group + 1,
      ArrowLeft: group === 0 ? last : group - 1,
      ArrowUp: group === 0 ? last : group - 1,
      Home: 0,
      End: last,
    }
    if (!(event.key in map)) return
    event.preventDefault()
    select(map[event.key])
    tabs.current[map[event.key]]?.focus()
  }

  return (
    <section id="construcao" className="chapter chapter--sage" aria-labelledby="titulo-construcao">
      <div className="container">
        <div className="section-head">
          <h2 id="titulo-construcao">Da primeira marcação aos últimos acabamentos.</h2>
          <p>
            A construção reúne etapas que dependem umas das outras. A sequência visual ajuda a reconhecer essas partes
            e a perceber a passagem do terreno para uma residência concluída. A ordem apresentada é simplificada;
            sistemas construtivos e projetos diferentes podem organizar o trabalho de outras formas.
          </p>
        </div>

        <div className="stepper">
          <div className="stepper__tabs">
            <p className="stepper__label" id="rever-etapa">
              Rever uma etapa
            </p>
            <div role="tablist" aria-labelledby="rever-etapa" aria-orientation="vertical" onKeyDown={onKeyDown}>
              {CONSTRUCTION_GROUPS.map((g, i) => (
                <button
                  key={g.id}
                  ref={(el) => {
                    tabs.current[i] = el
                  }}
                  role="tab"
                  id={`etapa-${g.id}`}
                  aria-selected={i === group}
                  aria-controls="painel-etapa"
                  tabIndex={i === group ? 0 : -1}
                  className="stepper__tab"
                  onClick={() => select(i)}
                >
                  <span className="stepper__index">{i + 1}</span>
                  {g.title}
                </button>
              ))}
            </div>
          </div>

          <div className="stepper__panel" role="tabpanel" id="painel-etapa" aria-labelledby={`etapa-${current.id}`}>
            <div className="stepper__media">
              <AnimatePresence initial={false}>
                <motion.div
                  key={shown.file}
                  className="stepper__image"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.3, ease: EASE_OUT } }}
                  exit={{ opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } }}
                >
                  <Frame file={shown.file} alt={`Quadro da sequência: ${shown.label}.`} sizes="(min-width: 1024px) 60vw, 100vw" />
                </motion.div>
              </AnimatePresence>
            </div>
            {current.frames.length > 1 && (
              <div className="stepper__frames" role="group" aria-label="Quadros desta etapa">
                {current.frames.map((f, i) => (
                  <button
                    key={f.file}
                    type="button"
                    className="stepper__thumb"
                    aria-pressed={f.file === shown.file}
                    onClick={() => setFrame(i)}
                  >
                    <Frame file={f.file} alt="" sizes="160px" />
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            )}
            <h3>{current.title}</h3>
            <p>{current.body}</p>
            <p className="observe">
              <span>Observe no quadro</span>
              {current.observe}
            </p>
            <Link className="text-link" to="/guia/como-uma-casa-e-construida">
              Ler o guia completo da construção
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function AmbientesSection() {
  return (
    <section className="chapter" aria-labelledby="titulo-ambientes">
      <div className="container">
        <div className="section-head">
          <h2 id="titulo-ambientes">O projeto continua depois da fachada.</h2>
          <p>
            Entender uma casa também significa observar os espaços por dentro. A posição dos ambientes, os percursos e
            as possibilidades de uso ajudam a relacionar o desenho com diferentes rotinas.
          </p>
        </div>
        <div className="rooms">
          {AMBIENTES.map((a) => (
            <article key={a.id} className={`room${a.image ? ' room--media' : ''}`}>
              {a.image && <Frame file={a.image.file} alt={a.image.alt} sizes="(min-width: 1024px) 40vw, 100vw" />}
              <div className="room__text">
                <h3>{a.title}</h3>
                <p>{a.body}</p>
                <p className="observe">
                  <span>Pergunta para observar</span>
                  {a.question}
                </p>
                <Link className="text-link" to={`/guia/guia-de-ambientes#${a.id}`}>
                  Ler sobre {a.title.toLowerCase()}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function MateriaisSection() {
  return (
    <section className="chapter chapter--sage" aria-labelledby="titulo-materiais">
      <div className="container materials">
        <div className="materials__media">
          <Frame
            file="12-entrada-fachada"
            alt="Fachada ao entardecer: plano de pedra escura, forro e brises de madeira, vidros e guarda-corpo de vidro."
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        </div>
        <div className="materials__text">
          <h2 id="titulo-materiais">Texturas que ajudam a ler o conjunto.</h2>
          <p className="lede">
            Um material participa da aparência e do uso de um espaço. Para compreendê-lo, observe onde foi aplicado,
            com quais superfícies se relaciona e que cuidados aquela aplicação pode exigir.
          </p>
          <dl className="definition-list">
            {MATERIAIS.map((m) => (
              <div key={m.id}>
                <dt>{m.title}</dt>
                <dd>{m.body}</dd>
              </div>
            ))}
          </dl>
          <Link className="text-link" to="/guia/materiais">
            Ler o guia de materiais
          </Link>
        </div>
      </div>
    </section>
  )
}

function ConfortoSection() {
  return (
    <section className="chapter chapter--ink" aria-labelledby="titulo-conforto">
      <div className="container">
        <div className="section-head">
          <h2 id="titulo-conforto">Uma imagem bonita é o começo da observação.</h2>
        </div>
        <div className="columns">
          {CONFORTO.map((c) => (
            <article key={c.id}>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <p className="observe observe--on-ink">
                <span>Pergunta útil</span>
                {c.question}
              </p>
            </article>
          ))}
        </div>
        <Link className="text-link" to="/guia/luz-ventilacao-e-conforto">
          Ler o guia de luz, ventilação e conforto
        </Link>
      </div>
    </section>
  )
}

const MAX_COMPARE = 3

function CompareSection() {
  const [selected, setSelected] = useState<string[]>([])
  const chosen = PROJECTS.filter((p) => selected.includes(p.id))

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : prev.length >= MAX_COMPARE ? prev : [...prev, id],
    )
  }

  const rows: { label: string; value: (p: (typeof PROJECTS)[number]) => string }[] = [
    { label: 'Tipo', value: (p) => p.typeLabel },
    { label: 'Área construída', value: (p) => `${p.areaM2} m²` },
    { label: 'Quartos', value: (p) => String(p.bedrooms) },
    { label: 'Espaços externos', value: (p) => p.outdoor },
    { label: 'Integração', value: (p) => p.integration },
    { label: 'Materiais', value: (p) => p.materials.join(', ') },
    { label: 'O que observar', value: (p) => p.observe },
  ]

  return (
    <section id="comparar" className="chapter" aria-labelledby="titulo-comparar">
      <div className="container">
        <div className="section-head">
          <h2 id="titulo-comparar">Compare escolhas, não apenas imagens.</h2>
          <p>
            Projetos podem responder de maneiras diferentes às mesmas necessidades. Ao comparar referências, procure
            critérios que tenham relação com o que você deseja entender: distribuição, espaços externos, privacidade,
            acessos e materiais.
          </p>
        </div>
        <dl className="criteria">
          {CRITERIA.map((c) => (
            <div key={c.title}>
              <dt>{c.title}</dt>
              <dd>{c.body}</dd>
            </div>
          ))}
        </dl>

        <div className="compare">
          <fieldset className="compare__picker">
            <legend>Comparar projetos conceituais</legend>
            <p className="compare__hint">Escolha até três projetos.</p>
            {PROJECTS.map((p) => (
              <label key={p.id} className="checkbox">
                <input
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  disabled={!selected.includes(p.id) && selected.length >= MAX_COMPARE}
                  onChange={() => toggle(p.id)}
                />
                <span>{p.title}</span>
              </label>
            ))}
          </fieldset>
          <div className="compare__result" aria-live="polite">
            {chosen.length === 0 ? (
              <p className="empty">Escolha até três projetos para comparar os dados e os pontos de observação.</p>
            ) : (
              <div className="table-scroll" tabIndex={0} role="region" aria-label="Tabela de comparação">
                <table className="compare-table">
                  <caption>
                    Dimensões ilustrativas: parâmetros de estudo, não medições das imagens. Nenhum projeto é
                    classificado como melhor.
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Critério</th>
                      {chosen.map((p) => (
                        <th key={p.id} scope="col">
                          <Link to={`/projetos/${p.slug}`}>{p.title}</Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.label}>
                        <th scope="row">{row.label}</th>
                        {chosen.map((p) => (
                          <td key={p.id}>{row.value(p)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function CostSection() {
  return (
    <section className="chapter chapter--sage" aria-labelledby="titulo-custo">
      <div className="container split">
        <div>
          <h2 id="titulo-custo">O custo não está só no tamanho.</h2>
        </div>
        <div>
          <p className="lede">
            Área, sistema construtivo, condições do terreno, complexidade do projeto, materiais e localização podem
            participar da composição de custos. Duas casas com áreas semelhantes podem reunir escolhas e condições
            muito diferentes.
          </p>
          <p>
            Uma imagem não contém todas as informações necessárias para estimar uma obra. Por isso, este portal não
            atribui preços de mercado aos projetos conceituais. O objetivo é ajudar a reconhecer quais perguntas
            precisam ser feitas antes de uma comparação de valores.
          </p>
          <h3 className="list-title">Perguntas úteis</h3>
          <ul className="question-list">
            {COST_QUESTIONS.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function GlossarySection() {
  const id = useId()
  const [query, setQuery] = useState('')
  const terms = GLOSSARY.filter((g) => matches(query, [g.term, g.def]))
  return (
    <section id="glossario" className="chapter" aria-labelledby="titulo-glossario">
      <div className="container split">
        <div>
          <h2 id="titulo-glossario">Glossário</h2>
          <p>Termos que aparecem nas fichas e nos guias, explicados sem jargão.</p>
          <div className="field">
            <label htmlFor={`${id}-term`}>Buscar termo</label>
            <input id={`${id}-term`} type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
        <div aria-live="polite">
          {terms.length ? (
            <dl className="definition-list">
              {terms.map((g) => (
                <div key={g.term}>
                  <dt>{g.term}</dt>
                  <dd>{g.def}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="empty">Nenhum termo encontrado. Tente outra palavra.</p>
          )}
        </div>
      </div>
    </section>
  )
}

function FaqSection() {
  return (
    <section id="perguntas" className="chapter chapter--sage" aria-labelledby="titulo-faq">
      <div className="container split">
        <div>
          <h2 id="titulo-faq">Perguntas frequentes</h2>
        </div>
        <div className="faq">
          {FAQ.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function ClosingSection() {
  return (
    <section className="chapter chapter--ink closing" aria-labelledby="titulo-fechamento">
      <div className="container">
        <h2 id="titulo-fechamento">O próximo detalhe pode mudar a forma como você vê uma casa.</h2>
        <p className="lede">
          Continue por um ambiente, um material ou uma etapa da construção e salve as referências que quiser rever.
        </p>
        <Link className="button button--light" to="/guia">
          Continuar explorando
        </Link>
      </div>
    </section>
  )
}
