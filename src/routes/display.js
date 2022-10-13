const express = require("express");
const router = express.Router();
const displayController = require("../controllers/Display");

/**
 * @swagger
 * tags:
 *   name: Display
 */

/**
 * @swagger
 * /display/coins-and-tokens:
 *   get:
 *     description: Get list of coins
 *     tags: [Display]
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Get list of coins successfully
 *       401:
 *         description: Get list of coins failed
 *       400:
 *         description: Bad request
 */
router.get("/coins-and-tokens", displayController.getCoinsAndTokens);

/**
 * @swagger
 * /display/coins/trending:
 *   get:
 *     description: Get list of 10 trending coins
 *     tags: [Display]
 *     responses:
 *       200:
 *         description: Get list 10 trending coins successfully
 *       401:
 *         description: Get list 10 trending coins failed
 *       400:
 *         description: Bad request
 */
router.get("/coins/trending", displayController.getTrendingCoins);

/**
 * @swagger
 * /display/tokens/trending:
 *   get:
 *     description: Get list of 10 trending tokens
 *     tags: [Display]
 *     responses:
 *       200:
 *         description: Get list of 10 trending tokens successfully
 *       401:
 *         description: Get list of 10 trending tokens failed
 *       400:
 *         description: Bad request
 */
router.get("/tokens/trending", displayController.getTrendingTokens);

/**
 * @swagger
 * /display/coins:
 *   get:
 *     description: Get list of coins
 *     tags: [Display]
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Get list of coins successfully
 *       401:
 *         description: Get list of coins failed
 *       400:
 *         description: Bad request
 */
router.get("/coins", displayController.getCoins);

/**
 * @swagger
 * /display/coin/details:
 *   get:
 *     description: Display coin or token details
 *     tags: [Display]
 *     parameters:
 *      - in: query
 *        name: symbol
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Get coin or token details successfully
 *       401:
 *         description: Get coin or token details failed
 *       400:
 *         description: Bad request
 */
router.get("/coin/details", displayController.getCoinOrTokenDetails);

/**
 * @swagger
 * /display/tokens:
 *   get:
 *     description: Get list tokens
 *     tags: [Display]
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Get list tokens successfully
 *       401:
 *         description: Get list tokens failed
 *       400:
 *         description: Bad request
 */
router.get("/tokens", displayController.getTokens);

/**
 * @swagger
 * /display/sharks:
 *   get:
 *     description: Get list of sharks
 *     tags: [Display]
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Get list of sharks successfully
 *       401:
 *         description: Get list of sharks failed
 *       400:
 *         description: Bad request
 */
router.get("/sharks", displayController.getSharks);

/**
 * @swagger
 * /display/tags:
 *   get:
 *     description: Get list of tags
 *     tags: [Display]
 *     responses:
 *       200:
 *         description: Get list of tags successfully
 *       401:
 *         description: Get list of tags failed
 *       400:
 *         description: Bad request
 */
router.get("/tags", displayController.getTags);

module.exports = router;
