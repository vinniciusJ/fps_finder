import React from 'react'

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

export const linkStrategy = (contentBlock, callback, contentState) => {
	contentBlock.findEntityRanges(character => {
		const entityKey = character.getEntity()

		return entityKey !== null && contentState.getEntity(entityKey).getType() === "LINK"

	}, callback)
}

export const Link = ({ contentState, entityKey, children }) => {
	const { url, target } = contentState.getEntity(entityKey).getData()

	return (
		<a
			className="link"
			style={{ color: '#9776ff' }}
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
	decorators: [
		{
			strategy: linkStrategy,
			component: Link
		}
	]
})
