const express = require("express");
const router = express.Router();
const changePasswordController = require("../controllers/ChangePassword");
const { isAuth } = require("../middlewares/authentication");

/**
 * @swagger
 * tags:
 *   name: Change Password
 */

/**
 * @swagger
 * /change-password:
 *   post:
 *     description: Change Password
 *     tags: [Change Password]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - oldPassword
 *               - newPassword
 *               - newConfirmPassword
 *             properties:
 *               email:
 *                  type: string
 *               oldPassword:
 *                  type: string
 *               newPassword:
 *                  type: string
 *               newConfirmPassword:
 *                  type: string
 *             example:
 *               email: "hieuhn@gmail.com"
 *               oldPassword: "12345678"
 *               newPassword: "12345678910"
 *               newConfirmPassword: "12345678910"
 *     responses:
 *       200:
 *         description: Change password successfully
 *       400:
 *         description: Change password failed
 */
router.post("/", isAuth, changePasswordController.changePassword);

module.exports = router;
