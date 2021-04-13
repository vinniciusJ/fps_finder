import axios from 'axios'

export const calculatorAPI = axios.create({
    baseURL: 'https://fps-finder-server.herokuapp.com',
})

export const blogAPI = axios.create({
    baseURL: 'https://fpsfinder-blog.herokuapp.com/blog'
})
