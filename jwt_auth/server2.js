// copy-paste of server.js, with different PORT
// to demo usage of JWT to multiple servers

require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

const PORT = 3001

// based on body-parser 
app.use(express.json())

const posts = [
    {
        username: 'Lenny',
        title: 'Post 1'
    },
    {
        username: 'Jimmy',
        title: 'Post 2'
    }
]

app.get('/posts', authenticateToken, (req, res) => {
    // req.user should be defined if
    // middleware reached here
    res.json(posts.filter(post => post.username === req.user.name ))
})

app.post('/login', (req, res) => {
    // auth user

    const username = req.body.username
    const user = { name: username }

    // create JWT
    // serialize user object with a secret
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken })

})

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
            if (err) {
                // invalid credentials
                res.sendStatus(401)
            }
            req.user = user
            next()
        })

}

app.listen(PORT)
