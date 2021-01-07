export const debounceEvent = (fn, wait = 1000, timeout) => (...args) =>
    clearTimeout(timeout, timeout = setTimeout(() => fn(...args), wait))
