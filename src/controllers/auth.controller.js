const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { user } = require('../../models');
const { validationResult } = require('express-validator');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "ACCESS_NODEJS_ASSESSMENT";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "REFRESH_NODEJS_ASSESSMENT";

const validateRefreshToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Token has expired' });
                } else {
                    return res.status(403).json({ message: 'Invalid token' });
                }
            }
            resolve(user);
        });
    });
};

// @desc : auth register
// @path : /api/auth/register  == POST
const authRegister = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await user.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Create new user
        const newUser = await user.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'admin',  // Default role set to 'user'
            status: 'active'   // Default 'status' to 'active'
        });

        // Send success response
        return res.status(201).json({
            message: 'user created successfully!',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

};

// @desc : auth login
// @path : /api/auth/login  == POST
const authLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await user.findOne({ where: { email } });
        if (!existingUser) {
            return res.status(400).json({ message: 'Wrong credential' });
        }

        // Check if the user's status is active
        if (existingUser.status !== 'active') {
            return res.status(403).json({ message: `you're account have been ${existingUser.status}` });
        }

        const userId = existingUser.dataValues.id
        const isPasswordValid = await bcrypt.compare(password, existingUser?.dataValues?.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Wrong password' });
        }

        // Generate access token
        const accessToken = jwt.sign({ userId: userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        // Generate refresh token
        const refreshToken = jwt.sign({ userId: userId }, REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

        // Optionally, you can store the refresh token in the database for validation later.

        // Send success response with tokens
        return res.status(200).json({
            message: 'You have logged in successfully!',
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error('Error logging user:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc : Refresh token
// @path : /api/auth/refresh  == POST
const authRefresh = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { refreshToken } = req.body;

    try {
        // Validate the refresh token
        const userData = await validateRefreshToken(refreshToken);
        const id = userData.userId
        const existingUser = await user.findByPk(id);
        if (!existingUser) {
            return res.status(403).json({ message: 'User not found' });
        }

        // Generate a new access token
        const accessToken = jwt.sign({ userId: id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        return res.status(200).json({
            message: 'Access token refreshed successfully!',
            accessToken,
        });
    } catch (error) {
        console.error('Error refreshing token:', error);
        return res.status(403).json({ message: 'Invalid refresh token' });
    }


};


module.exports = { authRegister, authLogin, authRefresh, ACCESS_TOKEN_SECRET };
