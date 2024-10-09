const userRouter = require("express").Router();
const { fetchUserSales } = require("../controllers/sales.controller");
const validateToken = require("../helpers/verifyToken");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User APIs
 */

/**
 * @swagger
 * /api/user/sales:
 *   get:
 *     summary: Retrieve sales data
 *     tags: [User]
 *     description: Fetches the sales data.
 *     responses:
 *       200:
 *         description: Sales data retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
userRouter.get('/sales', validateToken("user"), fetchUserSales)

module.exports = userRouter