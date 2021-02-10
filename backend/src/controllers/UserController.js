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
            return response.status(400).json({ })
        }

        return response.status(200).send()
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
        if(!this.user) return response.status(401).json({ message: 'Você deve estar logado' })

        next()
    }
}

module.exports = UserController