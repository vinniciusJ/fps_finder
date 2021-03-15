export const debounceEvent = (fn, wait = 1000, timeout) => (...args) =>
    clearTimeout(timeout, timeout = setTimeout(() => fn(...args), wait))

const headers = new Headers()

headers.append('Content-Type', 'application/json')
headers.append('Cache-Control', 'public, max-age=31536000, immutable')

export default headers