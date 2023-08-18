# Security experiments

## Session-based auth
- open base_server README.md

## CSRF

Flow and mitigation details: see [CSRF - Notion page](https://lennythedev.notion.site/CSRF-XSRF-1fba94cdc85c472d8746bc885262af37?pvs=4)
#
- open base_server_2
- `npm install && npm start`
- runs at localhost:4000
#
- /login - to Login, see users available in db.js
- /account - gated page
    - also has a Transfer money feature, that is vulnerable to CSRF

### Attack examples
- Set MITIGATION_STRATEGY in flags.js
  - Search for MITIGATION_STRATEGY to see all CSRF-related logic
- Request by logged in user /account should work
- open hackers/index.html in a browser
  - click the buttons that submit attacker-crafted request
  - Request by attacker should be blocked
- When changing strategy, logout then login again. See /login
#
* uses cookie-session to manage session

## XSS

Flow and mitigation details: see [XSS - Notion page](https://lennythedev.notion.site/XSS-0d5819f127744824ba29e5ccfa6b19dc?pvs=4)

- open base_server_2
- `npm install && npm start`
- runs at localhost:4000
#
- see xss.js for routes and sample attacks
- enable or disable MITIGATION_ENABLED flag
- inject scripts on the URL, 
  - e.g. `http://localhost:4000/reflected-1?name=<script>alert(1)</script>`
#
- run attackers_server/
  - see server.js for sample exploits coming from an attacker-controlled site
  - for "cookie grab" attack, run attackers_server/ and point script to http://localhost:4001


## JWT Auth

See README.md in jwt_auth/