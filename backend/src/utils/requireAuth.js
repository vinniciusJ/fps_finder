const requireAuth = (request, response, next) => {
    if(!request.user) return response.status(400).json({ message: 'You must be logged in' })

    next()
}

module.exports = requireAuth