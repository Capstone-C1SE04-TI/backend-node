const database = require("../../configs/connect-database");

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

const getDetailUser = async (userId) => {
	let userInfo = {};

	if (!userId) {
		return {};
	} else {
		const users = await database
			.collection("users")
			.where("userId", "==", userId)
			.get();

		users.forEach((doc) => {
			const data = doc.data();

			userInfo = {
				userId: data.userId,
				username: data.username,
				email: data.email,
				phoneNumber: data.phoneNumber,
				avatar: data.avatar,
				updatedDate: data.updatedDate,
				createdDate: data.createdDate,
			};
		});
	}

	if (Object.entries(userInfo).length === 0) return {};

	return userInfo;
};

module.exports = {
	getListOfUsers,
	getUsersLength,
	getDetailUser,
};
