const express = require('express')

const app = express()

app.use(express.json())




admin.listen(process.env.PORT || 3000, () => console.log('Admin is running'))
app.listen(process.env.PORT || 3333, () => console.log(`App is running...`))