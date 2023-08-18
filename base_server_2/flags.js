const MITIGATION_STRATEGIES = {
    // csrf token using library csurf - only works on POST requests
    CSRF_SYNC_TOKEN_1: 'CSRF_SYNC_TOKEN_1',
    // csrf token manually created from session
    CSRF_SYNC_TOKEN_2: 'CSRF_SYNC_TOKEN_2',
    // csrf token from cookie
    DOUBLE_SUBMIT_COOKIE: 'DOUBLE_SUBMIT_COOKIE',
    // csrf custom header
    CUSTOM_HEADER: 'CUSTOM_HEADER',
}

// set this as needed
// or null for no mitigation
const MITIGATION_STRATEGY = MITIGATION_STRATEGIES.CUSTOM_HEADER

module.exports = {
    MITIGATION_STRATEGIES,
    MITIGATION_STRATEGY
}
