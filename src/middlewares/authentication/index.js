const { expressjwt } = require("express-jwt");
const { isAuthed } = require("../../services/authentication");

const dotenv = require("dotenv");
dotenv.config();

const requireSignIn = expressjwt({
	secret: process.env.ACCESS_TOKEN_SECRET,
	algorithms: ["HS256"],
	userProperty: "auth",
});

const isAuth = (req, res, next) => {
	try {
		if (!isAuthed(req, res, next)) {
			res.status(403).json({
				message: "access-denied",
				error: "access-denied",
			});
		}

		next();
	} catch (e) {
		res.status(403).json({
			message: "access-denied",
			error: "access-denied",
		});
	}
};

const isAdmin = (req, res, next) => {
	// Role: User - 1, Admin - 2
	if (req.profile.role === 2) {
		return res.status(403).json({
			message: "access-denied admin-resource",
			error: "access-denied admin-resource",
		});
	}

	next();
};

module.exports = {
	requireSignIn,
	isAuth,
	isAdmin,
};
