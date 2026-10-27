import { Link } from 'react-router-dom'
import { Frame, useTitle } from '../components/ui'

export function About() {
  useTitle('Sobre o projeto')
  return (
    <div className="page">
      <div className="container split split--page">
        <header>
          <h1>Um espaço para observar com mais contexto.</h1>
        </header>
        <div className="prose">
          <p className="lede">
            A Verdura reúne imagens conceituais e explicações para aproximar arquitetura de quem quer compreendê-la
            melhor. O conteúdo começa pelo que se vê e avança para perguntas sobre organização, uso e construção.
          </p>
          <p>
            O projeto não representa uma empresa real. Não oferece imóveis, serviços profissionais ou promessas de
            desempenho. Cada visualização é um ponto de partida para explorar o tema apresentado.
          </p>
          <h2>Sobre as imagens</h2>
          <p>
            A casa da jornada de abertura e as fotografias dos projetos são visualizações geradas e refinadas com IA. A
            sequência de construção é simplificada e não registra uma obra real. Os dois estudos sem fotografia usam
            plantas esquemáticas, fora de escala.
          </p>
          <p>
            Referências fornecidas para orientar a composição ficam separadas dos projetos apresentados no portal.
          </p>
          <figure>
            <Frame file="17-porta-aberta" alt="Porta aberta para o interior iluminado da casa conceitual." sizes="(min-width: 1024px) 50vw, 100vw" />
            <figcaption>Visualização arquitetônica conceitual.</figcaption>
          </figure>
          <h2>Como usar o portal</h2>
          <p>
            Comece pelos <Link to="/projetos">projetos</Link>, siga para o <Link to="/guia">guia</Link> ou use os{' '}
            <Link to="/salvos">salvos</Link> para guardar referências neste navegador.
          </p>
        </div>
      </div>
    </div>
  )
}
