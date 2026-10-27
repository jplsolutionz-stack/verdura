import { Link } from 'react-router-dom'
import type { ConceptProject } from '../data/projects'
import { Frame, PlanDiagram, SaveButton } from './ui'

export function ProjectMedia({ project, sizes }: { project: ConceptProject; sizes: string }) {
  const image = project.images[0]
  return image.kind === 'photo' ? (
    <Frame file={image.file} alt={image.alt} sizes={sizes} />
  ) : (
    <PlanDiagram plan={image.plan} title={image.alt} />
  )
}

export function ProjectCard({ project, large = false }: { project: ConceptProject; large?: boolean }) {
  return (
    <article className={`project-card${large ? ' project-card--large' : ''}`}>
      <Link to={`/projetos/${project.slug}`} className="project-card__media" tabIndex={-1} aria-hidden="true">
        <ProjectMedia project={project} sizes={large ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 34vw, 100vw'} />
      </Link>
      <div className="project-card__body">
        <div className="project-card__top">
          <p className="badge">{project.badge}</p>
          <SaveButton kind="project" id={project.id} label={project.title} />
        </div>
        <h3 className="project-card__title">
          <Link to={`/projetos/${project.slug}`}>{project.title}</Link>
        </h3>
        <ul className="meta-list">
          {project.meta.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        {large && <p className="project-card__summary">{project.summary}</p>}
        <p className="project-card__observe">
          <span>O que observar</span> {project.observe}
        </p>
        <Link to={`/projetos/${project.slug}`} className="text-link">
          {project.action}
        </Link>
      </div>
    </article>
  )
}
