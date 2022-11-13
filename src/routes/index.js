const authRouter = require("./auth");
const forgotPasswordRouter = require("./forgotPassword");
const userRouter = require("./user");
const displayRouter = require("./display");
const adminRouter = require("./admin");

function routing(app) {
	/**
	 * @swagger
	 * tags:
	 *   name: Authentiation
	 *   name: Forgot Password
	 *   name: Coin - Token
	 *   name: Shark
	 *   name: User
	 *   name: Admin
	 *   name: Others
	 */

	/* --- User routes --- */
	app.use("/auth", authRouter);
	app.use("/forgot-password", forgotPasswordRouter);
	app.use("/display", displayRouter);
	app.use("/user", userRouter);

	/* --- Admin routes --- */
	app.use("/admin", adminRouter);
}

module.exports = routing;
