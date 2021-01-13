const requireAuth = (request, response, next) => {
    console.log(response.locals.user)
    if(!response.locals.user) return response.status(400).json({ message: 'You must be logged in' })
    
    next()
}

module.exports = requireAuth