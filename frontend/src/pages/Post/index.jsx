import React, { Suspense, lazy, useState, useEffect } from 'react'
import axios from 'axios'

import { slugify} from '../../utils/index'
import { Plus, Edit3 } from 'react-feather'
import { blogAPI } from '../../services/api'
import { Redirect, useParams, useHistory } from 'react-router-dom'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'

import './styles.css'

const ImagePopup = lazy(() => import('../../components/ImagePopup'))
const TextEditor = lazy(() => import('../../components/TextEditor'))

const Post = props => {
    const { slug } = useParams(), history = useHistory(), user = sessionStorage.getItem('user')

    const [ postID, setPostID ] = useState(0)
    const [ imagePopup, setImagePopup ] = useState(false)
    const [ bannerPreview, setBannerPreview ] = useState(false)
    const [ editorState, setEditorState ] = useState(EditorState.createEmpty())
    const [ postHeader, setPostHeader ] = useState({ title: null, banner: { src: null, type: null, font: null, file: null } })
 
    useEffect(() => (async () => {
        document.title = slug ? 'Editar postagem' : 'Criar postagem'

        if(!slug) return

        const source = axios.CancelToken.source()

        try{
            const post = await (await blogAPI.get(`/${slug}/`, { cancelToken: source.token } )).data
            const { id, title, content, banner_link, font_banner } = post

            setPostID(id)
            setBannerPreview(true)
            setPostHeader({ title, banner: { src: banner_link, type: 'pasted', font: font_banner, file: null } })
            setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(content))))
        }
        catch(error){
            alert(error.message)
        }

        return () => source.cancel("Requisição Cancelada")
    })(), [ slug ])
    
    const handleTitleInput = ({ target: { value } }) => {
        const { banner } = postHeader

        setPostHeader({ title: value, banner })
    }

    const handleImagePopupVisibility = event => {
        event.preventDefault()

        const overflowY  = document.documentElement.style.overflowY || 'initial'
           
        document.documentElement.style.overflowY = overflowY === 'initial' ? 'hidden' : 'initial'

        setImagePopup(!imagePopup)
        setBannerPreview(postHeader.banner.src ? true : false)
    }

    const handleFontInput = ({ target: { value } }) => {
        const { title, banner: { file, src, type, key } } = postHeader

        setPostHeader({ title, banner: { file, src, type, font: value, key } })
    }

    const handleImageChange = ({ src, file: newFile, type }) => {
        const { title, banner: { font, file } } = postHeader
        const key = Date.now()

        if(newFile){
            const reader = new FileReader()
    
            reader.readAsDataURL(newFile)
            reader.onload = ({ target: { result } }) => setPostHeader({ title, banner: { 
                src: result, 
                file: newFile, 
                type, 
                font, 
                key: `${key}-${newFile.name}`
            }})

            return
        }

        setPostHeader({ title, banner: { src, file, type, font, key } })
    }

    const onCancel = (event) => {
        event.preventDefault()

        history.push('/2054dbb5f81969e56eede7fa2078218c/blog')
    }

    const onSave = async event => {
        event.preventDefault()

        const images = new FormData()
        const source = axios.CancelToken.source()
        const published = event.target.dataset.publish ? true : false

        const { title, banner } = postHeader
        const { blocks, entityMap } = convertToRaw(editorState.getCurrentContent())

        if(!(banner.src || banner.file ) || !title || !banner.font) 
            return alert('Por favor, preencha todos os campos obrigatórios (Banner, Fonte do Banner e o Título)')

        if(banner.file) images.append(banner.key, banner.file)
        
        Object.values(entityMap).forEach(entity => {
            if(entity.type === 'image' && entity.data.file) images.append(entity.data.key, entity.data.file)
        })

        try{
            let data = []

            const getSrcFromSources = ({ key }) => {
                return Array.isArray(data) ? data.find(src => src.name === key).file : data.file
            }

            if(!!images.entries().next().value) 
                data = await (await blogAPI.post('/files/', images)).data
            
            if(banner.file){
                const src = getSrcFromSources({ key: banner.key })

                banner.src = `https://res.cloudinary.com/dgkfcpp9p/${src}`
            } 

            const finalEntityMap = {...Object.values(entityMap).map(entity => {
                if(entityMap !== 'image' && !entity.data.file) return entity

                const src = getSrcFromSources({ key: entity.data.key })

                return { 
                    ...entity, 
                    data: {  
                        ...entity.data, 
                        file: null, 
                        src: `https://res.cloudinary.com/dgkfcpp9p/${src}`
                    }
                } 
            })}

            const finalBlocks = blocks.map(block => {
                if(block.type.toLowerCase() === 'atomic'){
                    const [ { key } ] = block.entityRanges
                    const { data, type } =  finalEntityMap[key]

                    return { ...block, data: { ...data, type } }
                }

                return block
            })

            const post = { 
                title, 
                content: JSON.stringify({ blocks: finalBlocks, entityMap: finalEntityMap }), 
                published,
                font_banner: banner.font,
                banner_link: banner.src, 
                slug: slugify({ text: title })
            }

            const httpsCodes = [ 200, 201, 2004 ]
            const message = slug ? 'A postagem foi atualizada com sucesso' : 'A postagem foi criado com sucesso'
            
            if(slug){
                const status = await (await blogAPI.put(`/${postID}/`, post)).status

                httpsCodes.includes(status) && alert(message)
            }
            else {
                const status = await (await blogAPI.post('/', post)).status

                httpsCodes.includes(status) && alert(message)
            }
            
            history.push('/2054dbb5f81969e56eede7fa2078218c/blog')
        }
        catch(error){
            alert(error.message)
        }
        
        return () => source.cancel("Requisição Cancelada")
    }

    return (
        <div className="Post">
            {user ? (
                <>
                    <header className="post-header">
                        <h2>{slug ? 'Editar post: ' : 'Criar um post: '}</h2>
                    </header>
                    <main className="post-data-container">
                        <form className="post-form">
                            <div className="post-input">
                                <label htmlFor="title">Título:</label>
                                <input type="text" value={postHeader.title ?? ' '} name="title" id="title" placeholder="Escreva aqui..." onChange={handleTitleInput} autoFocus maxLength={50}/>
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

                                        { postHeader.banner.font && (
                                            <figcaption>
                                                <strong>Fonte: </strong> {postHeader.banner.font}
                                            </figcaption>
                                        ) }

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

                            <div className="post-btns-opts">
                                <button className="btn main" onClick={onSave}>Salvar</button>
                                <button className="btn" onClick={onCancel}>Cancelar</button>
                                <button className="btn" data-publish onClick={onSave}>Publicar</button>
                            </div>
                        </form>
                    </main>

                    
                    {imagePopup && (
                        <Suspense fallback={<div></div>}>
                            <ImagePopup 
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