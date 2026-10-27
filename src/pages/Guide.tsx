import { useId, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ProjectCard } from '../components/ProjectCard'
import { Frame, SaveButton, useTitle } from '../components/ui'
import { ARTICLES, type Article } from '../data/articles'
import { MESSAGES, SEARCH_SUGGESTIONS } from '../data/content'
import { PROJECTS } from '../data/projects'
import { matches } from '../lib/text'

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="article-card">
      <Link to={`/guia/${article.slug}`} className="article-card__media" tabIndex={-1} aria-hidden="true">
        <Frame file={article.cover.file} alt="" sizes="(min-width: 1024px) 30vw, 100vw" />
      </Link>
      <div className="article-card__body">
        <div className="project-card__top">
          <p className="badge">{article.themes.join(' · ')}</p>
          <SaveButton kind="article" id={article.slug} label={article.title} />
        </div>
        <h3>
          <Link to={`/guia/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{article.summary}</p>
      </div>
    </article>
  )
}

export function Guide() {
  useTitle('Guia')
  const id = useId()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [query, setQuery] = useState(q)

  const articles = ARTICLES.filter((a) =>
    matches(q, [a.title, a.headline, a.summary, ...a.themes, ...a.keywords, ...a.sections.map((s) => s.title)]),
  )
  const projects = q ? PROJECTS.filter((p) => matches(q, [p.title, p.summary, ...p.themes, ...p.materials, ...p.keywords])) : []

  function submit(event: FormEvent) {
    event.preventDefault()
    const next = query.trim()
    setParams(next ? { q: next } : {})
  }

  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <h1>Guia</h1>
          <p className="lede">
            Leituras sobre obra, ambientes, materiais, luz e conforto. Cada guia traz perguntas para levar a qualquer
            projeto.
          </p>
        </header>

        <form role="search" className="search-panel search-panel--plain" onSubmit={submit}>
          <label htmlFor={`${id}-q`} className="search-panel__label">
            O que você quer conhecer?
          </label>
          <div className="search-panel__row">
            <input
              id={`${id}-q`}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busque por ambientes, materiais ou etapas da obra"
            />
            <button type="submit" className="button">
              Buscar
            </button>
          </div>
          <ul className="suggestions" aria-label="Sugestões de busca">
            {SEARCH_SUGGESTIONS.map((s) => (
              <li key={s}>
                <Link to={`/guia?q=${encodeURIComponent(s)}`} onClick={() => setQuery(s)}>
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </form>

        <div role="status" className="results-count">
          {q ? (
            <>
              Resultados para “{q}”: {articles.length + projects.length}
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setQuery('')
                  setParams({})
                }}
              >
                Limpar busca
              </button>
            </>
          ) : (
            MESSAGES.searchEmpty
          )}
        </div>

        {q && articles.length + projects.length === 0 && (
          <div className="empty-state">
            <h2>Nenhum conteúdo encontrado.</h2>
            <p>{MESSAGES.noResults}</p>
          </div>
        )}

        {articles.length > 0 && (
          <section aria-labelledby="titulo-guias" className="results-block">
            <h2 id="titulo-guias">{q ? 'Guias' : 'Todos os guias'}</h2>
            <div className="article-grid">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section aria-labelledby="titulo-resultados-projetos" className="results-block">
            <h2 id="titulo-resultados-projetos">Projetos</h2>
            <div className="project-grid">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
