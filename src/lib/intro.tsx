import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * off: o site em fluxo normal · scrub: abertura no desktop, guiada pelo scroll nativo ·
 * play: jornada completa por ação do visitante ("Ver a construção").
 */
export type IntroStatus = 'off' | 'scrub' | 'play'

const DONE_KEY = 'verdura:introducao-concluida'

const query = (q: string) => typeof window !== 'undefined' && window.matchMedia(q).matches

/** Só em desenvolvimento: ?motion=force ignora prefers-reduced-motion para testar a jornada. */
export const forceMotion = () =>
  import.meta.env.DEV && new URLSearchParams(window.location.search).get('motion') === 'force'

export const prefersReducedMotion = () => query('(prefers-reduced-motion: reduce)') && !forceMotion()

function sessionDone() {
  try {
    return window.sessionStorage.getItem(DONE_KEY) === '1'
  } catch {
    return false
  }
}

type IntroContext = {
  status: IntroStatus
  play: () => void
  complete: (options?: { focusContent?: boolean }) => void
  canPlay: boolean
}

const Ctx = createContext<IntroContext | null>(null)

export function IntroProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const [status, setStatus] = useState<IntroStatus>(() =>
    pathname === '/' && query('(min-width: 1024px)') && !prefersReducedMotion() && !sessionDone() ? 'scrub' : 'off',
  )
  const canPlay = !prefersReducedMotion()

  const complete = useCallback((options?: { focusContent?: boolean }) => {
    try {
      window.sessionStorage.setItem(DONE_KEY, '1')
    } catch {
      // Sem sessionStorage a introdução apenas pode voltar num recarregamento.
    }
    setStatus('off')
    // O conteúdo volta ao fluxo normal no topo; nada de retornar à porta depois.
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
      if (options?.focusContent) document.getElementById('conteudo')?.focus({ preventScroll: true })
    }, 0)
  }, [])

  const play = useCallback(() => {
    if (!canPlay) return
    window.scrollTo({ top: 0, behavior: 'instant' })
    setStatus('play')
  }, [canPlay])

  // Sair da página inicial encerra a introdução.
  useEffect(() => {
    if (pathname !== '/' && status !== 'off') complete()
  }, [pathname, status, complete])

  return <Ctx.Provider value={{ status, play, complete, canPlay }}>{children}</Ctx.Provider>
}

export function useIntro() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useIntro precisa de IntroProvider')
  return ctx
}
