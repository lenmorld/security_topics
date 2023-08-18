const express = require('express');
const router = express.Router();
const csurf = require('csurf');

const db = require('./db')
const { MITIGATION_STRATEGY, MITIGATION_STRATEGIES } = require("./flags")

const { isPageAuthorized } = require("./middlewares/authorize")

if (MITIGATION_STRATEGY === MITIGATION_STRATEGIES.CSRF_SYNC_TOKEN_1) {
    const csrfMiddleware = csurf({
        // token stored in req.session
        cookie: false
    });
    // apply to entire app
    router.use(csrfMiddleware);
}

function getCsrfToken(req) {
    let csrfToken = null

    switch (MITIGATION_STRATEGY) {
        case MITIGATION_STRATEGIES.CSRF_SYNC_TOKEN_1: {
            // from library
            csrfToken = req.csrfToken()
            break
        }
        case MITIGATION_STRATEGIES.CSRF_SYNC_TOKEN_2: {
            // from session (manually created)
            csrfToken = req.session.loggedInUser.csrfToken
            break
        }
        case MITIGATION_STRATEGIES.DOUBLE_SUBMIT_COOKIE: {
            // from Cookie
            csrfToken = req.cookies['csrf-token']
            break
        }
    }

    return csrfToken
}

// Protected page - only for Authenticated users' access
// see authorize middleware
router.get("/account", isPageAuthorized, async (req, res) => {
    const sessionUser = req.session.loggedInUser
    const dbUser = db.users[sessionUser.username]

    res.render('account', {
        user: dbUser,
        csrfToken: getCsrfToken(req),
        ...(MITIGATION_STRATEGY === MITIGATION_STRATEGIES.CUSTOM_HEADER ? {
            customHeader: 'XSRF-TOKEN',
            customHeaderValue: 'anything',
        }: {})
    })
});

function transferMoney(req, res, requestParams, apiMode) {
    const sessionUser = req.session.loggedInUser

    const { recipient: userParam, amount: amountParam } = requestParams

    if (!sessionUser) {
        console.log("User not authorized")
        return res.status(401).json({ message: "User not authorized" })
    }

    const dbUser = db.users[sessionUser?.username]
    const dbRecipientUser = db.users[userParam]

    let message = ''

    if (!dbRecipientUser) {
        console.log("recipient user not found")
        message = "Recipient user not found on system. Try again!"
    } else if (MITIGATION_STRATEGY === MITIGATION_STRATEGIES.DOUBLE_SUBMIT_COOKIE &&
        // state-less, CSRF not stored in server
        // verify if value in cookie matches the one in request param
        (!requestParams._csrf ||
            requestParams._csrf !== req.cookies['csrf-token']
        )
    ) {
        console.log("[DOUBLE_SUBMIT_COOKIE]: CSRF token cookie does not match the one in request")
        message = "CSRF token cookie does not match the one in request"

        return res.render('account', {
            user: dbUser,
            message
        })
    } else if (MITIGATION_STRATEGY === MITIGATION_STRATEGIES.CSRF_SYNC_TOKEN_2 &&
        (!requestParams._csrf ||
            requestParams._csrf !== req.session.loggedInUser.csrfToken)) {
        // check CSRF token from session manually
        console.log("[CSRF_SYNC_TOKEN_2] CSRF token not found")
        message = "CSRF token not found!"

        return res.render('account', {
            user: dbUser,
            message
        })
    } else if (MITIGATION_STRATEGY === MITIGATION_STRATEGIES.CUSTOM_HEADER && 
        !req.get('XSRF-TOKEN') ) {

        console.log("[CUSTOM_HEADER] CSRF custom header not found")
        message = "CSRF custom header not found!"

        return res.render('account', {
            user: dbUser,
            message
        })
    } else {
        // take out money
        dbUser.balance -= Number(amountParam)
        message = `Money successfully transferred to ${dbRecipientUser.username}`
    }

    if (apiMode) {
        res.json({
            message
        })
    } else {
        console.log("success from backend")

        // return res.redirect('/account')
        if (MITIGATION_STRATEGY === MITIGATION_STRATEGIES.CUSTOM_HEADER) {
            return res.json({
                message,
                user: dbUser
            })
        }

        return res.render('account', {
            user: dbUser,
            message,
            csrfToken: getCsrfToken(req)
        })
    }
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

// API endpoint
// skip API auth for now, just make it open for demo
router.post("/api/transfer", (req, res) => {
    const apiUser = req.body.username || ''
    const dbUser = db.users[apiUser]

    if (!dbUser) {
        console.log("API User not found")
        return res.status(401).json({ message: "API User not found" })
    }

    // for API, set from username in body
    req.session.loggedInUser = req.body 

    return transferMoney(req, res, req.body, true)
})

module.exports = router
