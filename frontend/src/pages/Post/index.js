import React, { Suspense, lazy, useState } from 'react'

import { Redirect, useParams, useHistory } from 'react-router-dom'
import { Plus } from 'react-feather'

import './styles.css'

const AddImagePopup = lazy(() => import('../../components/AddImagePopup'))

const Post = props => {
    const id = useParams(), history = useHistory()

    const [ addImagePopup, setAddImagePopup ] = useState(true)

    const handleFileInput = event => {
        event.preventDefault()
    }

    const user = sessionStorage.getItem('user')

    return (
        <div className="Post">
            {user ? (
                <>
                    <header className="post-header">
                        <h2>{id ? 'Editar post: ' : 'Criar um post: '}</h2>
                    </header>
                    <main className="post-data-container">
                        <form className="post-form">
                            <div className="post-input">
                                <label htmlFor="title">Título:</label>
                                <input type="text" name="title" id="title" placeholder="Escreva aqui..."/>
                            </div>
                            <div className="post-input">
                                <label htmlFor="">Banner:</label>
                                <button className="banner-button" title="Selecione uma imagem" onClick={handleFileInput}>
                                    <Plus color="#000" width={56} height={56} strokeWidth={1}/>
                                </button>
                            </div>
                        </form>
                    </main>
                    
                    {addImagePopup && (
                        <Suspense fallback={<div></div>}>
                            <AddImagePopup />
                        </Suspense>
                    )}
                </>
            ) : (
                <Redirect to={{ pathname: '/login', state: { from: props.location }}} />
            )}
        </div>
    )
}

export default Post