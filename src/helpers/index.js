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

function convertUnixTimestampToNumber(unixTimestamp) {
	const date = new Date(unixTimestamp * 1000);

	const year =
		date.getFullYear() < 10
			? "0" + date.getFullYear()
			: "" + date.getFullYear();
	const month =
		date.getMonth() + 1 < 10
			? "0" + (date.getMonth() + 1)
			: "" + (date.getMonth() + 1);
	const day =
		date.getDate() < 10 ? "0" + date.getDate() : "" + date.getDate();
	const hour =
		date.getHours() < 10 ? "0" + date.getHours() : "" + date.getHours();
	const minute =
		date.getMinutes() < 10
			? "0" + date.getMinutes()
			: "" + date.getMinutes();
	const second =
		date.getSeconds() < 10
			? "0" + date.getSeconds()
			: "" + date.getSeconds();

	const formattedTimeStr = `${year}${month}${day}${hour}${minute}${second}`;
	const formattedTimeNumber = Number(formattedTimeStr);

	return formattedTimeNumber;
}

module.exports = {
	randomConfirmationCode,
	randomFirestoreDocumentId,
	cryptPassword,
	comparePassword,
	convertUnixTimestampToNumber,
};
