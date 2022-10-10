const express = require("express");
const router = express.Router();
const coinDetailsController = require("../controllers/CoinDetails");

/**
 * @swagger
 * tags:
 *   name: Coin Details
 */

/**
 * @swagger
 * /coin/details:
 *   get:
 *     description: Get detail coin
 *     tags: [Coin Details]
 *     parameters:
 *      - in: query
 *        name: coinId
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Get coin details success
 *       401:
 *         description: Get coin details fail
 *       400:
 *         description: Bad request
 */
router.get("/details", coinDetailsController.getDetails);

module.exports = router;
