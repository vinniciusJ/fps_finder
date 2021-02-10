import axios from 'axios'

const api = axios.create({
    baseURL:'https://fps-finder-server.herokuapp.com'
})

export default api