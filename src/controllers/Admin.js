const _ = require("lodash");
const {
	checkExistedUsername,
	getPasswordByUsername,
	getAdminByUsername,
	getListOfUsers,
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
				role: "admin",
				admin: null,
			});
		}

		if (!(await checkExistedUsername(username))) {
			return res.status(404).json({
				message: "username-notfound",
				error: "username-notfound",
				role: "admin",
				admin: null,
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
							role: "admin",
							admin: {
								username: admin.username,
								email: admin.email,
							},
						});
					} else {
						return res.status(400).json({
							message: "incorrect-password",
							error: "incorrect-password",
							role: "admin",
							admin: null,
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
}

module.exports = new AdminController();
