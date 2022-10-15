const _ = require("lodash");
const { QUERY_LIMIT_ITEM } = require("../constants");
const { getListOfUsers } = require("../services/crud-database/admin");

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
}

module.exports = new UserController();
