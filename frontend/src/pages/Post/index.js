import React, { Suspense, lazy, useState } from 'react'

import { Plus, Edit3 } from 'react-feather'
import { Redirect, useParams } from 'react-router-dom'
import { EditorState } from 'draft-js'

import './styles.css'

const AddImagePopup = lazy(() => import('../../components/AddImagePopup'))
const TextEditor = lazy(() => import('../../components/TextEditor'))

const Post = props => {
    const id = useParams(), user = sessionStorage.getItem('user')

    const [ addImagePopup, setAddImagePopup ] = useState(false)
    const [ bannerPreview, setBannerPreview ] = useState(false)
    const [ editorState, setEditorState ] = useState(EditorState.createEmpty())
    const [ postHeader, setPostHeader ] = useState({ title: null, banner: { src: null, type: null, font: null } })
 
    const handleTitleInput = ({ target: value }) => {
        const { banner } = postHeader

        setPostHeader({ title: value, banner })
    }

    const handleImagePopupVisibility = event => {
        event.preventDefault()

        const overflowY  = document.documentElement.style.overflowY || 'initial'
           
        document.documentElement.style.overflowY = overflowY === 'initial' ? 'hidden' : 'initial'

        setBannerPreview(postHeader.banner.src ? true : false)
        setAddImagePopup(!addImagePopup)
    }

    const handleFontInput = ({ target: { value } }) => {
        const { title, banner: { src, type } } = postHeader

        setPostHeader({ title, banner: { src, type, font: value } })
    }

    const handleImageChange = ({ src, type }) => {
        const { title, banner: { font } } = postHeader

        setPostHeader({ title, banner: { src, type, font } })
    }

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
                                <input type="text" name="title" id="title" placeholder="Escreva aqui..." onChange={handleTitleInput}/>
                            </div>
                            {(bannerPreview) || (
                                <div className="post-input">
                                    <label htmlFor="">Banner:</label>
                                    <button className="banner-button" title="Selecione uma imagem" onClick={handleImagePopupVisibility}>
                                        <Plus color="#000" width={56} height={56} strokeWidth={1}/>
                                    </button>
                                </div>
                            )}

                            {(bannerPreview) && (
                                <>
                                <h2 className="label">Banner:</h2>
                                <div className="banner-preview">
                                    <figure>
                                        <img src={postHeader.banner.src} alt={postHeader.banner.font}/>
                                        <figcaption><strong>Fonte: </strong> {postHeader.banner.font}</figcaption>
                                    </figure>

                                    <button className="banner-edit" onClick={handleImagePopupVisibility} title="Editar banner">
                                        <Edit3 color="#FFF" width={32} height={32} strokeWidth={1}/>
                                    </button>
                                </div>
                                </>
                            )}

                            <div className="content-input">
                                <h2 className="label">Conteúdo:</h2>
                                <Suspense fallback={<div></div>}>
                                    <TextEditor editorState={editorState} onChange={setEditorState}/>
                                </Suspense>
                            </div>
                        </form>
                    </main>

                    
                    {addImagePopup && (
                        <Suspense fallback={<div></div>}>
                            <AddImagePopup 
                                image={postHeader.banner}
                                onChangeImage={handleImageChange}
                                onFontInput={handleFontInput}
                                onSave={handleImagePopupVisibility}
                                onCancel={handleImagePopupVisibility}
                            />
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