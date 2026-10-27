import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from 'motion/react'
import { MESSAGES } from '../../data/content'
import { FRAMES, INTRO, REVEAL_EXPAND, REVEAL_OPEN, frameAt, type Frame } from '../../data/journey'
import { useIntro } from '../../lib/intro'
import { frameSrc, frameSrcSet } from '../../lib/media'
import { useSaved } from '../../lib/saved'
import { cameraAt, frameClip, measureSlot, revealClip, type Box, type Slot } from './geometry'
import { JourneyStatus } from './JourneyStatus'

const EASE_OUT = [0.23, 1, 0.32, 1] as const
/** Reprodução por ação: obra, aproximação e porta em ritmo legível, sem virar espera obrigatória. */
const PLAY_SECONDS = 16

export function IntroJourney() {
  const { status } = useIntro()
  if (status === 'off') return null
  return <Journey key={status} mode={status} />
}

function Journey({ mode }: { mode: 'scrub' | 'play' }) {
  const { complete, play } = useIntro()
  const { notify } = useSaved()
  const overlayRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const done = useRef(false)

  const progress = useMotionValue(mode === 'scrub' ? 0 : INTRO[1])
  const box = useMotionValue<Box>({ width: window.innerWidth, height: window.innerHeight })
  const slot = useMotionValue<Slot | null>(null)
  const [frame, setFrame] = useState({ index: 0, direction: 1 })
  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const playback = useRef<AnimationPlaybackControls | null>(null)

  const finish = (focusContent = false) => {
    if (done.current) return
    done.current = true
    playback.current?.stop()
    complete({ focusContent })
  }

  // Scrub: o scroll nativo da página (o espaçador) conduz a jornada, com uma mola leve.
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 170, damping: 34, restDelta: 0.0005 })
  useMotionValueEvent(smooth, 'change', (v) => {
    if (mode === 'scrub') progress.set(v)
  })

  useMotionValueEvent(progress, 'change', (v) => {
    const next = frameAt(v)
    setFrame((prev) => (prev.index === next ? prev : { index: next, direction: next > prev.index ? 1 : -1 }))
    if (v >= 0.995) finish()
  })

  // Reprodução por ação.
  useEffect(() => {
    if (mode !== 'play') return
    playback.current = animate(progress, 1, { duration: PLAY_SECONDS, ease: 'linear' })
    return () => playback.current?.stop()
  }, [mode, progress])

  // Tamanho da tela e moldura medida a partir da grade.
  useLayoutEffect(() => {
    const overlay = overlayRef.current!
    const update = () => {
      box.set({ width: overlay.clientWidth, height: overlay.clientHeight })
      slot.set(mode === 'scrub' && copyRef.current ? measureSlot(overlay, copyRef.current) : null)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(overlay)
    return () => observer.disconnect()
  }, [mode, box, slot])

  // Esc, ou o foco chegando ao conteúdo pelo teclado, encerram a introdução.
  useEffect(() => {
    const site = document.querySelector('.site')
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && finish(true)
    // Nenhum controle pode ficar focado e invisível sob a fotografia.
    const onTab = (e: KeyboardEvent) => e.key === 'Tab' && site?.contains(document.activeElement) && finish()
    const onFocus = () => finish()
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onTab)
    site?.addEventListener('focusin', onFocus)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onTab)
      site?.removeEventListener('focusin', onFocus)
    }
    // finish é estável o suficiente: lê refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const visualClip = useTransform(() => {
    const s = slot.get()
    return s ? frameClip(s, progress.get()) : 'none'
  })
  const camera = useTransform(() => cameraAt(slot.get(), box.get(), progress.get()))
  const hole = useTransform(() => revealClip(box.get(), progress.get()))
  const photoOpacity = useTransform(progress, [REVEAL_EXPAND[0] + 0.05, REVEAL_EXPAND[1]], [1, 0])
  const copyOpacity = useTransform(progress, [INTRO[0], 0.07], [1, 0])
  const copyTransform = useTransform(progress, [INTRO[0], 0.07], ['translateY(0px)', 'translateY(-32px)'])
  const copyFilter = useTransform(progress, [INTRO[0], 0.07], ['blur(0px)', 'blur(8px)'])
  const copyVisibility = useTransform(() => (copyOpacity.get() < 0.02 ? 'hidden' : 'visible'))
  const hudOpacity = useTransform(
    progress,
    mode === 'scrub' ? [0.07, INTRO[1], REVEAL_OPEN[0], REVEAL_OPEN[1]] : [0, 0.001, REVEAL_OPEN[0], REVEAL_OPEN[1]],
    [0, 1, 1, 0],
  )

  function togglePause() {
    if (!playback.current) return
    if (paused) playback.current.play()
    else playback.current.pause()
    setPaused(!paused)
  }

  return (
    <>
      {mode === 'scrub' && <div className="journey-spacer" aria-hidden="true" />}
      <motion.div
        ref={overlayRef}
        className={`journey journey--${mode}`}
        style={{ clipPath: hole }}
        role="region"
        aria-label="Introdução visual: a casa é construída e a porta se abre para o conteúdo"
      >
        <motion.div className="journey__visual" style={{ clipPath: visualClip, opacity: photoOpacity }} aria-hidden="true">
          <motion.div className="journey__stage" style={{ transform: camera }}>
            {FRAMES.map((f, i) =>
              i === 0 || ready ? (
                <JourneyLayer
                  key={f.file}
                  frame={f}
                  next={FRAMES[i + 1]}
                  progress={progress}
                  eager={i === 0}
                  onLoad={i === 0 ? () => window.setTimeout(() => setReady(true), 150) : undefined}
                  onError={() => {
                    notify(MESSAGES.mediaUnavailable)
                    finish()
                  }}
                />
              ) : null,
            )}
          </motion.div>
          <div className="journey__scrim" />
        </motion.div>

        {mode === 'scrub' && (
          <motion.div
            ref={copyRef}
            className="container journey__copy"
            style={{ opacity: copyOpacity, transform: copyTransform, filter: copyFilter, visibility: copyVisibility }}
          >
            <motion.h2 initial={{ opacity: 0, transform: 'translateY(16px)', filter: 'blur(8px)' }} animate={{ opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' }} transition={{ duration: 0.8, ease: EASE_OUT }}>
              Toda casa começa antes da primeira parede.
            </motion.h2>
            <motion.p className="journey__lede" initial={{ opacity: 0, transform: 'translateY(16px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} transition={{ duration: 0.8, delay: 0.08, ease: EASE_OUT }}>
              Acompanhe uma residência ganhar forma, conheça as escolhas por trás dos espaços e descubra o que observar
              em um projeto.
            </motion.p>
            <motion.div className="actions" initial={{ opacity: 0, transform: 'translateY(16px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} transition={{ duration: 0.8, delay: 0.16, ease: EASE_OUT }}>
              <button type="button" className="button button--light" onClick={() => finish(true)}>
                Explorar o conteúdo
              </button>
              <button type="button" className="text-button" onClick={play}>
                Ver a construção
              </button>
            </motion.div>
            <p className="journey__hint">
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path d="M8 2.5v10m0 0L3.5 8m4.5 4.5L12.5 8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Ou role para ver a obra subir
            </p>
          </motion.div>
        )}

        <div className="container journey__bar">
          <motion.div style={{ opacity: hudOpacity }} aria-hidden="true">
            <JourneyStatus progress={progress} active={frame.index} direction={frame.direction} />
          </motion.div>
          <div className="journey__controls">
            <p className="journey__caption">Visualização arquitetônica conceitual.</p>
            {mode === 'play' && (
              <button type="button" className="text-button" onClick={togglePause}>
                {paused ? 'Continuar' : 'Pausar'}
              </button>
            )}
            <button type="button" className="button button--light button--small" onClick={() => finish(true)}>
              Ir direto ao conteúdo
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

type LayerProps = {
  frame: Frame
  next?: Frame
  progress: MotionValue<number>
  eager: boolean
  onLoad?: () => void
  onError: () => void
}

function JourneyLayer({ frame, next, progress, eager, onLoad, onError }: LayerProps) {
  const tIn = useTransform(progress, frame.range ?? [-2, -1], [0, 1])
  const tOut = useTransform(progress, next?.range ?? [2, 3], [0, 1])
  const dollyOut = next?.reveal === 'dolly'

  const opacity = useTransform(() => (frame.reveal && frame.reveal !== 'rise' ? tIn.get() : 1))
  // Aproximação: o quadro que chega cresce até o lugar; o que sai continua avançando.
  const transform = useTransform(() => {
    const scaleIn = frame.reveal === 'dolly' ? 0.94 + 0.06 * tIn.get() : 1
    const scaleOut = dollyOut ? 1 + 0.08 * tOut.get() : 1
    return `scale(${scaleIn * scaleOut})`
  })
  const reveal = useTransform(() => `${-30 + 130 * tIn.get()}%`)
  // Só ficam visíveis as camadas que participam do momento atual.
  const visibility = useTransform(() => ((frame.range && tIn.get() <= 0) || tOut.get() >= 1 ? 'hidden' : 'visible'))

  return (
    <motion.img
      className={`journey__frame${frame.reveal === 'rise' ? ' journey__frame--rise' : ''}`}
      src={frameSrc(frame.file, 1920)}
      srcSet={frameSrcSet(frame.file)}
      sizes="100vw"
      width={1672}
      height={941}
      alt=""
      decoding="async"
      fetchPriority={eager ? 'high' : 'low'}
      onLoad={onLoad}
      onError={onError}
      style={{
        opacity,
        transform,
        visibility,
        ...(frame.reveal === 'rise' ? ({ '--reveal': reveal } as object) : {}),
      }}
    />
  )
}
