require('dotenv').config()

const express = require('express')
const app = express()

const { authenticateToken } = require('./middlewares/authenticate')

const PORT = 3000

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

// AUTH logic moved to authServer
// app.post('/login', (req, res) => {...}

// MIDDLEWARE moved to middlewares
// function authenticateToken(req, res, next) {...}

app.listen(PORT)
