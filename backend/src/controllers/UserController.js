const getHashedCode = require('../utils/getHashedCode')
const generateAuthToken = require('../utils/generateAuthToken')

const db = require('../database/connection')

class UserController{

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
        const { email, password } = request.body
        const hashedPassword = getHashedCode(password)

        try{
            const users = [... await db('users').select('*')]

            const user = users.find(u => {
                if(email){
                    return u.email == email && hashedPassword == u.password
                }
                else{
                    return false
                }
            })

            if(user){
                const authToken = generateAuthToken()
                
                response.locals.authTokens = {}
                response.locals.authTokens[authToken] = user

                response.header('authtoken', authToken).json({ message: 'O usuário está logado.' }).status(200)

                next()
            }
            else {
                return response.status(400).json({ message: 'Usuário ou senha incorreta' })
            }
        }
        catch(error){
            console.log(error)

            return response.status(400).json({ })
        }
    }
     
}

module.exports = UserController