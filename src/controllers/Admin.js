const _ = require("lodash");
const {
	checkExistedUsername,
	getPasswordByUsername,
	getAdminByUsername,
	deleteUserById,
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

	this.signout = (req, res, next) => {
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
}

module.exports = new AdminController();
