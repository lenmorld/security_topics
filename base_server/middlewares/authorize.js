// middleware
function isPageAuthorized(req, res, next) {
    // NO NEED TO WHITE-LIST routes,
    // only use this middleware in routes we want to authorize


    // const authorizedPages = ['/account']

    // if (authorizedPages.includes(req.path)) {

    if (req.session.loggedInUser) {
        console.log("authorized to access page")
        next()
    } else {
        console.log("Function not authorized. Please login")
        req.session.error = "Not authorized. Please login"
        res.redirect('/login')
    }

    // } else {
    //     next()
    // }
}

module.exports =  {
    isPageAuthorized
}