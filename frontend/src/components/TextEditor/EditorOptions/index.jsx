import React, { Suspense, lazy, useState, useRef } from 'react'

import { Bold, Italic, Underline, Link2, List, Image, Youtube, Slash } from 'react-feather'
import { ColorOption, HighlightOption, OrderedListOption } from '../OptsIcons'

import './styles.css'

const LinkPopup = lazy(() => import('../../LinkPopup'))
const ImagePopup = lazy(() => import('../../ImagePopup'))
const VideoPopup = lazy(() => import('../../VideoPopup'))
const HeaderLevelSelect = lazy(() => import('../HeaderLevelSelect'))

const EditorOptions = ({ editorState, activeButtons, onToggleFn, onClick }) => {
    const [ selectedTextColor, setSelectedTextColor ] = useState('#000')
    const [ selectedHighlightColor, setSelectedHighlightColor ] = useState('#FFF')
    
    const [ currentImage, setCurrentImage ] = useState({ src: null, file: null, font: null })
    const [ inputPopup, setInputPopup ] = useState({ status: false, which: null })

    const [ isBgPalleteVisible, setIsBgPalleteVisible ] = useState(false)
    const [ isColorPalleteVisible, setIsColorPalleteVisible ] = useState(false)

    const urlInput = { src: useRef(null), target: useRef(null) }, videoInput = useRef(null)

    const selection = editorState.getSelection()
    const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType()

    const colors = [ '#000000', '#737373', '#E7E6E6', '#5500F1', '#9776FF', '#FFD382']
    const bgColors = ['#5500F1', '#9776FF', '#FFD382']

    const headingsTypes = [
        { label: "Título 1", style: "header-two" },
        { label: "Título 2", style: "header-three" },
        { label: "Título 3", style: "header-four" },
    ]

    const setActiveClassName = className => activeButtons.includes(className)
    
    const handleListBlock = ({ style }) => event => {
        event.preventDefault()

        onToggleFn(style)
    } 

    const toggleOverflowY = (overflow) => {
        const currentOverflow = overflow || 'initial'

        document.documentElement.style.overflowY = currentOverflow === 'initial' ? 'hidden' : 'initial'
    }

    const handleTextColor = ({ color }) => event => {
        onClick({ style: `COLOR${color}` })(event)

        setSelectedTextColor(color)
        setIsColorPalleteVisible(!isColorPalleteVisible)
    }

    const handleHighlightColor = ({ color }) => event => {
        console.log( `HIGHLIGHT${color}`)
        onClick({ style: `HIGHLIGHT${color}`, color })(event)

        setSelectedHighlightColor(color || '#FFF')
        setIsBgPalleteVisible(!isBgPalleteVisible)
    }

    const handleImageChange = ({ file, src }) => {
        setCurrentImage(file ? { file, font: currentImage.font } : { src, font: currentImage.font })
    }

    const handleFontInput = ({ target: { value } }) => {
        const { src, file } = currentImage

        setCurrentImage(file ? { file, font: value } : { src, font: value })
    }


    const onAddLink = event => {
        event.preventDefault()

        const { src: { current: { value: src } }, target: { current: { checked } } } = urlInput
        
        setInputPopup({ status: false, which: null })
        onClick({ type: 'LINK' }, { src, target: checked ? '_blank' : '_self' })(event)
        toggleOverflowY(document.documentElement.style.overflowY)
    }

    const onAddVideo = event => {
        event.preventDefault()

        const { current: { value: src } } = videoInput
        const id = src.split('/')[src.split('/').length - 1]
        
        setInputPopup({ status: false, which: null })
        onClick({ type: 'VIDEO' }, { src: `https://www.youtube.com/embed/${id}` })(event)
        toggleOverflowY(document.documentElement.style.overflowY)
    }

    const onAddImage = event => {
        event.preventDefault()
        
        const { src, file, font } = currentImage

        setInputPopup({ status: false, which: null })
        onClick({ type: 'IMAGE' }, { file, src, font })(event)
        toggleOverflowY(document.documentElement.style.overflowY)
    }

    const onClosePopup = () => event => {
        event.preventDefault()
    
        setInputPopup({ status: false, which: null })
        toggleOverflowY(document.documentElement.style.overflowY)
    }

    const handlePopupVisibility = ({ which }) => event => {
        event.preventDefault()  

        setInputPopup({ status: !inputPopup.status, which })
        toggleOverflowY(document.documentElement.style.overflowY)
    }

    const handleBgPalleteVisibility = event => {
        event.preventDefault()

        setIsBgPalleteVisible(!isBgPalleteVisible)
    }

    const handleColorPalleteVisibility = event => {
        event.preventDefault()

        setIsColorPalleteVisible(!isColorPalleteVisible)
    }

    return (
        <>
            <header className="editor-options">
                <div className="editor-options-opts">
                    <Suspense fallback={<div></div>}>
                        <HeaderLevelSelect 
                            headerOptions={headingsTypes}
                            active={blockType}
                            onToggle={onToggleFn}
                        />
                    </Suspense>
                    <div className="inline-options">
                        <button onClick={onClick({ style: 'BOLD' })} title="Negrito">
                            <Bold className={setActiveClassName('BOLD') ? 'active' : ' '} color="#FFF"/>
                        </button>
                        <button onClick={onClick({ style: 'ITALIC' })} title="Itálico">
                            <Italic className={setActiveClassName('ITALIC') ? 'active' : ' '} color="#FFF" />
                        </button>
                        <button onClick={onClick({ style: 'UNDERLINE' })} title="Sublinhado">
                            <Underline className={setActiveClassName('UNDERLINE') ? 'active' : ' '} color="#FFF" />
                        </button>
                        <button onClick={handleColorPalleteVisibility} title="Cor de texto">
                            <ColorOption color={selectedTextColor}/>
                        </button>
                        <button onClick={handleBgPalleteVisibility} title="Grifar">
                            <HighlightOption color={selectedHighlightColor}/>
                        </button>

                        <div className={`color-options ${isColorPalleteVisible ? 'visible': ' '}`}>
                            {colors.map(color => (
                                <span key={color} style={{ background: color }} onClick={handleTextColor({ color })}></span>
                            ))}
                        </div>

                        <div className={`bg-options ${isBgPalleteVisible ? 'visible': ' '}`}>
                            <span className="none-bg" onClick={handleHighlightColor({ color: '#FFFFFF' })}><Slash color="#000" width={6} height={6}/>Nenhuma</span>
                            
                            <div className="bg-options-colors">
                                {bgColors.map(color => (
                                    <span key={color} style={{ background: color }} onClick={handleHighlightColor({ color })}></span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="link-option">
                        <button onClick={handlePopupVisibility({ which: 'LINK' })} title="Adicionar link">
                            <Link2 color="#FFF" />
                        </button>
                    </div>
                    <div className="lists-options">
                        <button onClick={handleListBlock({ style: 'unordered-list-item' })} title="Adicionar lista sem ordem">
                            <List color="#FFF"/>
                        </button>
                        <button onClick={handleListBlock({ style: 'ordered-list-item' })} title="Adicionar lista ordenada">
                            <OrderedListOption/>
                        </button>
                    </div>
                    <div className="media-options">
                        <button title="Adicionar uma imagem" onClick={handlePopupVisibility({ which: 'IMG' })}>
                            <Image color="#FFF"/>
                        </button>
                        <button title="Adicionar uma vídeo do youtube" onClick={handlePopupVisibility({ which: 'VIDEO' })}>
                            <Youtube color="#FFF"/>
                        </button>
                    </div>
                </div>
            </header>

            {inputPopup.status && (
                <>
                {inputPopup.which === 'LINK' && (
                    <Suspense fallback={<div></div>}>
                        <LinkPopup 
                            srcRef={urlInput.src} 
                            targetRef={urlInput.target} 
                            onClick={onAddLink} 
                            onCancel={onClosePopup({ type: 'link-popup' })}
                        />
                    </Suspense>
                )}

                {inputPopup.which === 'IMG' && (
                    <Suspense fallback={<div></div>}>
                        <ImagePopup 
                            onChangeImage={handleImageChange}
                            onFontInput={handleFontInput}
                            onSave={onAddImage}
                            onCancel={onClosePopup({ type: 'img-popup' })}
                        /> 
                    </Suspense>
                )}

                    {inputPopup.which === 'VIDEO' && (
                        <Suspense fallback={<div></div>}>
                            <VideoPopup 
                                videoRef={videoInput}
                                onClick={onAddVideo}
                                onCancel={onClosePopup({ type: 'link-popup' })}
                            />
                        </Suspense>
                    )}
                </>
            )}
        </>
    )
}

export default EditorOptions
