const _ = require("lodash");
const {
	checkExistedUsername,
	getPasswordByUsername,
	getAdminByUsername,
	deleteUserById,
	getListOfUsers,
	getUserDetail
} = require("../services/crud-database/admin");
const { validateSignInBody } = require("../validators/admin");
const { comparePassword } = require("../helpers");

function AdminController() {
	this.signin = async (req, res, next) => {
		const { username, password } = req.body;
		const { status, error } = await validateSignInBody(req, res, next);

		if (status === "failed") {
			return res.status(400).json({
				message: error,
				error: error,
				user: null,
			});
		}

		if (!(await checkExistedUsername(username))) {
			return res.status(404).json({
				message: "username-notfound",
				error: "username-notfound",
				user: null,
			});
		} else {
			const hashPassword = await getPasswordByUsername(username);

			comparePassword(
				password,
				hashPassword,
				async (error, isPasswordMatch) => {
					if (isPasswordMatch) {
						const admin = await getAdminByUsername(username);

						return res.status(200).json({
							message: "successfully",
							error: null,
							user: {
								role: "admin",
								username: admin.username,
								email: admin.email,
							},
						});
					} else {
						return res.status(400).json({
							message: "incorrect-password",
							error: "incorrect-password",
							user: null,
						});
					}
				},
			);
		}
	};

	this.signout = async (req, res, next) => {
		try {
			req.user = null;
			req.session = null;

			return res
				.status(200)
				.json({ message: "successfully", error: null });
		} catch (error) {
			return res.status(400).json({ message: "failed", error: error });
		}
	};

	this.deleteUser = async (req, res, next) => {
		try {
			const { id } = req.body;

			let checkedId = Number(id);
			if (!_.isNumber(checkedId) || _.isNaN(checkedId))
				return res.status(404).json({
					message: "id-notfound",
					error: "id-notfound",
				});

			const isDeletedSuccessful = await deleteUserById(checkedId);

			if (!isDeletedSuccessful)
				return res.status(404).json({
					message: "id-notfound",
					error: "id-notfound",
				});

			return res
				.status(200)
				.json({ message: "successfully", error: null });
		} catch (error) {
			return res.status(400).json({ message: "failed", error: error });
		}
	};

	this.getUsersList = async (req, res, next) => {
		await getListOfUsers()
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

		await getUserDetail(userId)
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

module.exports = new AdminController();
