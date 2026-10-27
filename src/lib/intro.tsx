import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * off: o site em fluxo normal · scrub: abertura guiada pelo scroll nativo, em qualquer aparelho ·
 * play: jornada completa por ação do visitante ("Ver a construção").
 *
 * Por decisão do projeto a jornada roda para todos, inclusive com "Reduzir movimento" ativo;
 * "Explorar o conteúdo" e "Ir direto ao conteúdo" ficam disponíveis desde o início.
 */
export type IntroStatus = 'off' | 'scrub' | 'play'

// Concluída nesta carga da página: navegar e voltar não repete; recarregar abre no início de novo.
let seenThisLoad = false

type IntroContext = {
  status: IntroStatus
  play: () => void
  complete: (options?: { focusContent?: boolean }) => void
}

const Ctx = createContext<IntroContext | null>(null)

export function IntroProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const [status, setStatus] = useState<IntroStatus>(() => (pathname === '/' && !seenThisLoad ? 'scrub' : 'off'))

  const complete = useCallback((options?: { focusContent?: boolean }) => {
    seenThisLoad = true
    setStatus('off')
    // O conteúdo volta ao fluxo normal no topo; nada de retornar à porta depois.
    window.setTimeout(() => {
      window.scrollTo(0, 0)
      if (options?.focusContent) document.getElementById('conteudo')?.focus({ preventScroll: true })
    }, 0)
  }, [])

  const play = useCallback(() => {
    window.scrollTo(0, 0)
    setStatus('play')
  }, [])

  // Sair da página inicial encerra a introdução.
  useEffect(() => {
    if (pathname !== '/' && status !== 'off') complete()
  }, [pathname, status, complete])

  return <Ctx.Provider value={{ status, play, complete }}>{children}</Ctx.Provider>
}

export function useIntro() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useIntro precisa de IntroProvider')
  return ctx
}
