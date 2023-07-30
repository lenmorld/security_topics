// simulate a DB

const STARTING_BALANCE = 10000

const db = {
    users: {
        "lenny": {
            id: 1,
            username: "lenny",
            password: "abcd1234",
            name: 'Lenny',
            email: 'lenny@example.com',
            // account details
            balance: STARTING_BALANCE
        },
        "tammy": {
            id: 2,
            username: "tammy",
            password: "abcd1234",
            name: 'Tammy',
            email: 'tammy@example.com',
            // account details
            balance: STARTING_BALANCE
        },  
        // hacker can be a legit user with
        // actual bank account
        "hacky": {
            id: 3,
            username: "hacky",
            password: "abcd1234",
            name: 'hacky',
            email: 'hacky@example.com',
            // account details
            balance: STARTING_BALANCE
        }, 
    }
}

module.exports = db