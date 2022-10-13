const _ = require("lodash");
const { QUERY_LIMIT_ITEM } = require("../constants");
const {
	getListOfCoinsAndTokens,
	getCoinsAndTokensLength,
	getListOfSharks,
	getSharksLength,
	getListOfTags,
	getListOfCoins,
	getCoinsLength,
	getListOfTokens,
	getTokensLength,
	getListTrendingTokens,
	getListTrendingCoins,
	getCoinOrTokenDetails,
} = require("../services/crud-database/user");

function DisplayController() {
	this.getCoinsAndTokens = async (req, res, next) => {
		const coinsLength = await getCoinsAndTokensLength();
		const totalPage = Math.ceil(coinsLength / QUERY_LIMIT_ITEM);

		let page;
		if (!req.query.page) {
			page = null;
		} else {
			const pageInt = Math.floor(_.toNumber(req.query.page));
			if (_.isNaN(pageInt) || pageInt <= 0 || pageInt > totalPage) {
				page = undefined;
			} else {
				page = pageInt;
			}
		}

		await getListOfCoinsAndTokens(page)
			.then((coinsList) => {
				if (coinsList.length == 0) {
					return res.status(400).json({
						message: "failed-pageindex-invalid",
						error: "pageindex-invalid",
						page: req.query.page,
						totalPage: totalPage,
						datasLength: 0,
						datas: [],
					});
				} else {
					return res.status(200).json({
						message: "successfully",
						error: null,
						page: page,
						totalPage: totalPage,
						datasLength: coinsList.length,
						datas: coinsList,
					});
				}
			})
			.catch((error) => {
				return res.status(400).json({
					message: "failed",
					error: error,
					page: req.query.page,
					totalPage: totalPage,
					datasLength: 0,
					datas: [],
				});
			});
	};

	this.getCoins = async (req, res, next) => {
		const coinsLength = await getCoinsLength();
		const totalPage = Math.ceil(coinsLength / QUERY_LIMIT_ITEM);

		let page;
		if (!req.query.page) {
			page = null;
		} else {
			const pageInt = Math.floor(_.toNumber(req.query.page));
			if (_.isNaN(pageInt) || pageInt <= 0 || pageInt > totalPage) {
				page = undefined;
			} else {
				page = pageInt;
			}
		}

		await getListOfCoins(page)
			.then((coinsList) => {
				if (coinsList.length == 0) {
					return res.status(400).json({
						message: "failed-pageindex-invalid",
						error: "pageindex-invalid",
						page: req.query.page,
						totalPage: totalPage,
						datasLength: 0,
						datas: [],
					});
				} else {
					return res.status(200).json({
						message: "successfully",
						error: null,
						page: page,
						totalPage: totalPage,
						datasLength: coinsList.length,
						datas: coinsList,
					});
				}
			})
			.catch((error) => {
				return res.status(400).json({
					message: "failed",
					error: error,
					page: req.query.page,
					totalPage: totalPage,
					datasLength: 0,
					datas: [],
				});
			});
	};

	this.getTokens = async (req, res, next) => {
		const tokensLength = await getTokensLength();
		const totalPage = Math.ceil(tokensLength / QUERY_LIMIT_ITEM);

		let page;
		if (!req.query.page) {
			page = null;
		} else {
			const pageInt = Math.floor(_.toNumber(req.query.page));
			if (_.isNaN(pageInt) || pageInt <= 0 || pageInt > totalPage) {
				page = undefined;
			} else {
				page = pageInt;
			}
		}

		await getListOfTokens(page)
			.then((tokensList) => {
				if (tokensList.length == 0) {
					return res.status(400).json({
						message: "failed-pageindex-invalid",
						error: "pageindex-invalid",
						page: req.query.page,
						totalPage: totalPage,
						datasLength: 0,
						datas: [],
					});
				} else {
					return res.status(200).json({
						message: "successfully",
						error: null,
						page: page,
						totalPage: totalPage,
						datasLength: tokensList.length,
						datas: tokensList,
					});
				}
			})
			.catch((error) => {
				return res.status(400).json({
					message: "failed",
					error: error,
					page: req.query.page,
					totalPage: totalPage,
					datasLength: 0,
					datas: [],
				});
			});
	};

	this.getTrendingCoins = async (req, res, next) => {
		await getListTrendingCoins()
			.then((trendingTokens) => {
				if (trendingTokens.length == 0) {
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
						datasLength: trendingTokens.length,
						datas: trendingTokens,
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
			.then((trendingTokens) => {
				if (trendingTokens.length == 0) {
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
						datasLength: trendingTokens.length,
						datas: trendingTokens,
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
			.then((coinDetails) => {
				if (Object.entries(coinDetails).length === 0) {
					return res.status(400).json({
						message: "failed-symbol-invalid",
						error: "symbol-invalid",
						datas: {},
					});
				} else {
					return res.status(200).json({
						message: "successfully",
						error: null,
						datas: coinDetails,
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
		const sharksLength = await getSharksLength();
		const totalPage = Math.ceil(sharksLength / QUERY_LIMIT_ITEM);

		let page;
		if (!req.query.page) {
			page = null;
		} else {
			const pageInt = Math.floor(_.toNumber(req.query.page));
			if (_.isNaN(pageInt) || pageInt <= 0 || pageInt > totalPage) {
				page = undefined;
			} else {
				page = pageInt;
			}
		}

		await getListOfSharks(page)
			.then((sharksList) => {
				if (sharksList.length == 0) {
					return res.status(400).json({
						message: "failed-pageindex-invalid",
						error: "pageindex-invalid",
						page: req.query.page,
						totalPage: totalPage,
						datasLength: 0,
						datas: [],
					});
				} else {
					return res.status(200).json({
						message: "successfully",
						error: null,
						page: page,
						totalPage: totalPage,
						datasLength: sharksList.length,
						datas: sharksList,
					});
				}
			})
			.catch((error) => {
				return res.status(400).json({
					message: "failed",
					error: error,
					page: req.query.page,
					totalPage: totalPage,
					datasLength: 0,
					datas: [],
				});
			});
	};

	this.getTags = async (req, res, next) => {
		await getListOfTags()
			.then((tagsList) => {
				if (tagsList.length == 0) {
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
						datasLength: tagsList.length,
						datas: tagsList,
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
