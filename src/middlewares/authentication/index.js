const { expressjwt } = require("express-jwt");
const { isAuthed } = require("../../services/authentication");

const dotenv = require("dotenv");
dotenv.config();

const requireSignIn = expressjwt({
	secret: process.env.ACCESS_TOKEN_SECRET,
	algorithms: ["HS256"],
	userProperty: "auth",
});

const isAuth = async (req, res, next) => {
	try {
		if (!(await isAuthed(req, res, next))) {
			return res.status(403).json({
				message: "access-denied",
				error: "access-denied",
			});
		}

		next();
	} catch (e) {
		return res.status(403).json({
			message: "access-denied",
			error: "access-denied",
		});
	}
};

const isAdmin = (req, res, next) => {
	try {
		// Role: "user" - "admin"
		if (req.profile.role !== "admin") {
			return res.status(403).json({
				message: "access-denied admin-resource",
				error: "access-denied admin-resource",
			});
		}

		next();
	} catch (e) {
		return res.status(403).json({
			message: "access-denied admin-resource",
			error: "access-denied admin-resource",
		});
	}
};

module.exports = {
	requireSignIn,
	isAuth,
	isAdmin,
};
