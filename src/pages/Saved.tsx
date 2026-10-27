import { Link } from 'react-router-dom'
import { ProjectCard } from '../components/ProjectCard'
import { useTitle } from '../components/ui'
import { ARTICLES } from '../data/articles'
import { MESSAGES } from '../data/content'
import { PROJECTS } from '../data/projects'
import { useSaved } from '../lib/saved'
import { ArticleCard } from './Guide'

export function Saved() {
  useTitle('Salvos')
  const { saved } = useSaved()
  const projects = PROJECTS.filter((p) => saved.project.includes(p.id))
  const articles = ARTICLES.filter((a) => saved.article.includes(a.slug))
  const empty = projects.length + articles.length === 0

  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <h1>Salvos</h1>
          <p className="lede">Referências guardadas neste navegador. Não é preciso conta, e nada é sincronizado entre dispositivos.</p>
        </header>
        {empty ? (
          <div className="empty-state">
            <p>{MESSAGES.savedEmpty}</p>
            <div className="actions">
              <Link className="button" to="/projetos">
                Ver projetos
              </Link>
              <Link className="text-link" to="/guia">
                Explorar o guia
              </Link>
            </div>
          </div>
        ) : (
          <>
            {projects.length > 0 && (
              <section aria-labelledby="salvos-projetos" className="results-block">
                <h2 id="salvos-projetos">Projetos</h2>
                <div className="project-grid">
                  {projects.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </section>
            )}
            {articles.length > 0 && (
              <section aria-labelledby="salvos-guias" className="results-block">
                <h2 id="salvos-guias">Guias</h2>
                <div className="article-grid">
                  {articles.map((a) => (
                    <ArticleCard key={a.slug} article={a} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
