const express = require('express');
const router = express.Router();

const db = require('./db')

const cookieSession = require('cookie-session');

// configure session
router.use(cookieSession({
	name: 'session',
	secret: 'SECRET', // config.secret_key,   // secret to sign and verify cookie values
	httpOnly: true,   // prevents access to `document.cookie` in JS
}));

router.get("/login", async (req, res) => {
	let message
	if (req.session.error) {
		message = req.session.error
		req.session.error = null
	}

	res.render('login', {
		error: message
	});
});

router.get("/logout", async (req, res) => {
	if (req.session.loggedInUser) {
		// destroy session
		req.session.loggedInUser = null
	}

	res.redirect("/login")
})

// Login handler
router.post('/login', async (req, res) => {
	const userToAuth = req.body;

	// if (!userToAuth.username || !userToAuth.password) {
	// 	return res.json({
	// 		error: "Username and password required"
	// 	})
	// }

    // find user from DB
	// const dbCollection = await DbConnection.getCollection("users");
	// const user = await dbCollection.findOne({
	// 	username: userToAuth.username,
	// 	password: userToAuth.password
	// });

	console.log(`Authenticating ${userToAuth.username}`)

    // HARD-CODE for now
    const user = db.users[userToAuth.username]
    if (user && userToAuth.password === user.password) {
        // SUCCESSFUL LOGIN
        // set session to userId
        req.session.loggedInUser = {
            id: user.id,
            username: userToAuth.username
            // DONT put password in session
        }

		// SUCCESSFUL LOGIN
		// res.json({
		// 	message: `successful login for ${user.username}`
		// });

        res.redirect('/account')
    } else {
		return res.render('login', {
			error: "Login failed"
		})

		// return res.json({
		// 	error: "Login failed"
		// })
    }
});

module.exports = router