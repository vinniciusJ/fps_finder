require('dotenv').config()

const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const { errors } = require('celebrate')

const routes = require('./src/routes')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(errors())
app.use(cors({ exposedHeaders: 'authtoken' }))

app.use('/', routes)

console.log('output')

app.listen(process.env.PORT || 3333, () => console.log(`App is running...`))