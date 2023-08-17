// copy-paste of server.js, with different PORT
// to demo usage of JWT to multiple servers

require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

const PORT = 3001

// based on body-parser 
app.use(express.json())

// normally, you would save Refresh tokens on a DB, or Redis cache
let refreshTokens = []

app.post('/login', (req, res) => {
    // auth user

    const username = req.body.username
    const user = { name: username }

    // create JWT
    // serialize user object with a secret
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    refreshTokens.push(refreshToken)
    res.json({ accessToken, refreshToken })
})

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (!refreshToken) {
        return res.sendStatus(401)
    }

    if (!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(401)
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(401)
        }

        // refresh token is valid, create new access token
        // FIXME: we can increase the expiry for each refresh
        const accessToken = generateAccessToken({ name: user.name })
        return res.json({ accessToken })
    })
})

app.post('/logout', (req, res) => {
    const refreshToken = req.body.token

    refreshTokens = refreshTokens.filter(token => token !== refreshToken)
    res.sendStatus(204) // success but no content
})

function generateAccessToken(user) {
    // expire usually longer, e.g. 30 minutes
    // 15s to TEST
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '15s'})
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: '30m'})
}


app.listen(PORT)
