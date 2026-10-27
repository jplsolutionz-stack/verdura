import { useEffect, type ImgHTMLAttributes } from 'react'
import { frameSrc, frameSrcSet } from '../lib/media'
import { useSaved, type SavedKind } from '../lib/saved'

/** Quadro da jornada com derivados responsivos e dimensões reservadas. */
export function Frame({
  file,
  alt,
  sizes = '100vw',
  ...rest
}: { file: string; alt: string; sizes?: string } & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'>) {
  return (
    <img
      src={frameSrc(file, 960)}
      srcSet={frameSrcSet(file)}
      sizes={sizes}
      width={1672}
      height={941}
      alt={alt}
      decoding="async"
      loading="lazy"
      {...rest}
    />
  )
}

export function SaveButton({ kind, id, label }: { kind: SavedKind; id: string; label: string }) {
  const { isSaved, toggle } = useSaved()
  const saved = isSaved(kind, id)
  return (
    <button
      type="button"
      className="save-button"
      aria-pressed={saved}
      aria-label={saved ? `Remover ${label} dos salvos` : `Salvar ${label}`}
      onClick={() => toggle(kind, id)}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          d="M6.5 3.75h11a.75.75 0 0 1 .75.75v15.6a.4.4 0 0 1-.64.32L12 16.2l-5.61 4.22a.4.4 0 0 1-.64-.32V4.5a.75.75 0 0 1 .75-.75Z"
          fill={saved ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · Verdura` : 'Verdura · Arquitetura, construção e moradia'
  }, [title])
}

/** Planta esquemática dos estudos sem fotografia: geometria, não ilustração. */
export function PlanDiagram({ plan, title }: { plan: 'patio' | 'jardim'; title: string }) {
  return (
    <svg className="plan" viewBox="0 0 640 360" role="img" aria-label={title}>
      <rect width="640" height="360" fill="var(--sage)" />
      {plan === 'patio' ? (
        <g fill="none" stroke="var(--ink)" strokeWidth="2">
          <rect x="120" y="50" width="400" height="260" fill="var(--surface)" />
          <rect x="250" y="130" width="140" height="100" fill="var(--sage)" strokeDasharray="6 5" />
          <line x1="250" y1="50" x2="250" y2="130" />
          <line x1="390" y1="50" x2="390" y2="130" />
          <line x1="250" y1="230" x2="250" y2="310" />
          <line x1="390" y1="230" x2="390" y2="310" />
          <line x1="120" y1="180" x2="250" y2="180" />
          <line x1="390" y1="180" x2="520" y2="180" />
          <path d="M150 310v-30M300 310v-12" strokeWidth="1.5" />
          <circle cx="320" cy="180" r="18" fill="var(--muted)" stroke="none" opacity="0.35" />
          <g fill="var(--ink)" stroke="none" fontFamily="var(--font-text)" fontSize="13" textAnchor="middle">
            <text x="185" y="120">Estar</text>
            <text x="320" y="95">Jantar e cozinha</text>
            <text x="455" y="120">Quarto</text>
            <text x="185" y="250">Entrada</text>
            <text x="320" y="275">Circulação</text>
            <text x="455" y="250">Quarto</text>
            <text x="320" y="210" fill="var(--muted)">Pátio</text>
          </g>
        </g>
      ) : (
        <g fill="none" stroke="var(--ink)" strokeWidth="2">
          <rect x="60" y="60" width="230" height="240" fill="var(--surface)" />
          <rect x="290" y="60" width="90" height="240" fill="var(--canvas)" strokeDasharray="6 5" />
          <rect x="380" y="60" width="90" height="240" fill="var(--canvas)" opacity="0.6" />
          <line x1="60" y1="170" x2="290" y2="170" />
          <line x1="175" y1="170" x2="175" y2="300" />
          <g fill="var(--muted)" stroke="none" opacity="0.35">
            <circle cx="530" cy="100" r="34" />
            <circle cx="560" cy="210" r="26" />
            <circle cx="505" cy="280" r="20" />
          </g>
          <path d="M20 330 C 120 330 140 300 175 300" strokeDasharray="3 6" strokeWidth="1.5" />
          <g fill="var(--ink)" stroke="none" fontFamily="var(--font-text)" fontSize="13" textAnchor="middle">
            <text x="175" y="120">Estar</text>
            <text x="118" y="240">Quarto</text>
            <text x="232" y="240">Quarto</text>
            <text x="335" y="185">Varanda</text>
            <text x="425" y="185">Deque</text>
            <text x="540" y="330" fill="var(--muted)">Jardim</text>
            <text x="70" y="350" fill="var(--muted)" textAnchor="start">Chegada</text>
          </g>
        </g>
      )}
    </svg>
  )
}
