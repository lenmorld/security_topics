// middleware
function isPageAuthorized(req, res, next) {
    const authorizedPages = ['/resource']

    if (authorizedPages.includes(req.path)) {
        if (req.session.loggedInUser) {
            console.log("authorized to access page")
            next()
        } else {
            console.log("not logged in. redirect to login")
            res.redirect('/login')
        }

    } else {
        next()
    }
}

module.exports = isPageAuthorized