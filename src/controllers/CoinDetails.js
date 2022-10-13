const _ = require("lodash");
const { getCoinDetails } = require("../services/crud-database/user");

function CoinDetailsController() {
	this.getDetails = async (req, res, next) => {
		if (!req.query.coinId) {
			coinId = null;
		} else {
			const idInt = Math.floor(_.toNumber(req.query.coinId));
			if (_.isNaN(idInt) || idInt <= 0) {
				coinId = undefined;
			} else {
				coinId = idInt;
			}
		}

		await getCoinDetails(coinId)
			.then((coinDetails) => {
				console.log(coinDetails);
				if (Object.entries(coinDetails).length === 0) {
					return res.status(400).json({
						message: "failed-id-invalid",
						error: "coinId-invalid",
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
