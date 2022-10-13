const _ = require("lodash");
const { getCoinDetails } = require("../services/crud-database/user");

function CoinDetailsController() {
	this.getDetails = async (req, res, next) => {
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
		await getCoinDetails(symbol)
			.then((coinDetails) => {
				if (Object.entries(coinDetails).length === 0) {
					return res.status(400).json({
						message: "failed-id-invalid",
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
}

module.exports = new CoinDetailsController();
