const database = require("../../configs/connect-database");
const { QUERY_LIMIT_ITEM } = require("../../constants");

const getListOfUsers = async (page) => {
	if (page === undefined) {
		return [];
	}

	let users = [];
	let usersList = [];

	if (page === null) {
		users = await database.collection("users").orderBy("id", "asc").get();
	} else {
		const startIndex = (page - 1) * QUERY_LIMIT_ITEM + 1;
		users = await database
			.collection("users")
			.orderBy("id", "asc")
			.startAt(startIndex)
			.limit(QUERY_LIMIT_ITEM)
			.get();
	}

	users.forEach((doc) => {
		usersList.push(doc.data());
	});

	return usersList;
};

const getUsersLength = async () => {
	let length = 0;

	await database
		.collection("users")
		.get()
		.then((snap) => {
			length = snap.size;
		});

	return length || 0;
};

module.exports = {
	getListOfUsers,
	getUsersLength,
};
