const crypto = require('crypto')

const generateAuthToken = () => crypto.randomBytes(30).toString('hex')

module.exports = generateAuthToken