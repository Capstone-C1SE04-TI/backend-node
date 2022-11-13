const express = require("express");
const router = express.Router();
const displayController = require("../controllers/Display");

/**
 * @swagger
 * /display/coins-and-tokens/reducing:
 *   get:
 *     description: Get top 10 reducing coins and tokens
 *     tags: [Coin - Token]
 *     responses:
 *       200:
 *         description: Get top 10 reducing coins and tokens successfully
 *       400:
 *         description: Get top 10 reducing coins and tokens failed
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
 *     tags: [Coin - Token]
 *     responses:
 *       200:
 *         description: Get list of coins successfully
 *       400:
 *         description: Get list of coins failed
 */
router.get("/coins-and-tokens/all", displayController.getCoinsAndTokens);

/**
 * @swagger
 * /display/coins/trending:
 *   get:
 *     description: Get top 10 trending coins
 *     tags: [Coin - Token]
 *     responses:
 *       200:
 *         description: Get top 10 trending coins successfully
 *       400:
 *         description: Get top 10 trending coins failed
 */
router.get("/coins/trending", displayController.getTrendingCoins);

/**
 * @swagger
 * /display/tokens/trending:
 *   get:
 *     description: Get top 10 trending tokens
 *     tags: [Coin - Token]
 *     responses:
 *       200:
 *         description: Get top 10 trending tokens successfully
 *       400:
 *         description: Get top 10 trending tokens failed
 */
router.get("/tokens/trending", displayController.getTrendingTokens);

/**
 * @swagger
 * /display/coin/details:
 *   get:
 *     description: Get coin or token details
 *     tags: [Coin - Token]
 *     parameters:
 *      - in: query
 *        name: symbol
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Get coin or token details successfully
 *       400:
 *         description: Get coin or token details failed
 */
router.get("/coin/details", displayController.getCoinOrTokenDetails);

/**
 * @swagger
 * /display/sharks:
 *   get:
 *     description: Get list of sharks
 *     tags: [Shark]
 *     responses:
 *       200:
 *         description: Get list of sharks successfully
 *       400:
 *         description: Get list of sharks failed
 */
router.get("/sharks", displayController.getSharks);

/**
 * @swagger
 * /display/sharks/transaction-history:
 *   get:
 *     description: Get list transactions history of all sharks
 *     tags: [Shark]
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Get list transactions history of all sharks successfully
 *       400:
 *         description: Get list transactions history of all sharks failed
 */
router.get(
	"/sharks/transaction-history",
	displayController.getListTransactionsOfAllSharks,
);

/**
 * @swagger
 * /display/shark/crypto:
 *   get:
 *     description: Get list of coin and token of shark
 *     tags: [Shark]
 *     parameters:
 *      - in: query
 *        name: sharkId
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Get list of coin and token of shark successful
 *       400:
 *         description: Get list of coin and token of shark failed
 */
router.get("/shark/crypto", displayController.getCryptosOfShark);

/**
 * @swagger
 * /display/shark/transaction-history:
 *   get:
 *     description: Get the transaction history of shark
 *     tags: [Shark]
 *     parameters:
 *      - in: query
 *        name: id
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Get transaction history of shark successful
 *       400:
 *         description: Get transaction history of shark failed
 */
router.get(
	"/shark/transaction-history",
	displayController.getTransactionsOfShark,
);

/**
 * @swagger
 * /display/shark/detail-coin-transaction-history:
 *   get:
 *     description: Get detail coin transaction history of shark
 *     tags: [Shark]
 *     parameters:
 *      - in: query
 *        name: sharkId
 *        schema:
 *          type: string
 *      - in: query
 *        name: coinSymbol
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Get detail coin transaction history of shark successful
 *       400:
 *         description: Get detail coin transaction history of shark failed
 */
router.get(
	"/shark/detail-coin-transaction-history",
	displayController.getDetailCoinTransactionHistory,
);

/**
 * @swagger
 * /display/tags:
 *   get:
 *     description: Get list of tags
 *     tags: [Others]
 *     responses:
 *       200:
 *         description: Get list of tags successfully
 *       400:
 *         description: Get list of tags failed
 */
router.get("/tags", displayController.getTags);

module.exports = router;
