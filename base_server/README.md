# Session-based auth

- `npm install && npm start`
- runs at localhost:4000

- /login - to Login, see users available in db.js
- /account - gated page

- uses express-session to manage session

Flow:
- /account is gated resource - authorize middleware checks if user session exists `req.session.loggedInUser`
- on successful login, server creates a session
- on /logout, server deletes session
  
For a more detailed example, 
see [Session-based (aka cookie-based) Authentication in Node workshop](https://lennythedev.notion.site/6-Intro-to-User-authentication-and-Security-a0d3934464f7439a95eba4f93e0a28b1?pvs=4#31c3dac0bd5e48899483e995833eb354)