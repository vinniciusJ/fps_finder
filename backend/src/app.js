const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')

const routes = require('./routes')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/', routes)


app.listen(process.env.PORT || 3333, () => console.log(`App is running...`))