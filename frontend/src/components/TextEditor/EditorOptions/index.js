import React, { Suspense, lazy, useState, useEffect } from 'react'

import { Bold, Italic, Underline, Link2, List, Image, Youtube } from 'react-feather'
import { ColorOption, HighlightOption, OrderedListOption } from '../OptsIcons'

import './styles.css'

const BLOCK_TYPE_HEADINGS = [
    { label: "Título 1", style: "header-two" },
    { label: "Título 2", style: "header-three" },
    { label: "Título 3", style: "header-four" },
]

const HeaderLevelSelect = lazy(() => import('../HeaderLevelSelect'))

const EditorOptions = ({ editorState, activeButtons, onToggleFn, onClick }) => {
    const [ selectedTextColor, setSelectedTextColor ] = useState('#000')
    const [ isCollorPalleteVisible, setIsColorPalleteVisible ] = useState(false)

    const selection = editorState.getSelection()
    const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType()

    const colors = [ '#000000', '#737373', '#E7E6E6', '#5500F1', '#9776FF', '#FFD382']

    const setActiveClassName = className => activeButtons.includes(className)
    
    const handleListBlock = ({ style }) => event => {
        event.preventDefault()

        onToggleFn(style)
    } 

    const handleTextColor = ({ color }) => event => {
        onClick({ style: 'TEXT-COLOR', color })(event)

        setSelectedTextColor(color)
        setIsColorPalleteVisible(!isCollorPalleteVisible)
    }

    const handleColorPalleteVisible = event => {
        event.preventDefault()

        setIsColorPalleteVisible(!isCollorPalleteVisible)
    }

    return (
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
                    <button onClick={handleColorPalleteVisible}>
                        <ColorOption color={selectedTextColor}/>

                    </button>
                    <button onClick={onClick({ style: 'HIGHLIGHT' })}>
                        <HighlightOption color="#FFF"/>
                    </button>

                    <div className={`color-options ${isCollorPalleteVisible ? 'visible': ' '}`}>
                        {colors.map(color => (
                            <span key={color} style={{ background: color }} onClick={handleTextColor({ color })}></span>
                        ))}
                    </div>
                </div>
                <div className="link-option">
                    <button id="link-btn">
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
