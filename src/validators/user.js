const { validationResult } = require("express-validator");
const {
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
} = require("./index.js");

const validateSignUpBody = async (req, res, next) => {
	await validateUsername(req);
	await validateEmail(req);
	await validatePhoneNumber(req);
	await validatePassword(req);
	await validateConfirmPassword(req);

	const errors = validationResult(req);
	return {
		status: errors.isEmpty() ? "successfully" : "failed",
		error: errors.array()[0]?.msg,
	};
};

const validateSignInBody = async (req, res, next) => {
	await validateUsername(req);
	await validatePassword(req);

	const errors = validationResult(req);
	return {
		status: errors.isEmpty() ? "successfully" : "failed",
		error: errors.array()[0]?.msg,
	};
};

const validateSubmitEmailBody = async (req, res, next) => {
	await validateEmail(req);

	const errors = validationResult(req);
	return {
		status: errors.isEmpty() ? "successfully" : "failed",
		error: errors.array()[0]?.msg,
	};
};

const validateSubmitCodeBody = async (req, res, next) => {
	await validateEmail(req);
	await validateCode(req);

	const errors = validationResult(req);
	return {
		status: errors.isEmpty() ? "successfully" : "failed",
		error: errors.array()[0]?.msg,
	};
};

const validateCreateNewPasswordBody = async (req, res, next) => {
	await validateEmail(req);
	await validatePassword(req);
	await validateConfirmPassword(req);

	const errors = validationResult(req);
	return {
		status: errors.isEmpty() ? "successfully" : "failed",
		error: errors.array()[0]?.msg,
	};
};

const validateChangePasswordBody = async (req, res, next) => {
	await validateEmail(req);
	await validateOldPassword(req);
	await validateNewPassword(req);
	await validateNewConfirmPassword(req);

	const errors = validationResult(req);
	return {
		status: errors.isEmpty() ? "successfully" : "failed",
		error: errors.array()[0]?.msg,
	};
};

const validateUpdateProfileBody = async (req, res, next) => {
	await validateFullNameOptional(req);
	await validateEmailOptional(req);
	await validatePhoneNumberOptional(req);
	await validateWebsiteOptional(req);
	await validateAvatarOptional(req);

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
