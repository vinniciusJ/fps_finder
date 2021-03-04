import React, { useRef } from 'react'
import { Mail, Send } from 'react-feather'

import './styles.css'

const Footer = () => {
    const subjectInput = useRef('')
    const messageInput = useRef('')

    const handleMailSubmit = event => {
        event.preventDefault()

        const { current: { value: subject } } = subjectInput
        const { current: { value: message } } = messageInput

        const mailto = document.createElement('a')

        mailto.href = `mailto:fpsfindersuporte@gmail.com?subject=${subject}&body=${message}`

        mailto.click()
    }

    return (
        <footer className="fps-footer">
           <div className="fps-footer-div">
                <section className="footer-info">
                    <div className="fps-info-email">
                        <h1>FPS FINDER</h1>
                        <p><Mail width={24} height={24} strokeWidth={1}/>fpsfinder@gmail.com</p>
                    </div>
                    <div className="devs-info-email">
                        <h1>DESENVOLVEDORES</h1>
                        <p><Mail width={24} height={24} strokeWidth={1}/>devmaia.contato@gmail.com</p>
                    </div>
                </section>
                <section className="footer-email">
                    <h1>Fale conosco</h1>
                    <form className="contact-us">
                        <input name="e-mail" autoComplete="false" id="subject" required placeholder="Assunto" ref={subjectInput}/>
                        <textarea required cols="30" rows="10" ref={messageInput} placeholder="Mensagem..."></textarea>

                        <button className="btn main" onClick={handleMailSubmit}><span><Send width={24}/><strong>Enviar</strong></span></button>
                    </form>
                </section>
            </div>
        </footer>
    )
}

export default Footer