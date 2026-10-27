import { Link } from 'react-router-dom'
import { useTitle } from '../components/ui'
import { MESSAGES } from '../data/content'

export function NotFound() {
  useTitle('Conteúdo não encontrado')
  return (
    <div className="page">
      <div className="container empty-state empty-state--page">
        <h1>Conteúdo não encontrado</h1>
        <p className="lede">{MESSAGES.notFound}</p>
        <div className="actions">
          <Link className="button" to="/projetos">
            Voltar aos projetos
          </Link>
          <Link className="text-link" to="/guia">
            Explorar o guia
          </Link>
        </div>
      </div>
    </div>
  )
}
