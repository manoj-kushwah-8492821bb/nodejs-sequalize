const bcrypt = require('bcrypt');
const { user } = require('../../models');
const { authRegister } = require('./auth.controller');

// @desc : fetch all users
// @path : /api/admin/users  == GET
const fetchUsers = async (req, res) => {
    try {
        const userList = await user.findAll();
        // Send success response
        return res.status(201).json({
            message: 'all users list!',
            users: userList
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc : get user details
// @path : /api/admin/user/:id  == GET
const getUserDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const userData = await user.findByPk(id);
        // Send success response
        return res.status(201).json({
            message: 'users details',
            users: userData
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc : create new user
// @path : /api/admin/user == POST
const createNewUser = async (req, res) => {
    req.body = { ...req.body, role: "user" }
    return authRegister(req, res);
};

// @desc : update user details
// @path : /api/admin/user/:id  == PUT
const updateUser = async (req, res) => {
    const { id } = req.params; // Get the user ID from request parameters
    const userData = req.body;

    try {
        const existingUser = await user.findByPk(id);
        if (!existingUser) {
            return res.status(403).json({ message: 'User not found' });
        }

        // Check if the password is in the body and hash it
        if (userData.password) {
            const saltRounds = 10;
            userData.password = await bcrypt.hash(userData.password, saltRounds);
        }

        // Update the user by ID
        const [updated] = await user.update(userData, {
            where: { id }, // Ensure you filter by the user ID
        });

        // Check if the user was updated
        if (!updated) {
            return res.status(404).json({ message: 'User not found or no changes made' });
        }

        // Send success response
        return res.status(200).json({
            message: 'User details updated successfully',
            user: { id, ...userData }, // Return updated user data (optional)
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc : user delete
// @path : /api/admin/user/:id  == DELETE
const deleteUser = async (req, res) => {
    const { id } = req.params; // Get the user ID from request parameters

    try {
        const existingUser = await user.findByPk(id);
        if (!existingUser) {
            return res.status(403).json({ message: 'User not found' });
        }

        // delete the user by ID
        await user.update({ status: "deleted" }, {
            where: { id }, // Ensure you filter by the user ID
        });

        // Send success response
        return res.status(200).json({
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


module.exports = { fetchUsers, deleteUser, updateUser, getUserDetails, createNewUser }