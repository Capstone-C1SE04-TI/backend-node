const database = require("../../configs/connect-database");
const firebase = require("firebase-admin");

const { QUERY_LIMIT_ITEM } = require("./../../constants");
const { randomFirestoreDocumentId } = require("../../helpers");
const { getUsersLength } = require("./admin");
const { isEqual } = require("lodash");

const getUserByUsername = async (username) => {
	let user;

	const users = await database
		.collection("users")
		.where("username", "==", username)
		.get();

	users.forEach((doc) => {
		user = doc.data();
	});

	return user;
};

const getUserByEmail = async (email) => {
	let user;

	const users = await database
		.collection("users")
		.where("email", "==", email)
		.get();

	users.forEach((doc) => {
		user = doc.data();
		user.docId = doc.id;
	});

	return user;
};

const createNewUser = async ({
	username,
	email,
	phoneNumber,
	hashPassword,
}) => {
	const usersLength = await getUsersLength();
	const userId = usersLength ? usersLength + 1 : 1;

	const currentTimestamp = firebase.firestore.Timestamp.now();
	const docId = randomFirestoreDocumentId();

	const newUserInfo = {
		userId: userId,
		username: username,
		email: email,
		phoneNumber: phoneNumber,
		password: hashPassword,
		createdDate: currentTimestamp,
		updatedDate: currentTimestamp,
	};

	await database.collection("users").doc(docId).set(newUserInfo);
};

const updateUserConfirmationCode = async (docId, code) => {
	const user = database.collection("users").doc(docId);

	await user.update({ confirmationCode: code });

	return user;
};

const checkExistedUsername = async (username) => {
	isExistedUsername = false;

	const users = await database.collection("users").get();

	users.forEach((doc) => {
		if (doc.get("username") === username) {
			isExistedUsername = true;
		}
	});

	return isExistedUsername;
};

const checkExistedEmail = async (email) => {
	isExistedEmail = false;

	const users = await database.collection("users").get();

	users.forEach((doc) => {
		if (doc.get("email") === email) {
			isExistedEmail = true;
			// return;
		}
	});

	return isExistedEmail;
};

const getPasswordByUsername = async (username) => {
	let hashPassword;

	const users = await database
		.collection("users")
		.where("username", "==", username)
		.get();

	users.forEach((doc) => {
		hashPassword = doc.get("password");
	});

	return hashPassword;
};

const getListOfCoins = async (page) => {
	if (page === undefined) {
		return [];
	}

	let coins = [];
	let coinsList = [];

	if (page === null) {
		coins = await database.collection("tokens").orderBy("id", "asc").get();
	} else {
		const startIndex = (page - 1) * QUERY_LIMIT_ITEM + 1;
		coins = await database
			.collection("tokens")
			.orderBy("id", "asc")
			.startAt(startIndex)
			.limit(QUERY_LIMIT_ITEM)
			.get();
	}

	coins.forEach((doc) => {
		coinsList.push(doc.data());
	});

	return coinsList;
};

const getCoinsLength = async () => {
	let length = 0;

	await database
		.collection("tokens")
		.get()
		.then((snap) => {
			length = snap.size;
		});

	return length || 0;
};

const getCoinDetails = async (coinSymbol) => {
	let coinInfo = {};
	let fullInfo = [];

	if (!coinSymbol) {
		return {};
	} else {
		fullInfo = await database
			.collection("tokens")
			.where("symbol", "==", coinSymbol)
			.get();

		fullInfo.forEach((doc) => {
			coinInfo = doc.data();
		});
	}
	// check if object is empty
	if (Object.entries(coinInfo).length === 0) return {};

	return coinInfo;
};

const getListOfSharks = async (page) => {
	if (page === undefined) {
		return [];
	}

	let sharks = [];
	let sharksList = [];

	if (page === null) {
		sharks = await database.collection("sharks").orderBy("id", "asc").get();
	} else {
		const startIndex = (page - 1) * QUERY_LIMIT_ITEM + 1;
		sharks = await database
			.collection("sharks")
			.orderBy("id", "asc")
			.startAt(startIndex)
			.limit(QUERY_LIMIT_ITEM)
			.get();
	}

	sharks.forEach((doc) => {
		sharksList.push(doc.data());
	});

	return sharksList;
};

const getSharksLength = async () => {
	let length = 0;

	await database
		.collection("sharks")
		.get()
		.then((snap) => {
			length = snap.size;
		});

	return length || 0;
};

const getListOfTags = async () => {
	let tags = [];
	let tagsList = [];

	tags = await database.collection("tags").orderBy("id", "asc").get();

	tags.forEach((doc) => {
		tagsList.push(doc.data());
	});

	return tagsList;
};

const getListTrendingTokens = async () => {
	let trendingTokens = [];
	let rawData = [];
	rawData = await database
		.collection("tokens")
		.where("type", "==", "token")
		.get();

	rawData.forEach((doc) => {
		//each doc is a coin
		trendingTokens.push({
			name: doc.data()["name"],
			symbol: doc.data()["symbol"],
			iconURL: doc.data()['iconURL'],
			percentChange24h: doc.data()["usd"]["percentChange24h"],
			price: doc.data()["usd"]["price"],
		});
	});

	//sort decs
	trendingTokens.sort(
		(firstObj, secondObj) =>
			secondObj["percentChange24h"] - firstObj["percentChange24h"],
	);

	// get 10 tokens
	trendingTokens = trendingTokens.slice(0, 10);

	return trendingTokens;
};

const getListTrendingCoins = async () => {
	let trendingCoins = [];
	let rawData = [];

	rawData = await database
		.collection("tokens")
		.where("type", '==', "coin")
		.get();

	// get data
	rawData.forEach((doc) => {
		trendingCoins.push({
			name: doc.data()["name"],
			symbol: doc.data()["symbol"],
			iconURL: doc.data()['iconURL'],
			percentChange24h: doc.data()["usd"]["percentChange24h"],
			price: doc.data()["usd"]["price"],
		});
	});

	// sort
	trendingCoins.sort(
		(firstObj, secondObj) =>
			secondObj["percentChange24h"] - firstObj["percentChange24h"],
	);

	// cut 10 field
	trendingCoins = trendingCoins.slice(0, 10);
	return trendingCoins;
};

module.exports = {
	getUserByUsername,
	getUserByEmail,
	createNewUser,
	updateUserConfirmationCode,
	checkExistedUsername,
	checkExistedEmail,
	getPasswordByUsername,
	getListOfCoins,
	getCoinsLength,
	getCoinDetails,
	getListOfSharks,
	getSharksLength,
	getListOfTags,
	getListTrendingTokens,
	getListTrendingCoins,
};
