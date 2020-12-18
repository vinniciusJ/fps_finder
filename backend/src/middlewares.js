const { Joi, celebrate, Segments } = require('celebrate')

const requireAuth = require('./utils/requireAuth')

const GamesController = require('./controllers/GamesController')
const CombinationsController = require('./controllers/CombinationsController')
const UserController = require('./controllers/UserController')

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
        requireAuth,
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
        requireAuth,
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