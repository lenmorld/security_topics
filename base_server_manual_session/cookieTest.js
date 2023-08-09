const express = require('express');
const router = express.Router();

router.get("/cookie", (req, res) => {
    // res.cookie("theme", "dark", 10000)

    // manually using Set-Cookie
    // Set-Cookie: <cookie-name>=<cookie-value>
    // Max-Age in seconds
    // res.set('Set-Cookie', 'name=Lenny; Max-Age=10')
    // HttpOnly
    // res.set('Set-Cookie', 'theme=dark; HttpOnly')

    // can't find a way to Set-Cookie multiple with not all HttpOnly
    res.cookie('name', 'Lenny', { maxAge: 100000 })
    res.cookie('theme', 'dark', { httpOnly: true })

    res.json({ name: "Lenny"})
})

router.get("/cookie-test", (req, res) => {
    console.log("Cookie:", req.headers.cookie)
    res.json({ cookies: req.headers })
})

module.exports = router
