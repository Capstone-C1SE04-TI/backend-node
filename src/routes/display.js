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
 * /display/coins-and-tokens/reducing:
 *   get:
 *     description: Get top 10 reducing coins and tokens
 *     tags: [Display]
 *     responses:
 *       200:
 *         description: Get top 10 reducing coins and tokens successfully
 *       401:
 *         description: Get top 10 reducing coins and tokens failed
 *       400:
 *         description: Bad request
 */
router.get(
	"/coins-and-tokens/reducing",
	displayController.getReducingCoinsAndTokens,
);

/**
 * @swagger
 * /display/coins-and-tokens/all:
 *   get:
 *     description: Get list of coins
 *     tags: [Display]
 *     responses:
 *       200:
 *         description: Get list of coins successfully
 *       401:
 *         description: Get list of coins failed
 *       400:
 *         description: Bad request
 */
router.get("/coins-and-tokens/all", displayController.getCoinsAndTokens);

/**
 * @swagger
 * /display/coins/trending:
 *   get:
 *     description: Get top 10 trending coins
 *     tags: [Display]
 *     responses:
 *       200:
 *         description: Get top 10 trending coins successfully
 *       401:
 *         description: Get top 10 trending coins failed
 *       400:
 *         description: Bad request
 */
router.get("/coins/trending", displayController.getTrendingCoins);

/**
 * @swagger
 * /display/coin/details:
 *   get:
 *     description: Get coin or token details
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
 * /display/sharks:
 *   get:
 *     description: Get list of sharks
 *     tags: [Display]
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
