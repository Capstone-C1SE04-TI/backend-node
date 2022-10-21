const _ = require("lodash");
const {
	getListOfUsers,
	getDetailUser,
} = require("../services/crud-database/admin");

function UserController() {
	this.getUsersList = async (req, res, next) => {
		await getListOfUsers()
			.then((usersList) => {
				if (usersList.length == 0) {
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
						datasLength: usersList.length,
						datas: usersList,
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

	this.getUserDetail = async (req, res, next) => {
		let userId;

		if (!req.query.userId) {
			userId = null;
		} else {
			const userIdCheck = _.toString(req.query.userId);

			if (_.isNaN(userIdCheck)) {
				userId = undefined;
			} else {
				userId = Number(userIdCheck);
			}
		}

		await getDetailUser(userId)
			.then((data) => {
				if (Object.entries(data).length === 0) {
					return res.status(400).json({
						message: "failed-userid-invalid",
						error: "userid-invalid",
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
					data: {},
				});
			});
	};
}

module.exports = new UserController();
