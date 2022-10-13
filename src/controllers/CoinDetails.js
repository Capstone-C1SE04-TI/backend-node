const _ = require("lodash");
const { getCoinDetails } = require("../services/crud-database/user");

function CoinDetailsController() {
	this.getDetails = async (req, res, next) => {
		if (!req.query.coinSymbol) {
			coinSymbol = null;
		} else {
			const symbol = _.toString(req.query.coinSymbol).toUpperCase();
			if (_.isNaN(symbol)) {
				coinSymbol = undefined;
			} else {
				coinSymbol = symbol;
			}
		}
		console.log(coinSymbol);
		await getCoinDetails(coinSymbol)
			.then((coinDetails) => {
				if (Object.entries(coinDetails).length === 0) {
					return res.status(400).json({
						message: "failed-id-invalid",
						error: "coinSymbol-invalid",
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
