const { body } = require("express-validator");

const validateUsername = async (req) => {
	await body("username")
		.trim()
		.notEmpty()
		.withMessage("username-required")
		.isLength({ min: 5, max: 16 })
		.withMessage("username-must-5-16-characters")
		.matches(/^[a-zA-Z]([0-9a-zA-Z])*$/)
		.withMessage("username-invalid")
		.run(req);
};

const validateEmail = async (req) => {
	await body("email")
		.trim()
		.notEmpty()
		.withMessage("email-required")
		.matches(/.+@.+\..+/)
		.withMessage("email-invalid")
		.isLength({ min: 16, max: 40 })
		.withMessage("email-name-must-6-30-characters")
		.run(req);
};

const validateEmailOptional = async (req) => {
	await body("email")
		.optional({ checkFalsy: true, nullable: true })
		.trim()
		.matches(/.+@.+\..+/)
		.withMessage("email-invalid")
		.isLength({ min: 16, max: 40 })
		.withMessage("email-name-must-6-30-characters")
		.run(req);
};

const validatePhoneNumber = async (req) => {
	await body("phoneNumber")
		.trim()
		.notEmpty()
		.withMessage("phonenumber-required")
		.matches(/^\d{10}$/)
		.withMessage("phonenumber-invalid")
		.run(req);
};

const validatePhoneNumberOptional = async (req) => {
	await body("phoneNumber")
		.optional({ checkFalsy: true, nullable: true })
		.trim()
		.matches(/^\d{10}$/)
		.withMessage("phonenumber-invalid")
		.run(req);
};

const validatePassword = async (req) => {
	await body("password")
		.trim()
		.notEmpty()
		.withMessage("password-required")
		.isLength({ min: 8, max: 16 })
		.withMessage("password-must-8-16-characters")
		.run(req);
};

const validateConfirmPassword = async (req) => {
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
};

const validateCode = async (req) => {
	await body("code")
		.trim()
		.notEmpty()
		.withMessage("code-required")
		.matches(/^[0-9]{6}$/)
		.withMessage("code-invalid")
		.run(req);
};

const validateOldPassword = async (req) => {
	await body("oldPassword")
		.trim()
		.notEmpty()
		.withMessage("oldpassword-required")
		.isLength({ min: 8, max: 16 })
		.withMessage("oldpassword-must-8-16-characters")
		.run(req);
};

const validateNewPassword = async (req) => {
	await body("newPassword")
		.trim()
		.notEmpty()
		.withMessage("newpassword-required")
		.isLength({ min: 8, max: 16 })
		.withMessage("newpassword-must-8-16-characters")
		.run(req);
};

const validateNewConfirmPassword = async (req) => {
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
};

const validateFullNameOptional = async (req) => {
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
};

const validateWebsiteOptional = async (req) => {
	await body("website")
		.optional({ checkFalsy: true, nullable: true })
		.trim()
		.matches(
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
		)
		.withMessage("website-invalid")
		.run(req);
};

const validateAvatarOptional = async (req) => {
	await body("avatar")
		.optional({ checkFalsy: true, nullable: true })
		.trim()
		.matches(
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
		)
		.withMessage("avatar-invalid")
		.run(req);
};

module.exports = {
	validateUsername,
	validateEmail,
	validateEmailOptional,
	validatePhoneNumber,
	validatePhoneNumberOptional,
	validatePassword,
	validateConfirmPassword,
	validateCode,
	validateOldPassword,
	validateNewPassword,
	validateNewConfirmPassword,
	validateFullNameOptional,
	validateWebsiteOptional,
	validateAvatarOptional,
};
