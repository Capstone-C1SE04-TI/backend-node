const { isAuthed } = require("../../services/authentication");

const dotenv = require("dotenv");
dotenv.config();

const isAuth = async (req, res, next) => {
	try {
		if (!(await isAuthed(req, res, next))) {
			return res.status(403).json({
				message: "access-denied unauthorized",
				error: "access-denied unauthorized",
			});
		}

		next();
	} catch (e) {
		return res.status(403).json({
			message: "access-denied unauthorized",
			error: "access-denied unauthorized",
		});
	}
};

const isAdmin = async (req, res, next) => {
	try {
		if (req.user.role !== "admin") {
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
	isAuth,
	isAdmin,
};
