import React, { Suspense, lazy } from 'react'

import './styles.css'

const Menu = lazy(() => import('../../components/Menu/'))
const Footer = lazy(() => import('../../components/Footer/'))

const AboutUs = () => {
    return (
        <div className="about-us-container">
            <Suspense fallback={<div></div>}>
                <Menu searchInput={{ isVisible: false }}/>
            </Suspense>
            <main className="about-us-content">
                <h1 className="blog-title">Sobre nós</h1>
                <div className="about-us-illustration">
                    <img src="/images/illustration-about-us.svg" width={340} height={208} alt="Ilustração" />
                </div>

                <section className="about-us-content-inner">
                    <article>
                        <h2 className="blog-subtitle">O que é?</h2>
                        <p>
                            Todos nós sabemos que hardware é uma coisa difícil de aprender sobre, principalmente por conta de muitos códigos e palavras difíceis, com isso decidimos trazer uma ferramenta 100% brasileira que revolucionará o mercado de hardware e games. Nosso foco é ajudar as pessoas leigas no assunto, ou até mesmo as mais experientes, trazendo informações de uma forma prática, fácil e 100% gratuita!
                        </p>
                    </article>
                    <article>
                        <h2 className="blog-subtitle">Calculadora</h2>
                        <p>
                            A calculadora é nossa principal função, através de informações básicas sobre seu computador conseguimos trazer a média de FPS, frames por segundo, que a máquina é capaz de alcançar em games selecionados. Assim, você consegue ter um ideia se ele é bom ou não, rodando estes games. Por isso, você pode utilizá-la tanto para tirar uma simples dúvida ou até para decidir que computador irá comprar!                        
                        </p>
                    </article>
                    <article>
                        <h2 className="blog-subtitle">Blog</h2>
                        <p>
                            Nosso blog tem como foco reunir dúvidas comuns e respondê-las de forma prática e didática, para que até o mais leigo em hardware consiga compreender, mas também não excluindo a opção de alguém mais experiente poder tirar suas dúvidas conosco.
                        </p>
                    </article>
                </section>
            </main>
            <Suspense fallback={<div></div>}>
                <Footer />
            </Suspense>
        </div>
    )
}

export default AboutUs