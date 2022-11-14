const { validationResult } = require("express-validator");
const { validateUsername, validatePassword } = require("./index.js");

const validateSignInBody = async (req, res, next) => {
	await validateUsername(req);
	await validatePassword(req);

	const errors = validationResult(req);
	return {
		status: errors.isEmpty() ? "successfully" : "failed",
		error: errors.array()[0]?.msg,
	};
};

module.exports = {
	validateSignInBody,
};
