const nodemailer = require("nodemailer");
const { randomConfirmationCode } = require("../helpers");
const {
	getUserByEmail,
	updateUserConfirmationCode,
} = require("../services/crud-database/user");
const { validateSubmitCodeBody } = require("../validators/user");

function ForgotPasswordController() {
	// ==> ERROR
	this.submitEmail = async (req, res, next) => {
		const user = await getUserByEmail(req.body.email);

		const transporter = nodemailer.createTransport({
			service: "gmail",
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: {
				user: process.env._0x072126sajkxja3181sc33242315_,
				pass: process.env._0x073126sajkxja3112lkkjs83j22_,
			},
			tls: {
				rejectUnauthorized: false,
			},
		});

		const code = randomConfirmationCode();
		const html = `
            <div style="padding: 10px; background-color: #003375">
                <div style="padding: 10px; background-color: white;">
                    <h4 style="color: #0085ff">Your verification code is:</h4>
                    <span style="color: black">${code}</span>
                </div>
            </div>
        `;

		const mailOptions = {
			from: {
				name: "Tracking Investor's Support Team",
				address: process.env._0x072126sajkxja3181sc33242315_,
			},
			to: req.body.email,
			subject: "Verify code to create new password - TI Team",
			html: html,
		};

		transporter.sendMail(mailOptions, async (error, info) => {
			if (!error) {
				if (user) {
					const updatedUser = await updateUserConfirmationCode(
						user.docId,
						code,
					);

					if (updatedUser) {
						return res.status(200).json({
							message:
								"Submit email successfully. Please check your email",
						});
					} else {
						return res.json({
							message: "Submit email failed",
						});
					}
				} else {
					return res.json({ message: "Email not found" });
				}
			} else {
				return res
					.status(400)
					.json({ message: "Submit email failedd" });
			}
		});
	};

	// ==> DONE
	this.submitCode = async (req, res, next) => {
		// Validate request body
		const { status, error } = await validateSubmitCodeBody(req, res, next);

		if (status === "failed") {
			return res.status(400).json({ message: error });
		} else {
			const { email, code } = req.body;
			const user = await getUserByEmail(email);

			if (code === user.confirmationCode) {
				return res.status(200).json({ message: "Correct code" });
			} else {
				return res.status(400).json({ message: "Wrong code" });
			}
		}
	};

	// ==> TODO
	this.resendCode = (req, res, next) => {
		// const transporter = nodemailer.createTransport({
		//     host: "smtp.gmail.com",
		//     port: 465,
		//     secure: true,
		//     auth: {
		//         user: process.env._0x072126sajkxja3181sc33242315_,
		//         pass: process.env._0x073126sajkxja3112lkkjs83j22_,
		//     },
		//     tls: {
		//         rejectUnauthorized: false,
		//     },
		// });
		// const code = randomConfirmationCode();
		// const html = `
		//     <div style="padding: 10px; background-color: #003375">
		//         <div style="padding: 10px; background-color: white;">
		//             <h4 style="color: #0085ff">Your verification code is:</h4>
		//             <span style="color: black">${code}</span>
		//         </div>
		//     </div>
		// `;
		// const mainOptions = {
		//     from: {
		//         name: "LOP's Support Team",
		//         address: "baop38391@gmail.com",
		//     },
		//     to: req.body.email,
		//     subject: "Verify code to create new password - LOP",
		//     html: html,
		// };
		// transporter.sendMail(mainOptions, (err, info) => {
		//     if (!err) {
		//         // Lưu code vào DB
		//         User.findOne({ email: req.body.email }, (error, user) => {
		//             if (user) {
		//                 console.log(user);
		//                 user.updateOne({ code: code }, (error, updatedUser) => {
		//                     console.log(user);
		//                     if (updatedUser) {
		//                         return res.json({
		//                             message:
		//                                 "Re-send code success. Please check your email",
		//                         });
		//                     } else {
		//                         return res.json({ message: "Re-send code failed" });
		//                     }
		//                 });
		//             } else {
		//                 return res.json({ message: "Re-send code failed" });
		//             }
		//         });
		//     } else {
		//         return res.json({ message: "Re-send code failed" });
		//     }
		// });
		return res.status(200).json({ message: "Successfully" });
	};

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
		return res.status(200).json({ message: "Successfully" });
	};
}

module.exports = new ForgotPasswordController();
