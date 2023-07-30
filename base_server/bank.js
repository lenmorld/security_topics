const express = require('express');
const router = express.Router();

const db = require('./db')

const csurf = require('csurf');

const  { isPageAuthorized} = require("./middlewares/authorize")

// csrf
const csrfMiddleware = csurf({
    // token stored in req.session
    cookie: false 
});
// apply to entire app
router.use(csrfMiddleware);

// Protected page - only for Authenticated users' access
// see authorize middleware
router.get("/account", isPageAuthorized, async (req, res) => {
    const sessionUser = req.session.loggedInUser
    const dbUser = db.users[sessionUser.username]

	res.render('account', {
		user: dbUser,
        // mitigation #1: csrf synchronizer token
        csrfToken: req.csrfToken()
	})
});

function transferMoney(req, res, userParam, amountParam ) {
    const sessionUser = req.session.loggedInUser
 
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
    } else {
        // take out money
        dbUser.balance -= Number(amountParam)
        message = `Money successfully transferred to ${dbRecipientUser.username}`
    }

    return res.render('account', {
		user: dbUser,
        message,
        csrfToken: req.csrfToken()
	})
}

// attack vector #1: using GET for state change operations
// GET /transfer?amount=100&recipient=tammy
router.get("/transfer", isPageAuthorized, (req, res) => {
    console.log(req.query)

    return transferMoney(req, res, req.query.recipient, req.query.amount)
})

// POST /transfer { amount: 100, recipient: "tammy"}
// router.post("/transfer", isPageAuthorized, (req, res) => {
router.post("/transfer", isPageAuthorized, (req, res) => {
    console.log(req.body)

    return transferMoney(req, res, req.body.recipient, req.body.amount)
})

module.exports = router