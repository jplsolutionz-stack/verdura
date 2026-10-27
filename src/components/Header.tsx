import { useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useIntro } from '../lib/intro'
import { useSaved } from '../lib/saved'

const PRIMARY = [
  { to: '/projetos', label: 'Projetos' },
  { to: '/guia/como-uma-casa-e-construida', label: 'Como uma casa é construída' },
  { to: '/guia/guia-de-ambientes', label: 'Guia de ambientes' },
]

const SECONDARY = [
  { to: '/guia', label: 'Todos os guias' },
  { to: '/sobre', label: 'Sobre o projeto' },
  { to: '/#glossario', label: 'Glossário' },
  { to: '/#perguntas', label: 'Perguntas frequentes' },
]

export function Header() {
  const { status } = useIntro()
  const { saved } = useSaved()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const location = useLocation()
  const count = saved.project.length + saved.article.length

  // Navegar fecha o menu; o <dialog> devolve o foco ao botão que o abriu.
  useEffect(() => {
    dialogRef.current?.close()
  }, [location])

  return (
    <header className="site-header" data-over-intro={status !== 'off'}>
      <div className="container site-header__inner">
        <Link className="wordmark" to="/" aria-label="Verdura, página inicial">
          Verdura
        </Link>
        <nav className="site-nav" aria-label="Principal">
          {PRIMARY.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="site-header__actions">
          <Link className="icon-button" to="/salvos" aria-label={count ? `Salvos, ${count} itens` : 'Salvos'}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M6.5 3.75h11a.75.75 0 0 1 .75.75v15.6a.4.4 0 0 1-.64.32L12 16.2l-5.61 4.22a.4.4 0 0 1-.64-.32V4.5a.75.75 0 0 1 .75-.75Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            {count > 0 && <span className="icon-button__count">{count}</span>}
          </Link>
          <button
            type="button"
            className="menu-button"
            aria-haspopup="dialog"
            onClick={() => dialogRef.current?.showModal()}
          >
            Conteúdos
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="menu"
        aria-labelledby="menu-titulo"
        onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}
      >
        <div className="menu__inner">
          <div className="menu__top">
            <h2 id="menu-titulo">Conteúdos</h2>
            <button type="button" className="close-button" onClick={() => dialogRef.current?.close()}>
              <span className="visually-hidden">Fechar menu</span>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav aria-label="Conteúdos">
            <ul className="menu__list menu__list--primary">
              {PRIMARY.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link to="/salvos">Salvos</Link>
              </li>
            </ul>
            <ul className="menu__list">
              {SECONDARY.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </dialog>
    </header>
  )
}
