import React, { Suspense, lazy } from 'react'
import Editor from 'draft-js-plugins-editor'

import { RichUtils } from 'draft-js'
import { getBlockStyle } from './EditorOptions'

import './styles.css'

const EditorOptions = lazy(() => import('./EditorOptions'))

const TextEditor = ({ editorState, onChange }) => {
    const toggleBlockType = blockType => {
        onChange(RichUtils.toggleBlockType(editorState, blockType))
    }

    return (
        <div className="editor-container">
            <Suspense fallback={<div></div>}>
                <EditorOptions 
                    editorState={editorState}
                    onToggle={toggleBlockType}
                />
            </Suspense>
            <Editor 
                editorState={editorState} 
                onChange={onChange}
            />
        </div>
    )
}

export default TextEditor