const database = require("../../configs/connect-database");
const firebase = require("firebase-admin");
const { getUsersLength } = require("./admin");
const { isEqual, result } = require("lodash");
const { async } = require("@firebase/util");
const { raw } = require("express");
const _ = require("lodash");

const {
	DEFAULT_USER_FULLNAME,
	DEFAULT_USER_AVATAR,
	DEFAULT_USER_WEBSITE,
} = require("../../constants");
const { randomFirestoreDocumentId, comparePassword } = require("../../helpers");

// Utilities
const getValueFromPromise = async (promiseValue) => {
	const value = await Promise.all(promiseValue);
	return value;
};

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
	const id = usersLength ? usersLength + 1 : 1;

	const currentTimestamp = firebase.firestore.Timestamp.now();
	const docId = randomFirestoreDocumentId();

	const newUserInfo = {
		id: id,
		userId: id,
		username: username,
		email: email,
		phoneNumber: phoneNumber,
		password: hashPassword,
		fullName: DEFAULT_USER_FULLNAME,
		avatar: DEFAULT_USER_AVATAR,
		website: DEFAULT_USER_WEBSITE,
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

const updateUserPassword = async (docId, password) => {
	const user = database.collection("users").doc(docId);

	await user.update({ password: password });

	return user;
};

const checkExistedUsername = async (username) => {
	let isExistedUsername = false;

	const users = await database.collection("users").get();

	users.forEach((doc) => {
		if (doc.get("username") === username) {
			isExistedUsername = true;
		}
	});

	return isExistedUsername;
};

const checkExistedEmail = async (email) => {
	let isExistedEmail = false;

	const users = await database.collection("users").get();

	users.forEach((doc) => {
		if (doc.get("email") === email) {
			isExistedEmail = true;
		}
	});

	return isExistedEmail;
};

const checkExistedUserId = async (userId) => {
	let isExistedUserId = false;

	const users = await database.collection("users").get();

	users.forEach((doc) => {
		if (doc.get("userId") === userId) {
			isExistedUserId = true;
		}
	});

	return isExistedUserId;
};

const getPasswordByUsername = async (username) => {
	let password;

	const users = await database
		.collection("users")
		.where("username", "==", username)
		.get();

	users.forEach((doc) => {
		password = doc.get("password");
	});

	return password;
};

const getPasswordByEmail = async (email) => {
	let password;

	const users = await database
		.collection("users")
		.where("email", "==", email)
		.get();

	users.forEach((doc) => {
		password = doc.get("password");
	});

	return password;
};

const getListOfCoinsAndTokens = async () => {
	let coinsList = [];
	let coins = await database.collection("tokens").orderBy("id", "asc").get();

	coins.forEach((doc) => {
		const data = doc.data();

		const coin = {
			id: data.id,
			name: data.name,
			symbol: data.symbol,
			iconURL: data.iconURL,
			tagNames: data.tagNames,
			usd: data.usd,
			marketCap: data.marketCap,
			circulatingSupply: data.circulatingSupply,
			pricesLast1Day:
				data.id >= 1 && data.id <= 10
					? Object.entries(data.prices.day)
					: null,
		};

		coinsList.push(coin);
	});

	return coinsList;
};

const getCoinsAndTokensLength = async () => {
	let length = 0;

	await database
		.collection("tokens")
		.get()
		.then((snap) => {
			length = snap.size;
		});

	return length || 0;
};

const getListReducingCoinsAndTokens = async () => {
	let reducingCoinsAndTokens = [];
	let rawData = [];

	rawData = await database.collection("tokens").get();

	// get data
	rawData.forEach((doc) => {
		reducingCoinsAndTokens.push({
			id: doc.data()["id"],
			name: doc.data()["name"],
			symbol: doc.data()["symbol"],
			iconURL: doc.data()["iconURL"],
			tagNames: doc.data()["tagNames"],
			usd: {
				percentChange24h: doc.data()["usd"]["percentChange24h"],
				price: doc.data()["usd"]["price"],
			},
			pricesLast1Day:
				doc.data()["id"] >= 1 && doc.data()["id"] <= 10
					? Object.entries(doc.data()["prices"]["day"])
					: null,
		});
	});

	//sort asc
	reducingCoinsAndTokens.sort(
		(firstObj, secondObj) =>
			firstObj["usd"]["percentChange24h"] -
			secondObj["usd"]["percentChange24h"],
	);

	// get first 10 tokens
	reducingCoinsAndTokens = reducingCoinsAndTokens.slice(0, 10);

	return reducingCoinsAndTokens;
};

const getListTrendingCoins = async () => {
	let trendingCoins = [];
	let rawData = [];

	rawData = await database
		.collection("tokens")
		.where("type", "==", "coin")
		.get();

	// get data
	rawData.forEach((doc) => {
		trendingCoins.push({
			id: doc.data()["id"],
			name: doc.data()["name"],
			symbol: doc.data()["symbol"],
			iconURL: doc.data()["iconURL"],
			tagNames: doc.data()["tagNames"],
			circulatingSupply: doc.data()["circulatingSupply"],
			marketCap: doc.data()["marketCap"],
			usd: {
				percentChange24h: doc.data()["usd"]["percentChange24h"],
				percentChange7d: doc.data()["usd"]["percentChange7d"],
				volume24h: doc.data()["usd"]["volume24h"],
				price: doc.data()["usd"]["price"],
			},
		});
	});

	// sort desc
	trendingCoins.sort(
		(firstObj, secondObj) =>
			secondObj["usd"]["percentChange24h"] -
			firstObj["usd"]["percentChange24h"],
	);

	// get first 10 coins
	trendingCoins = trendingCoins.slice(0, 10);

	return trendingCoins;
};

const getListTrendingTokens = async () => {
	let trendingTokens = [];
	let rawData = [];

	rawData = await database
		.collection("tokens")
		.where("type", "==", "token")
		.get();

	// get data
	rawData.forEach((doc) => {
		trendingTokens.push({
			id: doc.data()["id"],
			name: doc.data()["name"],
			symbol: doc.data()["symbol"],
			iconURL: doc.data()["iconURL"],
			tagNames: doc.data()["tagNames"],
			circulatingSupply: doc.data()["circulatingSupply"],
			marketCap: doc.data()["marketCap"],
			usd: {
				percentChange24h: doc.data()["usd"]["percentChange24h"],
				percentChange7d: doc.data()["usd"]["percentChange7d"],
				volume24h: doc.data()["usd"]["volume24h"],
				price: doc.data()["usd"]["price"],
			},
		});
	});

	// sort desc
	trendingTokens.sort(
		(firstObj, secondObj) =>
			secondObj["usd"]["percentChange24h"] -
			firstObj["usd"]["percentChange24h"],
	);

	// get first 10 tokens
	trendingTokens = trendingTokens.slice(0, 10);

	return trendingTokens;
};

const getCoinOrTokenDetails = async (coinSymbol) => {
	let coinInfo = {};
	let fullInfo = [];

	if (!coinSymbol) {
		return {};
	} else {
		fullInfo = await database
			.collection("tokens")
			.where("symbol", "==", coinSymbol.toUpperCase())
			.get();

		fullInfo.forEach((doc) => {
			coinInfo = doc.data();

			coinInfo.prices =
				coinInfo["id"] >= 1 && coinInfo["id"] <= 10
					? {
							day: Object.entries(coinInfo["prices"]["day"]),
							week: Object.entries(coinInfo["prices"]["week"]),
							month: Object.entries(coinInfo["prices"]["month"]),
							year: Object.entries(coinInfo["prices"]["year"]),
					  }
					: null;
		});
	}

	// check if object is empty
	if (Object.entries(coinInfo).length === 0) return {};

	return coinInfo;
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

// Sharks
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

const calculateValueOfCoin = async (numberOfCoinsHolding, coinSymbol) => {
	let price = await getCoinOrTokenDetails(coinSymbol);
	price = Object.keys(price).length === 0 ? 0 : Number(price["usd"]["price"]);
	if (typeof numberOfCoinsHolding === "object")
		numberOfCoinsHolding = Number(numberOfCoinsHolding["$numberLong"]);
	return Math.floor(price * numberOfCoinsHolding);
};

const getTotalAssetOfShark = async (sharkId) => {
	let rawData = await database
		.collection("sharks")
		.where("id", "==", sharkId)
		.get();

	let totalAsset = 0;
	rawData.forEach(async (doc) => {
		let coinsOfShark = doc.data()["coins"];
		// calculate total asset
		totalAsset = Object.keys(coinsOfShark).reduce(
			async (currentValue, coinSymbol) => {
				let price = await calculateValueOfCoin(
					coinsOfShark[coinSymbol],
					coinSymbol,
				);
				return (await currentValue) + price;
			},
			0,
		);
	});

	return totalAsset;
};

const getArrayTotalAssets = async (sharks) => {
	let promiseTotalAssets = await sharks.map(async (sharkId) => {
		let totalAsset = await getTotalAssetOfShark(sharkId);
		return totalAsset;
	});

	const totalAssets = await Promise.all(promiseTotalAssets);
	return totalAssets;
};

const getListOfSharks = async () => {
	let sharksList = [];
	let sharks = await database.collection("sharks").orderBy("id", "asc").get();

	let sharkIds = [];
	sharks.forEach(async (doc) => {
		sharkIds.push(doc.data()["id"]);
	});

	const totalAssets = await getArrayTotalAssets(sharkIds);

	sharks.forEach(async (doc) => {
		sharksList.push({
			id: doc.data()["id"],
			name: doc.data()["walletAddress"],
			percent24h: doc.data()["percent24h"],
			totalAsset: totalAssets.shift(),
		});
	});

	return sharksList;
};

// Crypto of sharks
const getListCryptosOfShark = async (sharkId) => {
	if (!_.isNumber(sharkId)) return -1;

	const rawData = await database
		.collection("sharks")
		.where("id", "==", sharkId)
		.get();

	let coins = {};
	rawData.forEach((doc) => {
		coins = doc.data()["coins"];
	});

	const promiseCryptos = await Object.keys(coins).map(async (coinSymbol) => {
		let coinDetails = await getCoinOrTokenDetails(coinSymbol);

		if (Object.keys(coinDetails).length === 0) return {};
		else {
			let quantity = coins[coinSymbol];
			if (typeof quantity === "object")
				quantity = Number(quantity["$numberLong"]);
			return {
				symbol: coinSymbol,
				quantity: quantity,
				name: coinDetails["name"],
				tagNames: coinDetails["tagNames"],
				cmcRank: coinDetails["cmcRank"],
				iconURL: coinDetails["iconURL"],
				price: coinDetails["usd"]["price"],
				total: Math.floor(coinDetails["usd"]["price"] * quantity),
			};
		}
	});

	const cryptos = await getValueFromPromise(promiseCryptos);

	return cryptos.length !== 0 ? cryptos : -1;
};

// Transaction history
const getListTransactionsOfShark = async (sharkId) => {
	if (!_.isNumber(sharkId)) return -1;
	const rawData = await database
		.collection("sharks")
		.where("id", "==", sharkId)
		.get();
	let transactions = -1;
	rawData.forEach((doc) => {
		console.log(doc);
		transactions = doc.data()["transactionsHistory"];
	});
	return transactions;
};

module.exports = {
	getUserByUsername,
	getUserByEmail,
	createNewUser,
	updateUserConfirmationCode,
	updateUserPassword,
	checkExistedUsername,
	checkExistedEmail,
	checkExistedUserId,
	getPasswordByUsername,
	getPasswordByEmail,
	getListOfCoinsAndTokens,
	getCoinsAndTokensLength,
	getCoinOrTokenDetails,
	getListOfSharks,
	getSharksLength,
	getListOfTags,
	getListReducingCoinsAndTokens,
	getListTrendingCoins,
	getListTrendingTokens,
	getListCryptosOfShark,
	getListTransactionsOfShark,
};
