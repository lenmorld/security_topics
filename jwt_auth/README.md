https://www.youtube.com/watch?v=mbsmsi7l3r4

# JWT 

## part 1 - authentication

```
npm start
```
this starts server 1 on http://localhost:3000

- on successful login, create JWT, by serializing user info with a secret
- authenticateToken middleware for protected requests
- verify token exist and valid using secret


## part 2 - use JWT on multiple servers

```
npm start
npm start2
```
this starts server 1 on http://localhost:3000 
and server 2 on http://localhost:3001


- two servers share the same ACCESS_TOKEN_SECRET
- allow login on server1 or server2, and staying authenticated between them when using the JWT

both requests work with same accessToken
- GET http://localhost:3000/posts 
  Authorization: Bearer accessToken

- GET http://localhost:3001/posts 
  Authorization: Bearer accessToken

## part 3 - DRY both servers

- separate authentication only to 1 server

## part 4 - refresh token

```
npm start
npm start2
```
this starts server on http://localhost:3000 
and "auth server" on http://localhost:3001

- access token should expire to make it more secure
  - in case someone else gets access, they shouldn't be able to use it forever

- access token should have a short expiry, 
- user must use refresh token to get new one (possibly increasing expiry)
- can invalidate refresh tokens on /logout, to mitigate it being stolen


# Overall flow:

1. user /login;  server returns access token and refresh token
2. user can use access token to access gated resource, e.g /posts, for a limited time
3. once access token expires, user can request a new access token using refresh token
4. user can invalidate refresh token on /logout

NOTES:
1. on login, server creates access token by serializing user info and signing it with a secret; same with refresh token but with a different secret
2. authentication is done via middleware, to reuse on any gated resource
   - server validates token using signature  
3. server validates token using signature 
4. server deletes the refresh token