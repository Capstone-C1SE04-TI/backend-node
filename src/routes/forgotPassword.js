const express = require("express");
const router = express.Router();
const forgotPasswordController = require("../controllers/ForgotPassword");

/**
 * @swagger
 * tags:
 *   name: Forgot Password
 */

/**
 * @swagger
 * /forgot-password/submit-email:
 *   post:
 *     description: Submit Email
 *     tags: [Forgot Password]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                  type: string
 *             example:
 *               email: "hieuhn@gmail.com"
 *     responses:
 *       200:
 *         description: Submit email successfully
 *       400:
 *         description: Submit email failed
 *       404:
 *         description: Not found
 */
router.post("/submit-email", forgotPasswordController.submitEmail);

/**
 * @swagger
 * /forgot-password/submit-code:
 *   post:
 *     description: Submit Code
 *     tags: [Forgot Password]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                  type: string
 *               code:
 *                  type: string
 *             example:
 *               email: "hieuhn@gmail.com"
 *               code: "123456"
 *     responses:
 *       200:
 *         description: Submit code successfully
 *       400:
 *         description: Submit code failed
 */
router.post("/submit-code", forgotPasswordController.submitCode);

/**
 * @swagger
 * /forgot-password/resend-code:
 *   post:
 *     description: Resend Code
 *     tags: [Forgot Password]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                  type: string
 *               code:
 *                  type: string
 *             example:
 *               email: "hieuhn@gmail.com"
 *               code: "123456"
 *     responses:
 *       200:
 *         description: Resend code successfully
 *       400:
 *         description: Resend code failed
 */
router.post("/resend-code", forgotPasswordController.resendCode);

/**
 * @swagger
 * /forgot-password/create-new-password:
 *   post:
 *     description: Create New Password
 *     tags: [Forgot Password]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                  type: string
 *               password:
 *                  type: string
 *               confirmPassword:
 *                  type: string
 *             example:
 *               email: "hieuhn@gmail.com"
 *               password: "12345678"
 *               confirmPassword: "12345678"
 *     responses:
 *       200:
 *         description: Create new password successfully
 *       400:
 *         description: Create new password failed
 */
router.post("/create-new-password", forgotPasswordController.createNewPassword);

module.exports = router;
