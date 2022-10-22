require("dotenv").config();
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const {
	getUserByEmail,
	updateUserConfirmationCode,
	updateUserPassword,
} = require("../services/crud-database/user");
const {
	validateSubmitEmailBody,
	validateSubmitCodeBody,
	validateCreateNewPasswordBody,
} = require("../validators/user");
const { randomConfirmationCode, cryptPassword } = require("../helpers");

const {
	GOOGLE_MAILER_CLIENT_ID,
	GOOGLE_MAILER_CLIENT_SECRET,
	GOOGLE_MAILER_REFRESH_TOKEN,
	ADMIN_EMAIL_ADDRESS,
	ADMIN_EMAIL_PASSWORD,
} = process.env;

const myOAuth2Client = new OAuth2Client(
	GOOGLE_MAILER_CLIENT_ID,
	GOOGLE_MAILER_CLIENT_SECRET,
);
myOAuth2Client.setCredentials({
	refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
});

function ForgotPasswordController() {
	this.submitEmail = async (req, res, next) => {
		const { status, error } = await validateSubmitEmailBody(req, res, next);

		if (status === "failed") {
			return res.status(400).json({ message: error });
		} else {
			const { email } = req.body;
			const user = await getUserByEmail(email);

			if (user) {
				try {
					const myAccessTokenObject =
						await myOAuth2Client.getAccessToken();
					const myAccessToken = myAccessTokenObject?.token;

					const transport = nodemailer.createTransport({
						service: "gmail",
						auth: {
							type: "OAuth2",
							user: ADMIN_EMAIL_ADDRESS,
							pass: ADMIN_EMAIL_PASSWORD,
							clientId: GOOGLE_MAILER_CLIENT_ID,
							clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
							refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
							accessToken: myAccessToken,
						},
					});

					const mailOptions = {
						from: {
							name: "Tracking Investment's Support Team",
							address: ADMIN_EMAIL_ADDRESS,
						},
						to: req.body.email,
						subject: "Reset Password - Tracking Investment",
						html: `
						<div>
							<div>
								<h4 style=font-size: 16px">Hi, I'm Hoang Dung from Tracking Investment's Support Team</h4>
								</br>
								<h4 style=font-size: 16px">Your reset password code is:</h4>
								<span style="color: black; font-size: 26px">${randomConfirmationCode()}</span>
							</div>
						</div>
					`,
					};

					await transport.sendMail(mailOptions);

					await updateUserConfirmationCode(docId, code);

					return res.status(200).json({
						message: "successfully",
					});
				} catch (error) {
					console.log(error);
					return res.status(400).json({
						message: "failed",
					});
				}
			} else {
				return res.status(400).json({ message: "email_notfound" });
			}
		}
	};

	this.submitCode = async (req, res, next) => {
		try {
			const { status, error } = await validateSubmitCodeBody(
				req,
				res,
				next,
			);

			if (status === "failed") {
				return res.status(400).json({ message: error, error: null });
			} else {
				const { email, code } = req.body;
				const user = await getUserByEmail(email);

				if (user) {
					if (user.confirmationCode === code) {
						return res
							.status(200)
							.json({ message: "successfully", error: null });
					} else {
						return res.status(400).json({
							message: "failed-wrong-code",
							error: null,
						});
					}
				} else {
					return res
						.status(400)
						.json({ message: "failed-user-notfound", error: null });
				}
			}
		} catch (error) {
			return res.status(400).json({ message: "failed", error: error });
		}
	};

	this.resendCode = async (req, res, next) => {
		const { status, error } = await validateSubmitEmailBody(req, res, next);

		if (status === "failed") {
			return res.status(400).json({ message: error });
		} else {
			const { email } = req.body;
			const user = await getUserByEmail(email);

			if (user) {
				try {
					const myAccessTokenObject =
						await myOAuth2Client.getAccessToken();
					const myAccessToken = myAccessTokenObject?.token;

					const transport = nodemailer.createTransport({
						service: "gmail",
						auth: {
							type: "OAuth2",
							user: ADMIN_EMAIL_ADDRESS,
							pass: ADMIN_EMAIL_PASSWORD,
							clientId: GOOGLE_MAILER_CLIENT_ID,
							clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
							refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
							accessToken: myAccessToken,
						},
					});

					const mailOptions = {
						from: {
							name: "Tracking Investment's Support Team",
							address: ADMIN_EMAIL_ADDRESS,
						},
						to: req.body.email,
						subject: "Reset Password - Tracking Investment",
						html: `
						<div>
							<div>
								<h4 style=font-size: 16px">Hi, I'm Hoang Dung from Tracking Investment's Support Team</h4>
								</br>
								<h4 style=font-size: 16px">Your reset password code is:</h4>
								<span style="color: black; font-size: 26px">${randomConfirmationCode()}</span>
							</div>
						</div>
					`,
					};

					await transport.sendMail(mailOptions);

					await updateUserConfirmationCode(docId, code);

					return res.status(200).json({
						message: "successfully",
					});
				} catch (error) {
					console.log(error);
					return res.status(400).json({
						message: "failed",
					});
				}
			} else {
				return res.status(400).json({ message: "email_notfound" });
			}
		}
	};

	this.createNewPassword = async (req, res, next) => {
		const { status, error } = await validateCreateNewPasswordBody(
			req,
			res,
			next,
		);

		if (status === "failed") {
			return res.status(400).json({ message: error });
		} else {
			const { email, password } = req.body;
			const user = await getUserByEmail(email);

			if (user) {
				// Encode password & update in DB
				cryptPassword(password, async (error, hashPassword) => {
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
				return res
					.status(400)
					.json({ message: "user_notfound", error: "user_notfound" });
			}
		}
	};
}

module.exports = new ForgotPasswordController();
