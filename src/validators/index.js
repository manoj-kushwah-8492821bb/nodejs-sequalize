const { check } = require("express-validator");

const register_validator = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
]

const login_validator = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
]

const refresh_validator = [
    check('refreshToken', 'Please provide refresh token').not().isEmpty(),
]

module.exports = { register_validator, login_validator, refresh_validator }