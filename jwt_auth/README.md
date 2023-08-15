https://www.youtube.com/watch?v=mbsmsi7l3r4


JWT 

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

