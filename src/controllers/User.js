const _ = require("lodash");
const { QUERY_LIMIT_ITEM } = require("../constants");
const {
	getListOfUsers,
	getUsersLength,
} = require("../services/crud-database/admin");

function UserController() {
	this.getlist = async (req, res, next) => {
		const usersLength = await getUsersLength();
		console.log(usersLength);
		const totalPage = Math.ceil(usersLength / QUERY_LIMIT_ITEM);
		console.log(totalPage);

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

		await getListOfUsers(page)
			.then((usersList) => {
				if (usersList.length == 0) {
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
						datasLength: usersList.length,
						datas: usersList,
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
}

module.exports = new UserController();
