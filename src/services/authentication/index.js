const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");
const promisify = require("util").promisify;
const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ENCODE_ALGORITHM = process.env.ENCODE_ALGORITHM;

const decodeToken = async (token, secretKey) => {
	try {
		return await verify(token, secretKey, {
			ignoreExpiration: true,
		});
	} catch (error) {
		return undefined;
	}
};

const generateAccessToken = async (accessTokenData) => {
	try {
		const accessToken = await sign(accessTokenData, ACCESS_TOKEN_SECRET, {
			algorithm: ENCODE_ALGORITHM,
		});

		return accessToken;
	} catch (error) {
		return null;
	}
};

const isAuthed = async (req, res, next) => {
	const accessTokenHeader = req.headers.authorization;
	if (!accessTokenHeader) {
		return false;
	}

	const cookie = req.cookies.TI_AUTH_COOKIE;
	const decodeValue1 = await decodeToken(
		accessTokenHeader,
		ACCESS_TOKEN_SECRET,
	);
	const decodeValue2 = await decodeToken(cookie, ACCESS_TOKEN_SECRET);

	if (!decodeValue1 || !decodeValue2) {
		return false;
	}

	if (decodeValue1.username !== decodeValue2.username) {
		return false;
	}

	return true;
};

module.exports = {
	generateAccessToken,
	isAuthed,
	decodeToken,
};
