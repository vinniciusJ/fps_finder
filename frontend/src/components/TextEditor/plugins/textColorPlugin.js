import { RichUtils } from "draft-js"

const createTextColorPlugin = ({ color = '#5500F1' }) => ({
    customStyleMap: {
        'TEXT-COLOR': { color }
    }
})

export default createTextColorPlugin
