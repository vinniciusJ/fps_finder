import React, { Suspense, lazy, useState, useRef } from 'react'

import { Bold, Italic, Underline, Link2, List, Image, Youtube, Slash } from 'react-feather'
import { ColorOption, HighlightOption, OrderedListOption } from '../OptsIcons'

import './styles.css'

const BLOCK_TYPE_HEADINGS = [
    { label: "Título 1", style: "header-two" },
    { label: "Título 2", style: "header-three" },
    { label: "Título 3", style: "header-four" },
]

const HeaderLevelSelect = lazy(() => import('../HeaderLevelSelect'))
const LinkPopup = lazy(() => import('../../LinkPopup'))

const EditorOptions = ({ editorState, activeButtons, onToggleFn, onClick }) => {
    const [ selectedTextColor, setSelectedTextColor ] = useState('#000')
    const [ isColorPalleteVisible, setIsColorPalleteVisible ] = useState(false)

    const [ selectedHighlightColor, setSelectedHighlightColor ] = useState('#FFF')
    const [ isBgPalleteVisible, setIsBgPalleteVisible ] = useState(false)

    const [ isLinkInputVisible, setIsLinkInputVisible ] = useState(false)

    const urlInput = { src: useRef(null), target: useRef(null) }

    const selection = editorState.getSelection()
    const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType()

    const colors = [ '#000000', '#737373', '#E7E6E6', '#5500F1', '#9776FF', '#FFD382']
    const bgColors = ['#5500F1', '#9776FF', '#FFD382']

    const setActiveClassName = className => activeButtons.includes(className)
    
    const handleListBlock = ({ style }) => event => {
        event.preventDefault()

        onToggleFn(style)
    } 

    const handleTextColor = ({ color }) => event => {
        onClick({ style: 'TEXT-COLOR', color })(event)

        setSelectedTextColor(color)
        setIsColorPalleteVisible(!isColorPalleteVisible)
    }

    const handleHighlightColor = ({ color }) => event => {
        onClick({ style: 'HIGHLIGHT', color })(event)

        setSelectedHighlightColor(color || '#FFF')
        setIsBgPalleteVisible(!isBgPalleteVisible)
    }

    const onAddLink = event => {
        event.preventDefault()

        const { src: { current: { value: src } }, target: { current: { checked } } } = urlInput

        onClick({ type: 'LINK' }, { src, target: checked ? '_blank' : '_self' })(event)
        setIsLinkInputVisible(!isLinkInputVisible)
    }

    const onCancelLink = event => {
        event.preventDefault()

        setIsLinkInputVisible(!isLinkInputVisible)
    }

    const handleLinkInputVisibility = event => {
        event.preventDefault()

        setIsLinkInputVisible(!isLinkInputVisible)
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
                            headerOptions={BLOCK_TYPE_HEADINGS}
                            active={blockType}
                            onToggle={onToggleFn}
                        />
                    </Suspense>
                    <div className="inline-options">
                        <button onClick={onClick({ style: 'BOLD' })}>
                            <Bold className={setActiveClassName('BOLD') ? 'active' : ' '} color="#FFF"/>
                        </button>
                        <button onClick={onClick({ style: 'ITALIC' })}>
                            <Italic className={setActiveClassName('ITALIC') ? 'active' : ' '} color="#FFF" />
                        </button>
                        <button onClick={onClick({ style: 'UNDERLINE' })}>
                            <Underline className={setActiveClassName('UNDERLINE') ? 'active' : ' '} color="#FFF" />
                        </button>
                        <button onClick={handleColorPalleteVisibility}>
                            <ColorOption color={selectedTextColor}/>

                        </button>
                        <button onClick={handleBgPalleteVisibility}>
                            <HighlightOption color={selectedHighlightColor}/>
                        </button>

                        <div className={`color-options ${isColorPalleteVisible ? 'visible': ' '}`}>
                            {colors.map(color => (
                                <span key={color} style={{ background: color }} onClick={handleTextColor({ color })}></span>
                            ))}
                        </div>

                        <div className={`bg-options ${isBgPalleteVisible ? 'visible': ' '}`}>
                            <span className="none-bg" onClick={handleHighlightColor({ })}><Slash color="#000" width={6} height={6}/>Nenhuma</span>
                            
                            <div className="bg-options-colors">
                                {bgColors.map(color => (
                                    <span key={color} style={{ background: color }} onClick={handleHighlightColor({ color })}></span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="link-option">
                        <button onClick={handleLinkInputVisibility}>
                            <Link2 color="#FFF" />
                        </button>
                    </div>
                    <div className="lists-options">
                        <button onClick={handleListBlock({ style: 'unordered-list-item' })}>
                            <List color="#FFF"/>
                        </button>
                        <button onClick={handleListBlock({ style: 'ordered-list-item' })}>
                            <OrderedListOption/>
                        </button>
                    </div>
                    <div className="media-options">
                        <button id="img-btn">
                            <Image color="#FFF"/>
                        </button>
                        <button className="yt-video-btn">
                            <Youtube color="#FFF"/>
                        </button>
                    </div>
                </div>
            </header>

            {isLinkInputVisible && (
                <Suspense fallback={<div></div>}>
                    <LinkPopup 
                        srcRef={urlInput.src} 
                        targetRef={urlInput.target} 
                        onClick={onAddLink} 
                        onCancel={onCancelLink}
                    />
                </Suspense>
            )}
        </>
    )
}

export function getBlockStyle(block){
    switch(block.getType()){
        case 'blockquote':
            return 'RichEditor-blockquote'
        default: 
            return null
    }
}

export default EditorOptions
