import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="site-footer__brand">Verdura — projeto editorial conceitual sobre arquitetura e moradia.</p>
        <nav aria-label="Rodapé">
          <ul className="site-footer__links">
            <li><Link to="/projetos">Projetos</Link></li>
            <li><Link to="/guia">Guia</Link></li>
            <li><Link to="/salvos">Salvos</Link></li>
            <li><Link to="/sobre">Sobre o projeto</Link></li>
            <li><Link to="/#glossario">Glossário</Link></li>
            <li><Link to="/#perguntas">Perguntas frequentes</Link></li>
          </ul>
        </nav>
        <p className="site-footer__note">
          Imagens geradas e refinadas com IA para ilustrar uma casa conceitual. Projetos, medidas e estudos são
          ilustrativos; nada aqui está à venda.
        </p>
      </div>
    </footer>
  )
}
