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
 *       400:
 *         description: Get list of users failed
 */
router.get("/list", userController.getUsersList);

/**
 * @swagger
 * /user/details:
 *   get:
 *     description: Get detail user
 *     tags: [User]
 *     parameters:
 *      - in: query
 *        name: userId
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Get detail user successfully
 *       400:
 *         description: Get detail user failed
 */
router.get("/details", userController.getUserDetail);

module.exports = router;
