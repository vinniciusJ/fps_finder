export const debounceEvent = (fn, wait = 1000, timeout) => (...args) =>
    clearTimeout(timeout, timeout = setTimeout(() => fn(...args), wait))

export const slugify = ({ text }) => {
    let str = text.replace(/^\s+|\s+$/g, '').toLowerCase(), array = [ ...str ]
    
    const from = 'ãàáäâáº½èéëêìíïîõòóöôùúüûñç·/_,:;', to = 'aaaaaeeeeeiiiiooooouuuunc------'

    array.forEach((char, index) => 
        str = str.replace(new RegExp(from.charAt(index), 'g'), to.charAt(index))
    )

    str = str.replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

    return str
}

export const parseArrayToMatrices = array => array.reduce((rows, key, index) => (
    (index % 3 === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows
), [])