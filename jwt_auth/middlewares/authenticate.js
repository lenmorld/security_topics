const jwt = require('jsonwebtoken')

// authenticate middleware
function authenticateToken(req, res, next) {
    // verify that this is a user

    // get token from header
    // Authorization: Bearer TOKEN

    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1]

    if (!token) {
        // no credentials
        return res.sendStatus(401)
    }

    // verify token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,
        (err, user) => {
            console.log("user in JWT: ", user)

            if (err) {
                // invalid credentials
                res.sendStatus(401)
            }
            req.user = user
            next()
        })
}

module.exports = {
    authenticateToken
}