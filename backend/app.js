require('dotenv').config()

const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const routes = require('./src/routes')

const { errors } = require('celebrate')

const app = express()

const corsOptions = {
  exposedHeaders: 'authtoken'
}

app.use(express.json())
app.use(cookieParser())
app.use(errors())
app.use(cors(corsOptions))

app.use('/', routes)

app.listen(process.env.PORT || 3333, () => console.log(`App is running...`))