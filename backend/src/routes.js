const express = require('express')
const { Joi, celebrate, Segments } = require('celebrate')

const GamesController = require('./controllers/GamesController')
const CombinationsController = require('./controllers/CombinationsController')
const UserController = require('./controllers/UserController')

const router = express.Router()

const gamesController = new GamesController()
const combinationsController = new CombinationsController()
const userController = new UserController()

const games = {
    post: [
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                name: Joi.string().required(),
                url_logo: Joi.string().required()
            })
        }),
        gamesController.create
    ],
    put: [
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
    delete: [
        userController.authorize.bind(userController),
        celebrate({
            [Segments.BODY]: Joi.object().keys({ id: Joi.number().required() })
        }),
        combinationsController.delete
    ],
    post: [
        userController.authorize.bind(userController),
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
            [Segments.QUERY]: Joi.object().keys({
                name: Joi.string(),
                graphic_card: Joi.string(),
                processor: Joi.string(),
                ram_memory: Joi.string()
            }),
            [Segments.PARAMS]: Joi.object().keys({
                id: Joi.number()
            })
        }),
        combinationsController.index
    ],
    put: [
        userController.authorize.bind(userController),
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                id: Joi.number().required(), name: Joi.string().required(), graphic_card: Joi.string().required(),
                processor: Joi.string().required(), ram_memory: Joi.string().required(),
                motherboard: Joi.string().required(), fps_averages: Joi.array().required()
            })
        }),
        combinationsController.update
    ]
}

const login = {
    post: [
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                credential: Joi.string(),
                password: Joi.string().required()
            })
        }),
        userController.login.bind(userController)
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
        userController.create.bind(userController)
    ] 
}

router.use(userController.setAuthorization.bind(userController))

router.route('/games')
    .post(games.post)
    .put(games.put)
    .get(games.get)

router.route('/combinations')
    .delete(combinations.delete)
    .post(combinations.post)
    .get(combinations.get)
    .put(combinations.put)

router.get('/combinations/:id', combinations.get)  

router.post('/login', login.post)
router.post('/user', user.post)

module.exports = router