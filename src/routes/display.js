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
router.get("/coins-and-tokens", displayController.getCoins);

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

/**
 * @swagger
 * /display/tokens/trending:
 *   get:
 *     description: Get list of 10 trending token
 *     tags: [Display]
 *     responses:
 *       200:
 *         description: Get list of 10 trending token successfully
 *       401:
 *         description: Get list of 10 trending token failed
 *       400:
 *         description: Bad request
 */
router.get("/tokens/trending", displayController.getTrendingTokens);

/**
 * @swagger
 * /display/coins/trending:
 *   get:
 *     description: Get list of 10 coins
 *     tags: [Display]
 *     responses:
 *       200:
 *         description: Get list 10 coins successfully
 *       401:
 *         description: Get list 10 coins failed
 *       400:
 *         description: Bad request
 */
router.get("/coins/trending", displayController.getTrendingCoins);

module.exports = router;
