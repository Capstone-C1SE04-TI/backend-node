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
	await body("email")
		.trim()
		.notEmpty()
		.withMessage("email-required")
		.matches(/.+@.+\..+/)
		.withMessage("email-invalid")
		.isLength({ min: 16, max: 40 })
		.withMessage("email-name-must-6-30-characters")
		.run(req);

	await body("code")
		.trim()
		.notEmpty()
		.withMessage("code-required")
		.matches(/^[0-9]{6}$/)
		.withMessage("code-invalid")
		.run(req);

	const errors = validationResult(req);

	return {
		status: errors.isEmpty() ? "successfully" : "failed",
		error: errors.array()[0]?.msg,
	};
};

const validateCreateNewPasswordBody = async (req, res, next) => {
	await body("email")
		.trim()
		.notEmpty()
		.withMessage("email-required")
		.matches(/.+@.+\..+/)
		.withMessage("email-invalid")
		.isLength({ min: 16, max: 40 })
		.withMessage("email-name-must-6-30-characters")
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

const validateChangePasswordBody = async (req, res, next) => {
	await body("email")
		.trim()
		.notEmpty()
		.withMessage("email-required")
		.matches(/.+@.+\..+/)
		.withMessage("email-invalid")
		.isLength({ min: 16, max: 40 })
		.withMessage("email-name-must-6-30-characters")
		.run(req);

	await body("oldPassword")
		.trim()
		.notEmpty()
		.withMessage("oldpassword-required")
		.isLength({ min: 8, max: 16 })
		.withMessage("oldpassword-must-8-16-characters")
		.run(req);

	await body("newPassword")
		.trim()
		.notEmpty()
		.withMessage("newpassword-required")
		.isLength({ min: 8, max: 16 })
		.withMessage("newpassword-must-8-16-characters")
		.run(req);

	await body("newConfirmPassword")
		.trim()
		.notEmpty()
		.withMessage("newconfirmpassword-required")
		.isLength({ min: 8, max: 16 })
		.withMessage("newconfirmpassword-must-8-16-characters")
		.custom((value, { req }) => {
			if (value !== req.body.newPassword) {
				return false;
			}
			return true;
		})
		.withMessage("new-passwords-not-match")
		.run(req);

	const errors = validationResult(req);

	return {
		status: errors.isEmpty() ? "successfully" : "failed",
		error: errors.array()[0]?.msg,
	};
};

const validateUpdateProfileBody = async (req, res, next) => {
	await body("fullName")
		.optional({ checkFalsy: true, nullable: true })
		.trim()
		.isLength({ min: 4, max: 31 })
		.withMessage("fullname-must-4-31-characters")
		.matches(
			/^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]{2,}( {1,2}[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]{2,}){1,}$/u,
		)
		.withMessage("fullname-invalid")
		.run(req);

	await body("email")
		.optional({ checkFalsy: true, nullable: true })
		.trim()
		.matches(/.+@.+\..+/)
		.withMessage("email-invalid")
		.isLength({ min: 16, max: 40 })
		.withMessage("email-name-must-6-30-characters")
		.run(req);

	await body("phoneNumber")
		.optional({ checkFalsy: true, nullable: true })
		.trim()
		.matches(/^\d{10}$/)
		.withMessage("phonenumber-invalid")
		.run(req);

	await body("website")
		.optional({ checkFalsy: true, nullable: true })
		.trim()
		.matches(
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
		)
		.withMessage("website-invalid")
		.run(req);

	await body("avatar")
		.optional({ checkFalsy: true, nullable: true })
		.trim()
		.matches(
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
		)
		.withMessage("avatar-invalid")
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
	validateChangePasswordBody,
	validateUpdateProfileBody,
};
