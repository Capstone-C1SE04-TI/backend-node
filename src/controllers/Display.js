const _ = require("lodash");
const {
	getListOfCoinsAndTokens,
	getListOfSharks,
	getListOfTags,
	getListReducingCoinsAndTokens,
	getListTrendingCoins,
	getListTrendingTokens,
	getCoinOrTokenDetails,
	getListCryptosOfShark,
	getListTransactionsOfShark,
} = require("../services/crud-database/user");

function DisplayController() {
	this.getCoinsAndTokens = async (req, res, next) => {
		await getListOfCoinsAndTokens()
			.then((datas) => {
				if (datas.length == 0) {
					return res.status(400).json({
						message: "failed-empty-data",
						error: "empty-data",
						datasLength: 0,
						datas: [],
					});
				} else {
					return res.status(200).json({
						message: "successfully",
						error: null,
						datasLength: datas.length,
						datas: datas,
					});
				}
			})
			.catch((error) => {
				return res.status(400).json({
					message: "failed",
					error: error,
					datasLength: 0,
					datas: [],
				});
			});
	};

	this.getReducingCoinsAndTokens = async (req, res, next) => {
		await getListReducingCoinsAndTokens()
			.then((datas) => {
				if (datas.length == 0) {
					return res.status(400).json({
						message: "failed-empty-data",
						error: "empty-data",
						datasLength: 0,
						datas: [],
					});
				} else {
					return res.status(200).json({
						message: "successfully",
						error: null,
						datasLength: datas.length,
						datas: datas,
					});
				}
			})
			.catch((error) => {
				return res.status(400).json({
					message: "failed",
					error: error,
					datasLength: 0,
					datas: [],
				});
			});
	};

	this.getTrendingCoins = async (req, res, next) => {
		await getListTrendingCoins()
			.then((datas) => {
				if (datas.length == 0) {
					return res.status(400).json({
						message: "failed-empty-data",
						error: "empty-data",
						datasLength: 0,
						datas: [],
					});
				} else {
					return res.status(200).json({
						message: "successfully",
						error: null,
						datasLength: datas.length,
						datas: datas,
					});
				}
			})
			.catch((error) => {
				return res.status(400).json({
					message: "failed",
					error: error,
					datasLength: 0,
					datas: [],
				});
			});
	};

	this.getTrendingTokens = async (req, res, next) => {
		await getListTrendingTokens()
			.then((datas) => {
				if (datas.length == 0) {
					return res.status(400).json({
						message: "failed-empty-data",
						error: "empty-data",
						datasLength: 0,
						datas: [],
					});
				} else {
					return res.status(200).json({
						message: "successfully",
						error: null,
						datasLength: datas.length,
						datas: datas,
					});
				}
			})
			.catch((error) => {
				return res.status(400).json({
					message: "failed",
					error: error,
					datasLength: 0,
					datas: [],
				});
			});
	};

	this.getCoinOrTokenDetails = async (req, res, next) => {
		if (!req.query.symbol) {
			symbol = null;
		} else {
			const symbolCheck = _.toString(req.query.symbol).toUpperCase();
			if (_.isNaN(symbolCheck)) {
				symbol = undefined;
			} else {
				symbol = symbolCheck;
			}
		}

		await getCoinOrTokenDetails(symbol)
			.then((data) => {
				if (Object.entries(data).length === 0) {
					return res.status(400).json({
						message: "failed-symbol-invalid",
						error: "symbol-invalid",
						data: {},
					});
				} else {
					return res.status(200).json({
						message: "successfully",
						error: null,
						data: data,
					});
				}
			})
			.catch((error) => {
				return res.status(400).json({
					message: "failed",
					error: error,
					datas: {},
				});
			});
	};

	this.getSharks = async (req, res, next) => {
		await getListOfSharks()
			.then((datas) => {
				if (datas.length == 0) {
					return res.status(400).json({
						message: "failed-empty-data",
						error: "empty-data",
						datasLength: 0,
						datas: [],
					});
				} else {
					return res.status(200).json({
						message: "successfully",
						error: null,
						datasLength: datas.length,
						datas: datas,
					});
				}
			})
			.catch((error) => {
				return res.status(400).json({
					message: "failed",
					error: error,
					datasLength: 0,
					datas: [],
				});
			});
	};

	this.getCryptosOfShark = async (req, res, next) => {
		if (!req.query.id) {
			sharkId = null;
		} else {
			const idCheck = _.toNumber(req.query.id);
			if (_.isNaN(idCheck)) {
				sharkId = undefined;
			} else {
				sharkId = idCheck;
			}
		}

		await getListCryptosOfShark(sharkId)
			.then((data) => {
				if (data === -1) {
					return res.status(400).json({
						message: "failed-getCrytosList-invalid",
						error: "sharkId-invalid",
						data: [],
					});
				} else {
					return res.status(200).json({
						message: "successfully",
						error: null,
						data: data,
					});
				}
			})
			.catch((error) => {
				return res.status(400).json({
					message: "failed",
					error: error,
					datas: [],
				});
			});
	};

	this.getTransactionsOfShark = async (req, res, next) => {
		if (!req.query.id) {
			sharkId = null;
		} else {
			const idCheck = _.toNumber(req.query.id);
			if (_.isNaN(idCheck)) {
				sharkId = undefined;
			} else {
				sharkId = idCheck;
			}
		}
		await getListTransactionsOfShark(sharkId)
			.then((data) => {
				if (!_.isArray(data)) {
					return res.status(400).json({
						message: "failed-getTransactionsList-invalid",
						error: "sharkId-invalid",
						data: [],
					});
				} else {
					return res.status(200).json({
						message: "successfully",
						error: null,
						data: data,
					});
				}
			})
			.catch((error) => {
				return res.status(400).json({
					message: "failed",
					error: error,
					datas: [],
				});
			});
	};

	this.getTags = async (req, res, next) => {
		await getListOfTags()
			.then((datas) => {
				if (datas.length == 0) {
					return res.status(400).json({
						message: "failed-empty-data",
						error: "empty-data",
						datasLength: 0,
						datas: [],
					});
				} else {
					return res.status(200).json({
						message: "successfully",
						error: null,
						datasLength: datas.length,
						datas: datas,
					});
				}
			})
			.catch((error) => {
				return res.status(400).json({
					message: "failed",
					error: error,
					datasLength: 0,
					datas: [],
				});
			});
	};
}

module.exports = new DisplayController();
