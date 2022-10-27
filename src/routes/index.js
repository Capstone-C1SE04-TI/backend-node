const authRouter = require("./auth");
const forgotPasswordRouter = require("./forgotPassword");
const changePasswordRouter = require("./changePassword");
const userRouter = require("./user");
const displayRouter = require("./display");
const adminRouter = require("./admin");

function routing(app) {
	// User routes
	app.use("/auth", authRouter);
	app.use("/forgot-password", forgotPasswordRouter);
	app.use("/change-password", changePasswordRouter);
	app.use("/display", displayRouter);
	app.use("/user", userRouter);

	// Admin routes
	app.use("/admin", adminRouter);
}

module.exports = routing;
