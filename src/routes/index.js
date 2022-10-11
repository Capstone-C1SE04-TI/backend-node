const authRouter = require("./auth");
const forgotPasswordRouter = require("./forgotPassword");
const userRouter = require("./user");
const displayRouter = require("./display");
const sitesRouter = require("./sites");
const coinDetailsRouter = require("./coinDetails");

function routing(app) {
	app.use("/auth", authRouter);
	app.use("/forgot-password", forgotPasswordRouter);
	app.use("/coin", coinDetailsRouter);
	app.use("/display", displayRouter);
	app.use("/user", userRouter);
	app.use("/", sitesRouter);
}

module.exports = routing;
