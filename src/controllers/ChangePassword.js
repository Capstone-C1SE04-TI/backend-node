const {
	getUserByEmail,
	checkCorrectOldPassword,
	updateUserPassword,
} = require("../services/crud-database/user");
const { validateChangePasswordBody } = require("../validators/user");
const { cryptPassword } = require("../helpers");

function ChangePasswordController() {
	this.changePassword = async (req, res, next) => {
		const { status, error } = await validateChangePasswordBody(
			req,
			res,
			next,
		);

		if (status === "failed") {
			return res.status(400).json({ message: error });
		} else {
			const { email, oldPassword, newPassword } = req.body;
			const user = await getUserByEmail(email);

			if (user) {
				const isCorrectOldPassword = await checkCorrectOldPassword(
					email,
					oldPassword,
				);

				console.log(isCorrectOldPassword);

				if (isCorrectOldPassword) {
					cryptPassword(newPassword, async (error, hashPassword) => {
						await updateUserPassword(user.docId, hashPassword)
							.then(() => {
								return res.status(200).json({
									message: "successfully",
									error: null,
								});
							})
							.catch((error) => {
								return res.status(400).json({
									message: "failed",
									error: error,
								});
							});
					});
				} else {
					return res.status(400).json({
						message: "incorrect-oldpassword",
						error: "incorrect-oldpassword",
					});
				}
			} else {
				return res
					.status(400)
					.json({ message: "user-notfound", error: "user-notfound" });
			}
		}
	};
}

module.exports = new ChangePasswordController();
