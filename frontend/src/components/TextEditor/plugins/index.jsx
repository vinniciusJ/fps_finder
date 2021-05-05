import React from 'react'

export const createTextColorPlugin = () => ({
    customStyleMap: {
        'COLOR#000000': { color: '#000000' },
		'COLOR#737373': { color: '#737373' },
		'COLOR#E7E6E6': { color: '#E7E6E6' },
		'COLOR#5500F1': { color: '#5500F1' },
		'COLOR#9776FF': { color: '#9776FF' },
		'COLOR#FFD382': { color: '#FFD382' },
    }
})

export const createHighlightPlugin = () => ({
    customStyleMap: {
		'HIGHLIGHT#FFFFFF': { background: '#FFFFFF' },
        'HIGHLIGHT#5500F1': { background: '#5500F1', color: '#FFFFFF' },
		'HIGHLIGHT#9776FF': { background: '#9776FF', color: '#FFFFFF'  },
		'HIGHLIGHT#FFD382': { background: '#FFD382'  }
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
