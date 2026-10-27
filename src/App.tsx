import { useEffect } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { IntroJourney } from './components/intro/IntroJourney'
import { IntroProvider, useIntro } from './lib/intro'
import { SavedProvider } from './lib/saved'
import { About } from './pages/About'
import { ArticlePage } from './pages/ArticlePage'
import { Guide } from './pages/Guide'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { ProjectDetail } from './pages/ProjectDetail'
import { Projects } from './pages/Projects'
import { Saved } from './pages/Saved'

export default function App() {
  return (
    <SavedProvider>
      <IntroProvider>
        <Shell />
      </IntroProvider>
    </SavedProvider>
  )
}

function Shell() {
  const { status, complete } = useIntro()
  const { pathname } = useLocation()
  const active = status !== 'off'

  return (
    <>
      <a
        className="skip-link"
        href="#conteudo"
        onClick={(e) => {
          if (!active) return
          e.preventDefault()
          complete({ focusContent: true })
        }}
      >
        Ir direto ao conteúdo
      </a>
      <Header />
      {/* Se a abertura falhar em algum aparelho, o site segue sem ela. */}
      {pathname === '/' && (
        <ErrorBoundary fallback={null} onError={() => complete()}>
          <IntroJourney />
        </ErrorBoundary>
      )}
      {/* Durante a abertura o site fica fixo no topo, sob a fotografia: é ele que a porta revela. */}
      <div className="site" data-intro={active}>
        <main id="conteudo" tabIndex={-1}>
          <ErrorBoundary key={pathname} fallback={<PageError />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/index.html" element={<Navigate to="/" replace />} />
              <Route path="/projetos" element={<Projects />} />
              <Route path="/projetos/:slug" element={<ProjectDetail />} />
              <Route path="/guia" element={<Guide />} />
              <Route path="/guia/:slug" element={<ArticlePage />} />
              <Route path="/salvos" element={<Saved />} />
              <Route path="/sobre" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
      <ScrollManager active={active} />
    </>
  )
}

/** Nova página começa no topo; links com âncora rolam até a seção. */
function ScrollManager({ active }: { active: boolean }) {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (active) return
    if (hash) {
      // O efeito roda depois do commit: a seção já existe no DOM.
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
    } else {
      // Forma numérica: navegadores mais antigos rejeitam behavior: 'instant' com erro.
      window.scrollTo(0, 0)
    }
  }, [pathname, hash, active])
  return null
}

function PageError() {
  return (
    <div className="page">
      <div className="container empty-state empty-state--page">
        <h1>Não foi possível mostrar esta página</h1>
        <p className="lede">Recarregue a página ou continue por outro conteúdo.</p>
        <div className="actions">
          <a className="button" href={import.meta.env.BASE_URL}>
            Recarregar o início
          </a>
          <Link className="text-link" to="/projetos">
            Ver projetos
          </Link>
        </div>
      </div>
    </div>
  )
}
