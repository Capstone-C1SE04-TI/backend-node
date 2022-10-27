const express = require("express");
const router = express.Router();
const adminController = require("../controllers/Admin");

/**
 * @swagger
 * tags:
 *   name: Admin
 */

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

module.exports = router;
