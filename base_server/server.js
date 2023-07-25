const express = require('express'); 

const authRouter = require("./auth")
const authMiddleware = require("./middlewares/authorize")

const body_parser = require('body-parser');

const port = 4000;
const server = express();

server.use(body_parser.json()); // parse JSON (application/json content-type)
server.use(body_parser.urlencoded()) // parse HTML form data

// set the view engine to ejs
server.set('view engine', 'ejs');

// expose static assets: CSS, JS files, images
server.use(express.static(__dirname + '/public'));

server.use("/", authRouter);

server.get("/lenny", (req, res) => {
    res.json({ name: "Lenny" })
})

// Protected page - only for Authenticated users' access
server.get("/resource", authMiddleware, async (req, res) => {
    const foods = ['🍌', '🍎', '🍫']

	// const dbCollection = await DbConnection.getCollection("foods");
	// const foods = await dbCollection.find().toArray();

	res.render('resource', {
		foods: foods
	})
});

server.listen(port, () => { // Callback function in ES6
	console.log(`Server listening at ${port}`);
});
