// copy-paste of server.js, with different PORT
// to demo usage of JWT to multiple servers

require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

const PORT = 3001

// based on body-parser 
app.use(express.json())
app.post('/login', (req, res) => {
})

app.listen(PORT)
