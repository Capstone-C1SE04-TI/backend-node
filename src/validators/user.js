const { body, validationResult } = require("express-validator");

const validateSignUpBody = async (req, res, next) => {
	await body("username")
		.trim()
		.notEmpty()
		.withMessage("username-required")
		.isLength({ min: 5, max: 16 })
		.withMessage("username-must-5-16-characters")
		.matches(/^[a-zA-Z]([0-9a-zA-Z])*$/)
		.withMessage("username-invalid")
		.run(req);

	await body("email")
		.trim()
		.notEmpty()
		.withMessage("email-required")
		.matches(/.+@.+\..+/)
		.withMessage("email-invalid")
		.isLength({ min: 16, max: 40 })
		.withMessage("email-name-must-6-30-characters")
		.run(req);

	await body("phoneNumber")
		.trim()
		.notEmpty()
		.withMessage("phonenumber-required")
		.matches(/^\d{10}$/)
		.withMessage("phonenumber-invalid")
		.isLength({ min: 10, max: 10 })
		.withMessage("phonenumber-must-10-integer-characters")
		.run(req);

	await body("password")
		.trim()
		.notEmpty()
		.withMessage("password-required")
		.isLength({ min: 8, max: 16 })
		.withMessage("password-must-8-16-characters")
		.run(req);

	await body("confirmPassword")
		.trim()
		.notEmpty()
		.withMessage("passwordconfirm-required")
		.isLength({ min: 8, max: 16 })
		.withMessage("passwordconfirm-must-8-16-characters")
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				return false;
			}
			return true;
		})
		.withMessage("passwords-not-match")
		.run(req);

	const errors = validationResult(req);

	return {
		status: errors.isEmpty() ? "successfully" : "failed",
		error: errors.array()[0]?.msg,
	};
};

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

const validateSubmitEmailBody = async (req, res, next) => {
	await body("email")
		.trim()
		.notEmpty()
		.withMessage("email-required")
		.matches(/.+@.+\..+/)
		.withMessage("email-invalid")
		.isLength({ min: 16, max: 40 })
		.withMessage("email-name-must-6-30-characters")
		.run(req);

	const errors = validationResult(req);

	return {
		status: errors.isEmpty() ? "successfully" : "failed",
		error: errors.array()[0]?.msg,
	};
};

const validateSubmitCodeBody = async (req, res, next) => {
	await body("code")
		.trim()
		.notEmpty()
		.withMessage("code-required")
		.isNumeric()
		.isLength({ min: 6, max: 6 })
		// .matches(/.+@.+\..+/)
		.withMessage("code-invalid")
		// .isLength({ min: 3, max: 32 })
		// .withMessage("code-must-6-characters")
		.run(req);

	const errors = validationResult(req);

	return {
		status: errors.isEmpty() ? "successfully" : "failed",
		error: errors.array()[0]?.msg,
	};
};

const validateCreateNewPasswordBody = async (req, res, next) => {
	await body("password")
		.trim()
		.notEmpty()
		.withMessage("password-required")
		.isLength({ min: 8, max: 16 })
		.withMessage("password-must-8-16-characters")
		.run(req);

	await body("confirmPassword")
		.trim()
		.notEmpty()
		.withMessage("passwordconfirm-required")
		.isLength({ min: 8, max: 16 })
		.withMessage("passwordconfirm-must-8-16-characters")
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				return false;
			}
			return true;
		})
		.withMessage("passwords-not-match")
		.run(req);

	const errors = validationResult(req);

	return {
		status: errors.isEmpty() ? "successfully" : "failed",
		error: errors.array()[0]?.msg,
	};
};

module.exports = {
	validateSignUpBody,
	validateSignInBody,
	validateSubmitEmailBody,
	validateSubmitCodeBody,
	validateCreateNewPasswordBody,
};
