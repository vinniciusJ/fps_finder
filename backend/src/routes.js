const express = require('express')

const { Joi, celebrate, Segments } = require('celebrate')

const GamesController = require('./controllers/GamesController')
const CombinationsController = require('./controllers/CombinationsController')
const UserController = require('./controllers/UserController')

const requireAuth = require('./utils/requireAuth')

const router = express.Router()

const gamesController = new GamesController()
const combinationsController = new CombinationsController()
const userController = new UserController()

let authTokens = {}

const games = {
    post: [
        requireAuth,
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                name: Joi.string().required(),
                url_logo: Joi.string().required()
            })
        }),
        gamesController.create
    ],
    put: [
        requireAuth,
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                id: Joi.number().required(),
                name: Joi.string(),
                url_logo: Joi.string()
            })
        }),
        gamesController.update
    ],
    get: [
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                filterOption: Joi.string()  
            })
        }),
        gamesController.index
    ]
}

const combinations = {
    post: [
        requireAuth,
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                name: Joi.string().required(), graphic_card: Joi.string().required(),
                processor: Joi.string().required(), ram_memory: Joi.string().required(),
                motherboard: Joi.string().required(), fps_averages: Joi.array().required()
            })
        }),
        combinationsController.create
    ],
    get: [
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                components: Joi.object().keys({
                    graphic_card: Joi.string(),
                    processor: Joi.string(),
                    ram_memory: Joi.string()
                }),
                name: Joi.string()
            })
        }),
        combinationsController.index
    ],
    put: [
        requireAuth,
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                id: Joi.number().required(), name: Joi.string().required(), graphic_card: Joi.string().required(),
                processor: Joi.string().required(), ram_memory: Joi.string().required(),
                motherboard: Joi.string().required(), fps_averages: Joi.array().required()
            })
        }),
        gamesController.update
    ],
    delete: [
        requireAuth,
        celebrate({
            [Segments.BODY]: Joi.object().keys({ id: Joi.number().required() })
        }),
        combinationsController.delete
    ]
}

const user = {
    post: [
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                email: Joi.string().required(),
                username: Joi.string().required(),
                password: Joi.string().required(),
                confirmPassword: Joi.string().required()
            })
        }),
        userController.create
    ],
    get: [
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                email: Joi.string(),
                username: Joi.string(),
                password: Joi.string().required()
            })
        }),
        userController.login,
        (request, response) => authTokens = response.locals.authTokens
    ]
}

router.use((request, response, next) => {
    const auth = request.cookies['AuthToken']

    if(Object.entries(authTokens).length){
        request.user = authTokens[auth]
    }

    next()
})

router.route('/games')
    .post(games.post)
    .put(games.put)
    .get(games.get)

router.route('/combinations')
    .post(combinations.post)
    .get(combinations.get)
    .put(combinations.put)
    .delete(combinations.delete)

router.route('/user')
    .post(user.post)
    .get(user.get)

module.exports = router