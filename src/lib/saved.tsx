import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { MESSAGES } from '../data/content'

export type SavedKind = 'project' | 'article'
type SavedState = Record<SavedKind, string[]>

const KEY = 'verdura:salvos'
const EMPTY: SavedState = { project: [], article: [] }

function readStorage(): SavedState {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<SavedState>
    return {
      project: Array.isArray(parsed.project) ? parsed.project.filter((v) => typeof v === 'string') : [],
      article: Array.isArray(parsed.article) ? parsed.article.filter((v) => typeof v === 'string') : [],
    }
  } catch {
    return EMPTY
  }
}

type SavedContext = {
  saved: SavedState
  isSaved: (kind: SavedKind, id: string) => boolean
  toggle: (kind: SavedKind, id: string) => void
  notify: (message: string) => void
}

const Ctx = createContext<SavedContext | null>(null)

export function SavedProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<SavedState>(readStorage)
  const [message, setMessage] = useState('')
  const timer = useRef<number | undefined>(undefined)

  const notify = useCallback((text: string) => {
    window.clearTimeout(timer.current)
    setMessage(text)
    timer.current = window.setTimeout(() => setMessage(''), 4000)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const toggle = useCallback(
    (kind: SavedKind, id: string) => {
      setSaved((prev) => {
        const has = prev[kind].includes(id)
        const next = { ...prev, [kind]: has ? prev[kind].filter((v) => v !== id) : [...prev[kind], id] }
        let stored = true
        try {
          window.localStorage.setItem(KEY, JSON.stringify(next))
        } catch {
          stored = false
        }
        notify(!stored ? MESSAGES.storageFailed : has ? MESSAGES.removed : MESSAGES.saved)
        return next
      })
    },
    [notify],
  )

  const isSaved = useCallback((kind: SavedKind, id: string) => saved[kind].includes(id), [saved])

  return (
    <Ctx.Provider value={{ saved, isSaved, toggle, notify }}>
      {children}
      <div className="toast" role="status" aria-live="polite" data-visible={message !== ''}>
        {message}
      </div>
    </Ctx.Provider>
  )
}

export function useSaved() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSaved precisa de SavedProvider')
  return ctx
}
