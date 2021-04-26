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

        if(!subject || !message) return

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
                    <div className="suport-us">
                        <h1>APOIE NOSSO PROJETO</h1>
                            <form action="https://www.paypal.com/donate" method="post" target="_top">
                            <input type="hidden" name="business" value="WYAYHVW7AHRKW" />
                            <input type="hidden" name="item_name" value="Doação" />
                            <input type="hidden" name="currency_code" value="BRL" />
                            <input type="image" src="https://www.paypalobjects.com/pt_BR/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Faça doações com o botão do PayPal" />
                            <img alt="" border="0" src="https://www.paypal.com/pt_BR/i/scr/pixel.gif" width="1" height="1" />
                        </form>
                    </div>
                </section>
                <section className="footer-email">
                    <h1>Fale conosco</h1>
                    <form className="contact-us">
                        <label htmlFor="subject">
                            <input name="e-mail" id="subject" required placeholder="Assunto" ref={subjectInput}/>
                        </label>
                        <label htmlFor="message">
                            <textarea id="message" required cols="30" rows="10" ref={messageInput} placeholder="Mensagem..."></textarea>
                        </label>

                        <button className="btn main two" onClick={handleMailSubmit}><span><Send width={24}/><strong>Enviar</strong></span></button>
                    </form>
                </section>
            </div>
        </footer>
    )
}

export default Footer