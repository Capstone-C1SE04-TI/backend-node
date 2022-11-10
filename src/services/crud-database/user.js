const database = require("../../configs/connect-database");
const firebase = require("firebase-admin");
const { randomFirestoreDocumentId } = require("../../helpers");
const _ = require("lodash");

const {
	DEFAULT_USER_FULLNAME,
	DEFAULT_USER_AVATAR,
	DEFAULT_USER_WEBSITE,
	QUERY_LIMIT_ITEM,
} = require("../../constants");

// Utilities
const getValueFromPromise = async (promiseValue) => {
	const value = await Promise.all(promiseValue);
	return value;
};

const getHoursPriceOfToken = async (tokenSymbol) => {
	const rawData = await database
		.collection("tokens")
		.where("symbol", "==", tokenSymbol.toUpperCase())
		.get();

	let hoursPrice = {};
	rawData.forEach((doc) => {
		hoursPrice = doc.data().originalPrices.hourly;
	});

	return hoursPrice;
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

const getUsersLength = async () => {
	const users = await database.collection("users").get();
	return users._size || 0;
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
		premiumAccount: false,
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
	const users = await database
		.collection("users")
		.where("username", "==", username)
		.get();

	// users._size = 1: existed
	return users._size === 1;
};

const checkExistedEmail = async (email) => {
	const users = await database
		.collection("users")
		.where("email", "==", email)
		.get();

	// users._size = 1: existed
	return users._size === 1;
};

const checkExistedUserId = async (userId) => {
	const users = await database
		.collection("users")
		.where("userId", "==", userId)
		.get();

	// users._size = 1: existed
	return users._size === 1;
};

const checkExistedSharkId = async (sharkId) => {
	const sharks = await database
		.collection("sharks")
		.where("id", "==", sharkId)
		.get();

	// sharks._size = 1: existed
	return sharks._size === 1;
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
			cmcRank: data.cmcRank,
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
	const tokens = await database.collection("tokens").get();
	return tokens._size || 0;
};

const getListReducingCoinsAndTokens = async () => {
	let reducingCoinsAndTokens = [];
	let rawData = await database.collection("tokens").get();

	rawData.forEach((doc) => {
		const data = doc.data();

		reducingCoinsAndTokens.push({
			id: data.id,
			name: data.name,
			symbol: data.symbol,
			iconURL: data.iconURL,
			tagNames: data.tagNames,
			usd: {
				percentChange24h: data.usd.percentChange24h,
				price: data.usd.price,
			},
			pricesLast1Day:
				data.id >= 1 && data.id <= 10
					? Object.entries(data.prices.day)
					: null,
		});
	});

	//sort asc
	reducingCoinsAndTokens.sort(
		(firstObj, secondObj) =>
			firstObj.usd.percentChange24h - secondObj.usd.percentChange24h,
	);

	// get first 10 tokens
	reducingCoinsAndTokens = reducingCoinsAndTokens.slice(0, 10);

	return reducingCoinsAndTokens;
};

const getListTrendingCoins = async () => {
	let trendingCoins = [];
	let rawData = await database
		.collection("tokens")
		.where("type", "==", "coin")
		.get();

	// get data
	rawData.forEach((doc) => {
		const data = doc.data();

		trendingCoins.push({
			id: data.id,
			name: data.name,
			symbol: data.symbol,
			iconURL: data.iconURL,
			tagNames: data.tagNames,
			circulatingSupply: data.circulatingSupply,
			marketCap: data.marketCap,
			usd: data.usd,
		});
	});

	// sort desc
	trendingCoins.sort(
		(firstObj, secondObj) =>
			secondObj.usd.percentChange24h - firstObj.usd.percentChange24h,
	);

	// get first 10 coins
	trendingCoins = trendingCoins.slice(0, 10);

	return trendingCoins;
};

const getListTrendingTokens = async () => {
	let trendingTokens = [];
	let rawData = await database
		.collection("tokens")
		.where("type", "==", "token")
		.get();

	// get data
	rawData.forEach((doc) => {
		const data = doc.data();

		trendingTokens.push({
			id: data.id,
			name: data.name,
			symbol: data.symbol,
			iconURL: data.iconURL,
			tagNames: data.tagNames,
			circulatingSupply: data.circulatingSupply,
			marketCap: data.marketCap,
			usd: data.usd,
		});
	});

	// sort desc
	trendingTokens.sort(
		(firstObj, secondObj) =>
			secondObj.usd.percentChange24h - firstObj.usd.percentChange24h,
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
			const data = doc.data();

			coinInfo = {
				id: data.id,
				ethId: data.ethId,
				name: data.name,
				type: data.type,
				symbol: data.symbol,
				iconURL: data.iconURL,
				cmcRank: data.cmcRank,
				tagNames: data.tagNames,
				maxSupply: data.maxSupply,
				totalSupply: data.totalSupply,
				circulatingSupply: data.circulatingSupply,
				contractAddress: data.contractAddress,
				marketCap: data.marketCap,
				urls: data.urls,
				usd: data.usd,
				prices:
					data.id >= 1 && data.id <= 10
						? {
								day: Object.entries(data.prices.day),
								week: Object.entries(data.prices.week),
								month: Object.entries(data.prices.month),
								year: Object.entries(data.prices.year),
						  }
						: null,
			};
		});
	}

	return coinInfo;
};

const getListOfTags = async () => {
	let tagsList = [];
	const tags = await database.collection("tags").orderBy("id", "asc").get();

	tags.forEach((doc) => {
		tagsList.push(doc.data());
	});

	return tagsList;
};

const getSharksLength = async () => {
	const sharks = await database.collection("sharks").get();
	return sharks._size || 0;
};

const getListOfSharks = async () => {
	let sharksList = [];
	let sharks = await database.collection("sharks").orderBy("id", "asc").get();

	sharks.forEach((doc) => {
		const data = doc.data();

		sharksList.push({
			id: data.id,
			percent24h: data.percent24h,
			walletAddress: data.walletAddress,
			totalAsset: data.totalAssets,
		});
	});

	return sharksList;
};

// Crypto of sharks
const getListCryptosOfShark = async (sharkId) => {
	const rawData = await database
		.collection("sharks")
		.where("id", "==", sharkId)
		.get();

	//have data
	let cryptos = [];

	rawData.forEach((doc) => {
		cryptos = doc.data()["cryptos"];
	});

	return cryptos.length !== 0 ? cryptos : -1;
};

// Transaction history

const getTransactionsOfAllSharks = async (page) => {
	if (page < 1 || page % 1 !== 0) return [];
	const rawData = await database
		.collection("transactions")
		.orderBy("sortNumber", "asc")
		.startAt((page - 1) * QUERY_LIMIT_ITEM + 1)
		.limit(QUERY_LIMIT_ITEM)
		.get();

	// lastDocument = rawData.docs[rawData.docs.length - 1];

	let transactions = [];
	rawData.forEach((doc) => {
		transactions.push(doc.data());
	});

	return transactions;
};

const getListTransactionsOfShark = async (sharkId) => {
	if (!_.isNumber(sharkId)) return -1;

	const rawData = await database
		.collection("sharks")
		.where("id", "==", sharkId)
		.get();

	let transactions = -1;

	rawData.forEach((doc) => {
		transactions = doc.data()["transactionsHistory"];
	});

	return transactions;
};

const getDetailCoinTransactionHistoryOfShark = async (sharkId, coinSymbol) => {
	try {
		if (sharkId === null) return { message: "sharkid-required" };

		if (sharkId === undefined) return { message: "sharkid-invalid" };

		if (!coinSymbol) return { message: "coinsymbol-required" };

		if (!(await checkExistedSharkId(sharkId)))
			return { message: "shark-notfound" };

		const sharks = await database
			.collection("sharks")
			.where("id", "==", sharkId)
			.get();

		let obj;

		sharks.forEach((doc) => {
			obj = doc
				.data()
				.historyDatas.find(
					(data) =>
						_.lowerCase(data.coinSymbol) ===
						_.lowerCase(coinSymbol),
				);
		});

		if (!obj) return { message: "coin-notfound" };

		return { message: "success", data: obj.historyData };
	} catch (error) {
		return { message: "error" };
	}
};

module.exports = {
	getUserByUsername,
	getUserByEmail,
	getUsersLength,
	createNewUser,
	updateUserConfirmationCode,
	updateUserPassword,
	checkExistedUsername,
	checkExistedEmail,
	checkExistedUserId,
	checkExistedSharkId,
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
	getTransactionsOfAllSharks,
	getListTransactionsOfShark,
	getDetailCoinTransactionHistoryOfShark,
	getHoursPriceOfToken,
};
