const _ = require("lodash");
const { QUERY_LIMIT_ITEM } = require("../constants");
const {
	getListOfCoins,
	getCoinsLength,
	getListOfSharks,
	getSharksLength,
	getListOfTags,
} = require("../services/crud-database/user");

function DisplayController() {
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
