const database = require("../../configs/connect-database");
const firebase = require("firebase-admin");
const _ = require("lodash");

const {
	DEFAULT_USER_FULLNAME,
	DEFAULT_USER_AVATAR,
	DEFAULT_USER_WEBSITE,
} = require("../../constants");
const {
	randomFirestoreDocumentId,
	convertUnixTimestampToNumber,
} = require("../../helpers");

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

// Sharks
const getSharksLength = async () => {
	const sharks = await database.collection("sharks").get();
	return sharks._size || 0;
};

const getListOfSharks = async () => {
	let sharksList = [];
	let sharks = await database.collection("sharks").orderBy("id", "asc").get();

	sharks.forEach((doc) => {
		sharksList.push({
			id: doc.data()["id"],
			percent24h: doc.data()["percent24h"],
			walletAddress: doc.data()["walletAddress"],
			totalAsset: doc.data()["totalAssets"],
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
		const coinDetails = await getCoinOrTokenDetails(coinSymbol);
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

	let cryptos = await getValueFromPromise(promiseCryptos);

	return cryptos.length !== 0 ? cryptos : -1;
};

// Transaction history
const getDateNearTransaction = (dateList, dateTransaction) => {
	let datePricesTokenCut = dateList.map((date) => {
		return date["date"].slice(0, 10);
	});
	let dateTransactionCut = dateTransaction.slice(0, 10);
	let positionDate = null;

	// Cut hour
	let dateCutByHours = datePricesTokenCut.filter((date, index) => {
		if (Number(date) === Number(dateTransactionCut)) positionDate = index;
		return Number(date) === Number(dateTransactionCut);
	});

	if (dateCutByHours.length > 0) {
		// date transaction before date change price
		if (Number(dateTransaction) < Number(dateList[positionDate]))
			return positionDate === dateList.length - 1
				? dateList[dateList.length - 1]
				: dateList[positionDate + 1];
		else return dateList[positionDate];
	}

	// cut date
	let dateCutByDates = datePricesTokenCut.filter((date, index) => {
		date = date.slice(0, 8);
		if (Number(date) === Number(dateTransactionCut.slice(0, 8)))
			positionDate = index;
		return Number(date) === Number(dateTransactionCut.slice(0, 8));
	});

	let hourTrade = dateTransactionCut.slice(8);
	let datesCutLength = dateCutByDates.length;
	for (let i = 0; i < datesCutLength; i++) {
		if (Number(hourTrade) > Number(dateCutByDates[i].slice(8)))
			return dateList[positionDate - datesCutLength + i + 1];
	}

	return positionDate === null
		? {
				date: "none",
				value: 0,
		  }
		: positionDate === dateList.length - 1
		? dateList[dateList.length - 1]
		: dateList[positionDate + 1];
};

const getListTransactionsOfShark = async (sharkId) => {
	if (!_.isNumber(sharkId)) return -1;

	const rawData = await database
		.collection("sharks")
		.where("id", "==", sharkId)
		.get();

	let transactions = -1;

	rawData.forEach((doc) => {
		transactions = doc
			.data()
			["transactionsHistory"].map(async (transaction) => {
				let numberOfTokens =
					transaction["value"] /
					Math.pow(10, transaction["tokenDecimal"]);
				let hoursPrice = await getHoursPriceOfToken(
					transaction["tokenSymbol"],
				);

				// found hourly price
				if (typeof hoursPrice !== "undefined") {
					hoursPrice = Object.keys(hoursPrice).map((unixDate) => {
						let date = convertUnixTimestampToNumber(
							unixDate / 1000,
						);
						date = date.toString();
						return {
							date: date,
							value: hoursPrice[unixDate],
						};
					});

					hoursPrice.sort(
						(firstObj, secondObj) =>
							secondObj["date"] - firstObj["date"],
					);
				}

				let presentPrice =
					typeof hoursPrice !== "undefined"
						? hoursPrice[0]
						: undefined;

				const dateNearTransaction =
					typeof hoursPrice !== "undefined"
						? getDateNearTransaction(
								hoursPrice,
								transaction["timeStamp"],
						  )
						: { date: "none", value: 0 };

				presentPrice =
					typeof presentPrice === "undefined"
						? 0
						: presentPrice["value"];

				let calculatePrice = {
					numberOfTokens: numberOfTokens,
					pastPrice: dateNearTransaction["value"],
					presentPrice: presentPrice,
				};

				Object.assign(transaction, calculatePrice);

				return transaction;
			});
	});

	transactions = await getValueFromPromise(transactions);

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

const getHoursPriceOfToken = async (tokenSymbol) => {
	const rawData = await database
		.collection("tokens")
		.where("symbol", "==", tokenSymbol.toUpperCase())
		.get();

	let hoursPrice = {};
	rawData.forEach((doc) => {
		hoursPrice = doc.data()["originalPrices"]["hourly"];
	});

	return hoursPrice;
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
	getListTransactionsOfShark,
	getDetailCoinTransactionHistoryOfShark,
	getHoursPriceOfToken,
	getDateNearTransaction,
};
