import { Link, useParams } from 'react-router-dom'
import { Frame, SaveButton, useTitle } from '../components/ui'
import { ARTICLES, findArticle } from '../data/articles'
import { NotFound } from './NotFound'

export function ArticlePage() {
  const { slug = '' } = useParams()
  const article = findArticle(slug)
  useTitle(article?.title ?? 'Conteúdo não encontrado')
  if (!article) return <NotFound />

  const others = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3)
  return (
    <article className="page article">
      <div className="container">
        <nav aria-label="Trilha" className="breadcrumb">
          <Link to="/guia">Guia</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{article.title}</span>
        </nav>
        <header className="detail-head">
          <div>
            <p className="badge">{article.title}</p>
            <h1>{article.headline}</h1>
            {article.intro.map((p) => (
              <p key={p} className="lede">
                {p}
              </p>
            ))}
          </div>
          <SaveButton kind="article" id={article.slug} label={article.title} />
        </header>

        <figure className="article__cover">
          <Frame file={article.cover.file} alt={article.cover.alt} sizes="(min-width: 1024px) 70vw, 100vw" loading="eager" />
          <figcaption>Visualização arquitetônica conceitual.</figcaption>
        </figure>

        <div className="article__layout">
          <nav className="toc" aria-label="Neste guia">
            <p className="toc__title">Neste guia</p>
            <ol>
              {article.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
              <li>
                <a href="#perguntas-para-levar">Perguntas para levar</a>
              </li>
            </ol>
          </nav>

          <div className="article__body">
            {article.sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`} className={s.image ? 'article__section article__section--media' : 'article__section'}>
                <h2 id={`${s.id}-t`}>{s.title}</h2>
                {s.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {s.aside && (
                  <p className="observe">
                    <span>{s.aside.label}</span>
                    {s.aside.text}
                  </p>
                )}
                {s.image && (
                  <figure>
                    <Frame file={s.image.file} alt={s.image.alt} sizes="(min-width: 1024px) 50vw, 100vw" />
                  </figure>
                )}
              </section>
            ))}

            <section id="perguntas-para-levar" aria-labelledby="perguntas-t" className="article__section">
              <h2 id="perguntas-t">Perguntas para levar</h2>
              <ul className="question-list">
                {article.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="links-t" className="article__section">
              <h2 id="links-t">Para continuar</h2>
              <ul className="link-list">
                {article.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
                {others.map((a) => (
                  <li key={a.slug}>
                    <Link to={`/guia/${a.slug}`}>{a.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </article>
  )
}
