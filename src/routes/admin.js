const express = require("express");
const router = express.Router();
const adminController = require("../controllers/Admin");
const { isAdmin } = require("../middlewares/authentication");

/**
 * @swagger
 * /admin/signin:
 *   post:
 *     description: Sign In
 *     tags: [Admin]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                  type: string
 *               password:
 *                  type: string
 *             example:
 *               username: "hieuhn"
 *               password: "12345678"
 *     responses:
 *       200:
 *         description: Sign in successfully
 *       400:
 *         description: Sign in failed
 */
router.post("/signin", adminController.signin);

/**
 * @swagger
 * /admin/signout:
 *   post:
 *     description: Sign Out
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Sign out successfully
 *       400:
 *         description: Sign out failed
 */
router.post("/signout", adminController.signout);

/**
 * @swagger
 * /admin/delete-user:
 *   post:
 *     description: Delete user
 *     tags: [Admin]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                  type: string
 *             example:
 *               id: "10"
 *     responses:
 *       200:
 *         description: Delete user successfully
 *       400:
 *         description: Delete user failed
 */
router.post("/delete-user", adminController.deleteUser);

/**
 * @swagger
 * /admin/user/list:
 *   get:
 *     description: Get list of users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Get list of users successfully
 *       400:
 *         description: Get list of users failed
 */
router.get("/user/list", adminController.getUsersList);

/**
 * @swagger
 * /admin/user/details:
 *   get:
 *     description: Get detail user
 *     tags: [Admin]
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
router.get("/user/details", adminController.getUserDetail);

module.exports = router;
