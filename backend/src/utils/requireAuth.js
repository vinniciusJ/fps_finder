const requireAuth = (request, response, next) => {
    if(!response.locals.user) return response.status(401).json({ message: 'You must be logged in' })
    
    next()
}

module.exports = requireAuth