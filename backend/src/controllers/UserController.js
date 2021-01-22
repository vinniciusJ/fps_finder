'use strict'

const getHashedCode = require('../utils/getHashedCode')
const generateAuthToken = require('../utils/generateAuthToken')

const db = require('../database/connection')

class UserController{
    authTokens = {}
    user = {}
    
    async create(request, response){
        const { email, username, password, confirmPassword } = request.body

        try{
            const users = [... await db('users').select('*')]

            if(password === confirmPassword){
                if(users.find(user => user.email === email)){
                    return response.status(400).json({ message: 'Usuário já está registrado no sistema.' })
                }

                const hashedPassword = getHashedCode(password)

                await db('users').insert({ username, password: hashedPassword, email })
            }
            else {
                return response.status(400).json({ message: 'As senhas são diferentes.' })
            }
        }
        catch(error){
            console.log(error)

            return response.status(400).json({ })
        }

    }
    async login(request, response, next){
        const { credential, password } = request.body
        const hashedPassword = getHashedCode(password)
        
        try{
            const users = [... await db('users').select('*')]

            const user = users.find(u => {
                if(credential){
                    return (u.email == credential || u.username == credential) && hashedPassword == u.password
                }
                else{
                    return false
                }
            })

            if(user){
                const authToken = generateAuthToken()
                /*response.locals.authTokens = {}
                response.locals.authTokens[authToken] = user*/
                this.authTokens[authToken] = user

                response.header('authtoken', authToken).json({ message: 'O usuário está logado.' }).status(200)

                next()
            }
            else {
                return response.status(400).json({ message: 'Usuário ou senha incorreta' })
            }
        }
        catch(error){
            return response.status(400).json({ })
        }
    }

    setAuthorization(request, response, next){
        const auth = request.headers['user']

        if(Object.entries(this.authTokens).length)
            this.user = this.authTokens[auth]
        
        next()
    }

    authorize(request, response, next){
        if(!this.user) return response.status(401).json({ message: 'You must be logged in' })

        next()
    }
}

/* 
(request, response) => authTokens = response.locals.authTokens

router.use((request, response, next) => {
    const auth = request.headers['user']

    if(Object.entries(authTokens).length){
        response.locals.user = authTokens[auth]
    }

    next()
})*/

module.exports = UserController