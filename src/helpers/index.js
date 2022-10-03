const _ = require("lodash");
const bcrypt = require("bcrypt");

const randomConfirmationCode = () => {
	const code = Math.floor(100000 + Math.random() * 900000);
	return code.toString();
};

const randomFirestoreDocumentId = () => {
	const validCharacters =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(
			"",
		);
	const length = 20;

	return _.sampleSize(validCharacters, length).join("");
};

const cryptPassword = (password, callback) => {
	bcrypt.genSalt(10, (error, salt) => {
		if (error) return callback(error);

		bcrypt.hash(password, salt, (error, hashPassword) => {
			return callback(error, hashPassword);
		});
	});
};

const comparePassword = (plainPassword, hashPassword, callback) => {
	bcrypt.compare(plainPassword, hashPassword, (error, isPasswordMatch) => {
		return error == null
			? callback(null, isPasswordMatch)
			: callback(error);
	});
};

module.exports = {
	randomConfirmationCode,
	randomFirestoreDocumentId,
	cryptPassword,
	comparePassword,
};
