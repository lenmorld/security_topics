const express = require('express');
const router = express.Router();

const db = require('./db')

const  { isPageAuthorized } = require("./middlewares/authorize")

// Protected page - only for Authenticated users' access
// see authorize middleware
router.get("/account", isPageAuthorized, async (req, res) => {
    const sessionUser = req.session.loggedInUser
    const dbUser = db.users[sessionUser.username]

	res.render('account', {
		user: dbUser,
	})
});

module.exports = router
