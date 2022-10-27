const dotenv = require("dotenv");
dotenv.config();

const {
	validateSignUpBody,
	validateSignInBody,
} = require("../validators/user");
const {
	createNewUser,
	checkExistedUsername,
	checkExistedEmail,
	getPasswordByUsername,
	getUserByUsername,
} = require("../services/crud-database/user");
const { cryptPassword, comparePassword } = require("../helpers");
const { isAuthed, generateAccessToken } = require("../services/authentication");

const TI_AUTH_COOKIE = process.env.TI_AUTH_COOKIE;

function AuthController() {
	this.signup = async (req, res, next) => {
		const { username, email, phoneNumber, password } = req.body;
		const { status, error } = await validateSignUpBody(req, res, next);

		if (status === "failed") {
			return res.status(400).json({ message: error, error: error });
		}

		if (await checkExistedUsername(username)) {
			return res.status(400).json({
				message: "username-existed",
				error: "username-existed",
			});
		}
		if (await checkExistedEmail(email)) {
			return res
				.status(400)
				.json({ message: "email-existed", error: "email-existed" });
		}

		cryptPassword(password, async (error, hashPassword) => {
			await createNewUser({ username, email, phoneNumber, hashPassword })
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
	};

	this.signin = async (req, res, next) => {
		const { username, password } = req.body;
		const { status, error } = await validateSignInBody(req, res, next);

		if (status === "failed") {
			return res
				.status(400)
				.json({ message: error, error: error, user: null });
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
						const user = await getUserByUsername(username);
						const cookie = req.cookies[TI_AUTH_COOKIE];

						if (!cookie) {
							const accessToken = await generateAccessToken({
								username,
							});

							res.cookie(TI_AUTH_COOKIE, accessToken, {
								// Expire in 1 week
								maxAge: 604800000,
							});

							return res.status(200).json({
								message: "successfully",
								error: null,
								user: {
									username: user.username,
									userId: user.userId,
									email: user.email,
								},
							});
						} else {
							if (await isAuthed(req)) {
								return res.status(200).json({
									message: "successfully",
									error: null,
									user: {
										username: user.username,
										userId: user.userId,
										email: user.email,
									},
								});
							} else {
								return res.status(400).json({
									message: "failed-unauthorized",
									error: "failed-unauthorized",
									user: null,
								});
							}
						}
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
}

module.exports = new AuthController();
