const express = require('express'); 
const cookieParser = require('cookie-parser')

const authRouter = require("./auth")
const bankRouter = require("./bank")
const cookieRouter = require("./cookieTest")
const xssRouter = require('./xss')

const body_parser = require('body-parser');

const port = 4000;
const server = express();

server.use(body_parser.json()); // parse JSON (application/json content-type)
server.use(body_parser.urlencoded()) // parse HTML form data

server.use(cookieParser())

// set the view engine to ejs
server.set('view engine', 'ejs');

// expose static assets: CSS, JS files, images
server.use(express.static(__dirname + '/public'));

server.use("/", authRouter);
server.use("/", bankRouter);
server.use("/", cookieRouter);
server.use("/", xssRouter)
server.get("/", (req, res) => {
    res.render('index')
})

server.get("/lenny", (req, res) => {
    res.json({ name: "Lenny" })
})

server.listen(port, () => { // Callback function in ES6
	console.log(`Server listening at ${port}`);
});
