import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Frame, PlanDiagram, SaveButton, useTitle } from '../components/ui'
import { findArticle } from '../data/articles'
import { findProject } from '../data/projects'
import { NotFound } from './NotFound'

export function ProjectDetail() {
  const { slug = '' } = useParams()
  const project = findProject(slug)
  useTitle(project?.title ?? 'Conteúdo não encontrado')
  const [current, setCurrent] = useState(0)
  if (!project) return <NotFound />

  const image = project.images[current]
  return (
    <article className="page">
      <div className="container">
        <nav aria-label="Trilha" className="breadcrumb">
          <Link to="/projetos">Projetos</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{project.title}</span>
        </nav>

        <header className="detail-head">
          <div>
            <p className="badge">{project.badge}</p>
            <h1>{project.title}</h1>
            <p className="lede">{project.summary}</p>
          </div>
          <SaveButton kind="project" id={project.id} label={project.title} />
        </header>

        <div className="gallery">
          <figure className="gallery__main">
            {image.kind === 'photo' ? (
              <Frame file={image.file} alt={image.alt} sizes="(min-width: 1024px) 66vw, 100vw" loading="eager" />
            ) : (
              <PlanDiagram plan={image.plan} title={image.alt} />
            )}
            <figcaption>
              {image.kind === 'photo' ? 'Visualização arquitetônica conceitual, gerada com IA.' : 'Planta esquemática do estudo, fora de escala.'}
            </figcaption>
          </figure>
          {project.images.length > 1 && (
            <div className="gallery__thumbs" role="group" aria-label="Imagens do projeto">
              {project.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  aria-pressed={i === current}
                  aria-label={`Imagem ${i + 1} de ${project.images.length}`}
                  onClick={() => setCurrent(i)}
                >
                  {img.kind === 'photo' ? <Frame file={img.file} alt="" sizes="200px" /> : <PlanDiagram plan={img.plan} title="" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-body">
          <section aria-labelledby="dados">
            <h2 id="dados">Dados do estudo</h2>
            <p className="notice">Dimensões ilustrativas: parâmetros de um estudo de layout, não medições obtidas da imagem.</p>
            <dl className="facts">
              <div><dt>Tipo</dt><dd>{project.typeLabel}</dd></div>
              <div><dt>Área construída</dt><dd>{project.areaM2} m²</dd></div>
              <div><dt>Quartos</dt><dd>{project.bedrooms}</dd></div>
              <div><dt>Espaços externos</dt><dd>{project.outdoor}</dd></div>
              <div><dt>Integração</dt><dd>{project.integration}</dd></div>
              <div><dt>Materiais</dt><dd>{project.materials.join(', ')}</dd></div>
            </dl>
            <h3 className="list-title">Ambientes</h3>
            <ul className="tag-list">
              {project.rooms.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="leitura">
            <h2 id="leitura">Leitura arquitetônica</h2>
            {project.observationPoints.map((o) => (
              <div key={o.title} className="reading">
                <h3>{o.title}</h3>
                <p>{o.body}</p>
              </div>
            ))}
            <p className="observe">
              <span>O que observar</span>
              {project.observe}
            </p>
            <h3 className="list-title">Para continuar</h3>
            <ul className="link-list">
              {project.related.map((slug) => {
                const a = findArticle(slug)
                return a ? (
                  <li key={slug}>
                    <Link to={`/guia/${a.slug}`}>{a.title}</Link>
                  </li>
                ) : null
              })}
              <li>
                <Link to="/#comparar">Comparar com outros projetos</Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </article>
  )
}
