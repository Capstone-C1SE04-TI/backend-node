require("dotenv").config();
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const {
	getUserByEmail,
	updateUserConfirmationCode,
} = require("../services/crud-database/user");
const { validateSubmitCodeBody } = require("../validators/user");
const { randomConfirmationCode } = require("../helpers");

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
	// ==> DOING
	this.submitEmail = async (req, res, next) => {
		// Get OAuth token
		// const getOAuth = async function () {
		// 	return await fetch("https://api.petfinder.com/v2/oauth2/token", {
		// 		method: "POST",
		// 		body:
		// 			"grant_type=client_credentials&client_id=" +
		// 			GOOGLE_MAILER_CLIENT_ID +
		// 			"&client_secret=" +
		// 			GOOGLE_MAILER_CLIENT_SECRET,
		// 		headers: {
		// 			"Content-Type": "application/x-www-form-urlencoded",
		// 		},
		// 	})
		// 		.then(function (res) {
		// 			return res.json();
		// 		})
		// 		.then(function (data) {
		// 			console.log(data);
		// 			// Store token data
		// 			token = data.access_token;
		// 			tokenType = data.token_type;

		// 			console.log(token);
		// 			console.log(tokenType);
		// 			console.log(expires);

		// 			expires = new Date().getTime() + data.expires_in * 1000;
		// 			console.log(expires);
		// 		});
		// };

		// await getOAuth();

		// // Make call if token expired
		// const makeCall = () => {
		// 	// If current token is invalid, get a new one
		// 	if (!expires || expires - new Date().getTime() < 1) {
		// 		getOAuth().then(function () {
		// 			// use access token
		// 		});
		// 	}
		// };

		//const user = await getUserByEmail(req.body.email);

		// if (user) {
		try {
			// Send mail
			const myAccessTokenObject = await myOAuth2Client.getAccessToken();
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

			// Store confirmationCode
			// await updateUserConfirmationCode(user.docId, code);

			return res.status(200).json({
				message: "successfully",
			});
		} catch (error) {
			console.log(error);
			return res.status(400).json({
				message: "failed",
			});
		}
		// } else {
		// 	return res.status(400).json({ message: "email_notfound" });
		// }
	};

	// ==> TODO
	this.submitCode = async (req, res, next) => {
		const { status, error } = await validateSubmitCodeBody(req, res, next);

		if (status === "failed") {
			return res.status(400).json({ message: error });
		} else {
			const { email, code } = req.body;
			const user = await getUserByEmail(email);

			if (code === user.confirmationCode) {
				return res.status(200).json({ message: "successfully" });
			} else {
				return res.status(400).json({ message: "failed" });
			}
		}
	};

	// ==> TODO
	this.resendCode = (req, res, next) => {};

	// ==> TODO
	this.createNewPassword = (req, res, next) => {
		// User.findOne({ email: req.body.email }, (error, user) => {
		//     // Nếu user đó tồn tại
		//     if (user) {
		//         // Tạo 1 User mới chứa thông tin của user cũ và password mới
		//         const updatedUserInfo = new User({
		//             ...user._doc,
		//             password: req.body.newPassword,
		//         });
		//         // Cập nhật mật khẩu mới
		//         user.updateOne(updatedUserInfo, (error, updatedUser) => {
		//             if (updatedUser) {
		//                 return res.json({ message: "Create new password success" });
		//             } else {
		//                 return res.json({ message: "Create new password failed" });
		//             }
		//         });
		//     } else {
		//         return res.json({ message: "Create new password failed" });
		//     }
		// });
		// return res.status(200).json({ message: "Successfully" });
	};
}

module.exports = new ForgotPasswordController();
