import React from 'react'
import { RichUtils, KeyBindingUtil, EditorState } from 'draft-js'

export const createTextColorPlugin = ({ color = '#000' }) => ({
    customStyleMap: {
        'TEXT-COLOR': { color }
    }
})

export const createHighlightPlugin = ({ color = 'transparent' }) => ({
    customStyleMap: {
        'HIGHLIGHT': { background: color }
    }
})

const linkStrategy = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
        char => {
            const entityKey = char.getEntity()

            return ( entityKey !== null && contentState.getEntity(entityKey).getType === 'LINK' )
        }
    )
}

const Link = ({ contentState, entityKey, children }) => {
    const { url, target } = contentState.getEntity(entityKey).getData()
    
    return (
        <a
            className="link"
            href={url}
            rel="noopener noreferrer"
            target={target}
            aria-label={url}
        >
          {children}  
        </a>
    )
}

export const createLinkPlugin = () => ({
    decorators: [{
        strategy: linkStrategy,
        component: Link
    }]
})
