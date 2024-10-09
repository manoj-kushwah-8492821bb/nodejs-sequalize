const adminRouter = require("express").Router();
const { fetchSales } = require("../controllers/sales.controller");
const { fetchUsers, updateUser, deleteUser, getUserDetails, createNewUser } = require("../controllers/user.controller");
const validateToken = require("../helpers/verifyToken");
const { register_validator } = require("../validators");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin APIs
 */

/**
 * @swagger
 * /api/admin/sales:
 *   get:
 *     summary: Retrieve sales data
 *     tags: [Admin]
 *     description: Fetches the sales data.
 *     responses:
 *       200:
 *         description: Sales data retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
adminRouter.get('/sales', validateToken("admin"), fetchSales);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Retrieve user list
 *     tags: [Admin]
 *     description: Fetches the list of users.
 *     responses:
 *       200:
 *         description: User list retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
adminRouter.get('/users', validateToken("admin"), fetchUsers);

/**
 * @swagger
 * /api/admin/user:
 *   post:
 *     summary: Create a new user
 *     tags: [Admin]
 *     description: Creates a new user with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Bad request (validation error).
 *       500:
 *         description: Internal server error.
 */
adminRouter.post('/user', validateToken("admin"), register_validator, createNewUser);

/**
 * @swagger
 * /api/admin/user/{id}:
 *   get:
 *     summary: Retrieve user details
 *     tags: [Admin]
 *     description: Fetches the details of a user by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
adminRouter.get('/user/:id', validateToken("admin"), getUserDetails);

/**
 * @swagger
 * /api/admin/user/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Admin]
 *     description: Updates the details of a user by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *               status:
 *                 type: string
 *                 enum: [active, suspended, deleted]
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Bad request (validation error).
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
adminRouter.put('/user/:id', validateToken("admin"), updateUser);

/**
 * @swagger
 * /api/admin/user/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     description: Deletes a user by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
adminRouter.delete('/user/:id', validateToken("admin"), deleteUser);

module.exports = adminRouter;
