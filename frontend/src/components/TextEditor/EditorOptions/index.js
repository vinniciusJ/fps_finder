import React, { Suspense, lazy, useState, useEffect } from 'react'

import { Bold, Italic, Underline, Link2, List, Image, Youtube } from 'react-feather'
import { ColorOption, HighlightOption, OrderedListOption } from '../OptsIcons'
import { RichUtils } from 'draft-js'

import './styles.css'

const BLOCK_TYPES = [
    { label: '" "', style: 'blockquote' },
    { label: "UL", style: "unordered-list-item" },
    { label: "OL", style: "ordered-list-item" },
    { label: "{ }", style: 'code-block' }
]

const BLOCK_TYPE_HEADINGS = [
    { label: "Título 1", style: "header-two" },
    { label: "Título 2", style: "header-three" },
    { label: "Título 3", style: "header-four" },
]

const HeaderLevelSelect = lazy(() => import('../HeaderLevelSelect'))

const EditorOptions = ({ editorState, activeButtons, onChange, onToggle, onClick }) => {


    const selection = editorState.getSelection()
    const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType()

    
    const setActiveClassName = className => activeButtons.includes(className)

    return (
        <header className="editor-options">
            <div className="editor-options-opts">
                <Suspense fallback={<div></div>}>
                    <HeaderLevelSelect 
                        headerOptions={BLOCK_TYPE_HEADINGS}
                        active={blockType}
                        onToggle={onToggle}
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
                    <button onClick={onClick({ style: 'TEXT-COLOR' })}>
                        <ColorOption color="#000"/>
                    </button>
                    <button id="highlight-btn">
                        <HighlightOption color="#FFF"/>
                    </button>
                </div>
                <div  data-id="4" className="link-option">
                    <button id="link-btn">
                        <Link2 color="#FFF" />
                    </button>
                </div>
                <div className="lists-options">
                    <button data-id="5" id="ul-btn">
                        <List color="#FFF"/>
                    </button>
                    <button data-id="6" id="ol-btn">
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
