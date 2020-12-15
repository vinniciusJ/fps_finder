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
                    return response.status(400).json({ message: 'User already registered' })
                }

                const hashedPassword = getHashedCode(password)

                await db('users').insert({ username, password: hashedPassword, email })
            }
            else {
                return response.status(400).json({ message: 'Password do not match' })
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
                    return u.email === email && hashedPassword === u.password
                }
                else if(username){
                    return u.username === username && hashedPassword === u.password
                }
                else{
                    return false
                }
            })

            if(user){
                const authToken = generateAuthToken()
                
                response.locals.authTokens = {}
                response.locals.authTokens[authToken] = user

                response.status(200).cookie('AuthToken', authToken).json({ message: 'User is logged in' })

                next()
            }
            else {
                return response.status(400).json({ message: 'Invalid username or password' })
            }
        }
        catch(error){
            console.log(error)

            return response.status(400).json({ })
        }
    }
     
}

module.exports = UserController