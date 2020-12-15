const express = require('express')

const GamesController = require('./controllers/GamesController')
const CombinationsController = require('./controllers/CombinationsController')
const UserController = require('./controllers/UserController')

const router = express.Router()

const gamesController = new GamesController()
const combinationsController = new CombinationsController()
const userController = new UserController()

let authTokens = {}

router.use((request, response, next) => {
    const auth = request.cookies['AuthToken']

    if(Object.entries(authTokens).length){
        request.user = authTokens[auth]
    }

    next()
})

const requireAuth = (request, response, next) => {
    if(!request.user) return response.status(400).json({ message: 'You must be logged in' })

    next()
}

router.route('/games')
    .post(requireAuth, gamesController.create)
    .put(requireAuth, gamesController.update)
    .get(gamesController.index)

router.route('/combinations')
    .post(requireAuth, combinationsController.create)
    .get(combinationsController.index)
    .put(requireAuth, combinationsController.update)
    .delete(requireAuth, combinationsController.delete)

router.route('/user')
    .post(userController.create)
    .get(userController.login, (request, response) => authTokens = response.locals.authTokens)


module.exports = router