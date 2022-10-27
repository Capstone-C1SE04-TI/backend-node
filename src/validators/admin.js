const { body, validationResult } = require("express-validator");

const validateSignInBody = async (req, res, next) => {
	await body("username")
		.trim()
		.notEmpty()
		.withMessage("username-required")
		.isLength({ min: 5, max: 16 })
		.withMessage("username-must-5-16-characters")
		.matches(/^[a-zA-Z]([0-9a-zA-Z])*$/)
		.withMessage("username-invalid")
		.run(req);

	await body("password")
		.trim()
		.notEmpty()
		.withMessage("password-required")
		.isLength({ min: 8, max: 16 })
		.withMessage("password-must-8-16-characters")
		.run(req);

	const errors = validationResult(req);

	return {
		status: errors.isEmpty() ? "successfully" : "failed",
		error: errors.array()[0]?.msg,
	};
};

module.exports = {
	validateSignInBody,
};
