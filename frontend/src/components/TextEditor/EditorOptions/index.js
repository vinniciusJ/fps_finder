import React, { Suspense, lazy } from 'react'

import { Bold, Italic, Underline, Link2, List, Image, Youtube } from 'react-feather'
import { ColorOption, HighlightOption, OrderedListOption } from '../OptsIcons'

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

const EditorOptions = ({ editorState, onToggle }) => {
    const selection = editorState.getSelection()
    const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType()

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
                    <Bold color="#FFF"/>
                    <Italic color="#FFF"/>
                    <Underline color="#FFF"/>
                    <ColorOption color="#000"/>
                    <HighlightOption color="#FFF"/>
                </div>
                <div className="link-option">
                    <Link2 color="#FFF"/>
                </div>
                <div className="lists-options">
                    <List color="#FFF"/>
                    <OrderedListOption />
                </div>
                <div className="media-options">
                    <Image color="#FFF"/>
                    <Youtube color="#FFF"/>
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
