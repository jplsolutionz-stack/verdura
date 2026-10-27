import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import '@fontsource-variable/inter/wght.css'
import './index.css'
import App from './App.tsx'

// A página sempre abre no início: o navegador não restaura uma posição no meio da jornada.
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      {/* A animação roda mesmo com "Reduzir movimento" ativo (decisão do projeto). */}
      <MotionConfig reducedMotion="never">
        <App />
      </MotionConfig>
    </BrowserRouter>
  </StrictMode>,
)
