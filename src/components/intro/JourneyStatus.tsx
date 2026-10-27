import { AnimatePresence, motion, useTransform, type MotionValue } from 'motion/react'
import { FRAMES, GROUP_RANGES, GROUPS } from '../../data/journey'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

// O rótulo entra pelo lado para onde a obra avança e sai pelo oposto; no scroll de volta, inverte.
const label = {
  enter: (dir: number) => ({ opacity: 0, transform: `translateY(${10 * dir}px)`, filter: 'blur(4px)' }),
  center: { opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' },
  exit: (dir: number) => ({
    opacity: 0,
    transform: `translateY(${-8 * dir}px)`,
    filter: 'blur(4px)',
    transition: { duration: 0.16, ease: EASE_OUT },
  }),
}

export function JourneyStatus({ progress, active, direction }: { progress: MotionValue<number>; active: number; direction: number }) {
  const frame = FRAMES[active]
  return (
    <div className="journey-status">
      <p className="journey-status__group">{GROUPS[frame.group]}</p>
      <div className="journey-status__label">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={frame.file}
            className="journey-status__text"
            custom={direction}
            variants={label}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: EASE_OUT }}
          >
            <p className="journey-status__title">{frame.label}</p>
            <p className="journey-status__note">{frame.note}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="journey-status__track" aria-hidden="true">
        {GROUP_RANGES.map((range, i) => (
          <Segment key={GROUPS[i]} range={range} progress={progress} />
        ))}
      </div>
    </div>
  )
}

function Segment({ range, progress }: { range: [number, number]; progress: MotionValue<number> }) {
  const fill = useTransform(progress, range, ['scaleX(0)', 'scaleX(1)'])
  return (
    <span className="journey-status__segment">
      <motion.span className="journey-status__fill" style={{ transform: fill }} />
    </span>
  )
}
