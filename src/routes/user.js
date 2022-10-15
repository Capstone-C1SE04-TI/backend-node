const express = require("express");
const router = express.Router();
const userController = require("../controllers/User");

/**
 * @swagger
 * tags:
 *   name: User
 */

/**
 * @swagger
 * /user/list:
 *   get:
 *     description: Get list of users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Get list of users successfully
 *       401:
 *         description: Get list of users failed
 *       400:
 *         description: Bad request
 */
router.get("/list", userController.getUsersList);

module.exports = router;
