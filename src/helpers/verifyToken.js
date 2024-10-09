const jwt = require('jsonwebtoken');
const { user } = require('../../models')
const { ACCESS_TOKEN_SECRET } = require('../controllers/auth.controller');

const validateToken = (role = "admin") => async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    try {
        jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Token has expired' });
                } else {
                    return res.status(403).json({ message: 'Invalid token' });
                }
            }

            // Find the user by decoded token's userId
            const existingUser = await user.findByPk(decoded.userId);

            if (!existingUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if the user's status is active
            if (existingUser.status !== 'active') {
                return res.status(403).json({ message: `you're account have been ${existingUser.status}` });
            }

            // Check if the user has the correct role (admin or user)
            if (role && existingUser.role !== role) {
                return res.status(403).json({ message: `Access denied. Requires ${role} role.` });
            }

            // Add user information to request object and move to next middleware
            req.user = existingUser;
            next();
        });
    } catch (error) {
        console.error('Error validating token:', error);
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = validateToken;