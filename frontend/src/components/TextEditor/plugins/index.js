
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
