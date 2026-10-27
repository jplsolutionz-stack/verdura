import { useId, useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProjectCard } from '../components/ProjectCard'
import { useTitle } from '../components/ui'
import { EDITORIAL_NOTICE, MESSAGES } from '../data/content'
import { AREA_RANGES, PROJECTS, PROJECT_TYPES, THEMES } from '../data/projects'
import { matches } from '../lib/text'

type Filters = { tipo: string; quartos: string; area: string; tema: string }
const EMPTY: Filters = { tipo: '', quartos: '', area: '', tema: '' }
const FILTER_KEYS = Object.keys(EMPTY) as (keyof Filters)[]

const SORTS = [
  { value: '', label: 'Seleção editorial' },
  { value: 'menor-area', label: 'Menor área' },
  { value: 'maior-area', label: 'Maior área' },
]

function FilterFields({ values, onChange, idPrefix }: { values: Filters; onChange: (k: keyof Filters, v: string) => void; idPrefix: string }) {
  return (
    <>
      <div className="field">
        <label htmlFor={`${idPrefix}-tipo`}>Tipo</label>
        <select id={`${idPrefix}-tipo`} value={values.tipo} onChange={(e) => onChange('tipo', e.target.value)}>
          <option value="">Todos os tipos</option>
          {PROJECT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-quartos`}>Quartos</label>
        <select id={`${idPrefix}-quartos`} value={values.quartos} onChange={(e) => onChange('quartos', e.target.value)}>
          <option value="">Qualquer número</option>
          <option value="2">2 ou mais</option>
          <option value="3">3 ou mais</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-area`}>Área</label>
        <select id={`${idPrefix}-area`} value={values.area} onChange={(e) => onChange('area', e.target.value)}>
          <option value="">Qualquer área</option>
          {AREA_RANGES.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-tema`}>Tema</label>
        <select id={`${idPrefix}-tema`} value={values.tema} onChange={(e) => onChange('tema', e.target.value)}>
          <option value="">Todos os temas</option>
          {THEMES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

export function Projects() {
  useTitle('Projetos conceituais')
  const id = useId()
  const [params, setParams] = useSearchParams()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const filters: Filters = { tipo: params.get('tipo') ?? '', quartos: params.get('quartos') ?? '', area: params.get('area') ?? '', tema: params.get('tema') ?? '' }
  const q = params.get('q') ?? ''
  const sort = params.get('ordem') ?? ''
  const [query, setQuery] = useState(q)
  const [draft, setDraft] = useState<Filters>(filters)

  // A URL é o estado: recarregar ou voltar restaura a busca.
  function update(next: Record<string, string>) {
    const merged = new URLSearchParams(params)
    for (const [k, v] of Object.entries(next)) {
      if (v) merged.set(k, v)
      else merged.delete(k)
    }
    setParams(merged)
  }

  const area = AREA_RANGES.find((a) => a.value === filters.area)
  let results = PROJECTS.filter(
    (p) =>
      matches(q, [p.title, p.summary, p.badge, ...p.themes, ...p.materials, ...p.keywords]) &&
      (!filters.tipo || p.type === filters.tipo) &&
      (!filters.quartos || p.bedrooms >= Number(filters.quartos)) &&
      (!area || area.test(p.areaM2)) &&
      (!filters.tema || p.themes.includes(filters.tema)),
  )
  if (sort === 'menor-area') results = [...results].sort((a, b) => a.areaM2 - b.areaM2)
  if (sort === 'maior-area') results = [...results].sort((a, b) => b.areaM2 - a.areaM2)

  const active = FILTER_KEYS.filter((k) => filters[k]).length

  function clearAll() {
    setQuery('')
    setDraft(EMPTY)
    setParams(new URLSearchParams())
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault()
    update({ q: query.trim() })
  }

  function applyDraft(event: FormEvent) {
    event.preventDefault()
    update({ ...draft })
    dialogRef.current?.close()
  }

  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <h1>Projetos conceituais</h1>
          <p className="lede">
            Explore as relações entre fachada, ambientes e áreas externas. As fichas destacam escolhas de projeto e
            pontos que merecem um olhar mais próximo.
          </p>
          <p className="notice">{EDITORIAL_NOTICE}</p>
        </header>

        <div className="toolbar">
          <form role="search" className="toolbar__search" onSubmit={submitSearch}>
            <div className="field">
              <label htmlFor={`${id}-q`}>Buscar projetos</label>
              <div className="search-panel__row">
                <input id={`${id}-q`} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Título, tema ou material" />
                <button type="submit" className="button">
                  Buscar
                </button>
              </div>
            </div>
          </form>
          <div className="toolbar__filters" aria-label="Filtros" role="group">
            <FilterFields values={filters} onChange={(k, v) => update({ [k]: v })} idPrefix={`${id}-f`} />
          </div>
          <div className="toolbar__end">
            <div className="field">
              <label htmlFor={`${id}-ordem`}>Ordenar por</label>
              <select id={`${id}-ordem`} value={sort} onChange={(e) => update({ ordem: e.target.value })}>
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="button button--outline toolbar__drawer-button"
              onClick={() => {
                setDraft(filters)
                dialogRef.current?.showModal()
              }}
            >
              Filtros{active ? ` (${active})` : ''}
            </button>
          </div>
        </div>

        <p className="results-count" role="status">
          {results.length === 1 ? '1 projeto' : `${results.length} projetos`}
          {(q || active > 0) && (
            <button type="button" className="text-button" onClick={clearAll}>
              Limpar filtros
            </button>
          )}
        </p>

        {results.length ? (
          <div className="project-grid">
            {results.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Nenhum projeto com essa combinação.</h2>
            <p>{MESSAGES.noResults}</p>
            <button type="button" className="button" onClick={clearAll}>
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      <dialog ref={dialogRef} className="drawer" aria-labelledby={`${id}-drawer`}>
        <form className="drawer__inner" onSubmit={applyDraft}>
          <div className="menu__top">
            <h2 id={`${id}-drawer`}>Filtros</h2>
            <button type="button" className="close-button" onClick={() => dialogRef.current?.close()}>
              <span className="visually-hidden">Fechar filtros</span>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <FilterFields values={draft} onChange={(k, v) => setDraft((d) => ({ ...d, [k]: v }))} idPrefix={`${id}-d`} />
          <div className="drawer__actions">
            <button type="button" className="button button--outline" onClick={() => setDraft(EMPTY)}>
              Limpar filtros
            </button>
            <button type="submit" className="button">
              Aplicar filtros
            </button>
          </div>
        </form>
      </dialog>
    </div>
  )
}
