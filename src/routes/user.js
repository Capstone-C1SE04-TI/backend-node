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
 * /user/profile/update:
 *   post:
 *     description: Update user profile
 *     tags: [User]
 *     parameters:
 *      - in: query
 *        name: userId
 *        schema:
 *          type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - phoneNumber
 *               - website
 *               - avatar
 *             properties:
 *               username:
 *                  type: string
 *               email:
 *                  type: string
 *               phoneNumber:
 *                  type: string
 *               website:
 *                  type: string
 *               avatar:
 *                  type: string
 *             example:
 *               username: "hieuhn"
 *               email: "hieuhn@gmail.com"
 *               phoneNumber: "0366871673"
 *               website: "https://www.britannica.com/biography/Elon-Musk"
 *               avatar: "https://res.cloudinary.com/dhzbsq7fj/image/upload/v1643101647/avatardefault_92824_aifry9.png"
 *     responses:
 *       200:
 *         description: Update user profile successfully
 *       400:
 *         description: Update user profile failed
 */
router.post("/profile/update", userController.updateUserProfile);

/**
 * @swagger
 * /user/profile:
 *   get:
 *     description: Get user profile
 *     tags: [User]
 *     parameters:
 *      - in: query
 *        name: userId
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Get user profile successfully
 *       400:
 *         description: Get user profile failed
 */
router.get("/profile", userController.getUserProfile);

module.exports = router;
