const _ = require("lodash");
const {
	checkExistedUsername,
	getPasswordByUsername,
	getAdminByUsername,
} = require("../services/crud-database/admin");
const { validateSignInBody } = require("../validators/admin");
const { comparePassword } = require("../helpers");

function AdminController() {
	this.signin = async (req, res, next) => {
		const { username, password } = req.body;
		const { status, error } = await validateSignInBody(req, res, next);

		if (status === "failed") {
			return res
				.status(400)
				.json({ message: error, error: error, admin: null });
		}

		if (!(await checkExistedUsername(username))) {
			return res.status(404).json({
				message: "username-notfound",
				error: "username-notfound",
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
							admin: {
								username: admin.username,
								email: admin.email,
							},
						});
					} else {
						return res.status(400).json({
							message: "incorrect-password",
							error: "incorrect-password",
							admin: null,
						});
					}
				},
			);
		}
	};
}

module.exports = new AdminController();