const _ = require("lodash");
const {
	getListOfUsers,
	getUserProfile,
	updateUserProfile,
} = require("../services/crud-database/admin");
const { validateUpdateProfileBody } = require("../validators/user");

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

	this.getUserProfile = async (req, res, next) => {
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

		await getUserProfile(userId)
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

	this.updateUserProfile = async (req, res, next) => {
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

		const { status, error } = await validateUpdateProfileBody(
			req,
			res,
			next,
		);

		if (status === "failed") {
			return res.status(400).json({ message: error, error: error });
		} else {
			const updateInfo = req.body;

			await updateUserProfile(userId, updateInfo)
				.then((data) => {
					if (data == "success") {
						return res.status(200).json({
							message: "successfully",
							error: null,
						});
					} else {
						return res.status(400).json({
							message: data,
							error: data,
						});
					}
				})
				.catch((error) => {
					return res.status(400).json({
						message: "failed",
						error: error,
					});
				});
		}
	};
}

module.exports = new UserController();
