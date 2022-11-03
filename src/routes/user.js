const express = require("express");
const router = express.Router();
const userController = require("../controllers/User");
const { isAuth } = require("../middlewares/authentication");

/**
 * @swagger
 * tags:
 *   name: User
 */

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
 *               - fullName
 *               - email
 *               - phoneNumber
 *               - website
 *               - avatar
 *             properties:
 *               fullName:
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
 *               fullName: "Huynh Ngoc Hieu"
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
router.post("/profile/update", isAuth, userController.updateUserProfile);

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
router.get("/profile", isAuth, userController.getUserProfile);

module.exports = router;
