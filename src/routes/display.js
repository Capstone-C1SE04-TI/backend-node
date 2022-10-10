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
