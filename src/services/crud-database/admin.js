const database = require("../../configs/connect-database");
const { QUERY_LIMIT_ITEM } = require("../../constants");

const getListOfUsers = async () => {
	let usersList = [];
	let users = await database.collection("users").orderBy("id", "asc").get();

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
