const express = require('express');
const router = express.Router();
// const csurf = require('csurf');

const db = require('./db')

const  { isPageAuthorized} = require("./middlewares/authorize")

// mitigation #1a: CSRF token using library
// const csrfMiddleware = csurf({
//     // token stored in req.session
//     cookie: false 
// });
// apply to entire app
// router.use(csrfMiddleware);

// Protected page - only for Authenticated users' access
// see authorize middleware
router.get("/account", isPageAuthorized, async (req, res) => {
    const sessionUser = req.session.loggedInUser
    const dbUser = db.users[sessionUser.username]

	res.render('account', {
		user: dbUser,
        // mitigation #1a: CSRF token using library
        // csrfToken: req.csrfToken()
        // mitigation #1b: manually create token instead of library
        csrfToken: req.session.loggedInUser.csrfToken
	})
});

function transferMoney(req, res, requestParams ) {
    const sessionUser = req.session.loggedInUser

    const { recipient: userParam, amount: amountParam } = requestParams 
 
    if (!sessionUser) {
        console.log("User not authorized")
        return res.status(401).json({ message: "User not authorized" })
    } 

    const dbUser = db.users[sessionUser.username]
    const dbRecipientUser = db.users[userParam]

    let message = ''

    if (!dbRecipientUser) {
        console.log("recipient user not found")
        message = "Recipient user not found on system. Try again!"
    } else if (!requestParams._csrf || 
        requestParams._csrf !== req.session.loggedInUser.csrfToken) {
        // mitigation #1b: check CSRF token from session manually
        console.log("CSRF token not found")
        message = "CSRF token not found!"

        return res.render('account', {
            user: dbUser,
            message
        })
    } else {
        // take out money
        dbUser.balance -= Number(amountParam)
        message = `Money successfully transferred to ${dbRecipientUser.username}`
    }

    return res.render('account', {
		user: dbUser,
        message,
        // mitigation #1a: csrf synchronizer token
        // csrfToken: req.csrfToken()
        // mitigation #1b: manually create csrf instead of library
        csrfToken: req.session.loggedInUser.csrfToken
	})
}

// attack vector #1: using GET for state change operations
// GET /transfer?amount=100&recipient=tammy
router.get("/transfer", isPageAuthorized, (req, res) => {
    console.log(req.query)

    return transferMoney(req, res, req.query)
})

// POST /transfer { amount: 100, recipient: "tammy"}
// router.post("/transfer", isPageAuthorized, (req, res) => {
router.post("/transfer", isPageAuthorized, (req, res) => {
    console.log(req.body)

    return transferMoney(req, res, req.body)
})

module.exports = router