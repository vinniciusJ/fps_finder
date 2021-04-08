import React from 'react'
//import { RichUtils, KeyBindingUtil, EditorState } from 'draft-js'

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
	contentBlock.findEntityRanges(character => {
		const entityKey = character.getEntity()
		return (
			entityKey !== null &&
			contentState.getEntity(entityKey).getType() === "LINK"
		)
	}, callback)
}

const Link = ({ contentState, entityKey, children }) => {
	const { url } = contentState.getEntity(entityKey).getData()

	return (
		<a
			className="link"
            style={{ color: '#9776ff' }}
			href={url}
			rel="noopener noreferrer"
			target="_blank"
			aria-label={url}
		>
			{children}
		</a>
	);
};

export const createLinkPlugin = () => ({
	decorators: [
		{
			strategy: linkStrategy,
			component: Link
		}
	]
}) 


