const database = require("../../configs/connect-database");
const firebase = require("firebase-admin");

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

const getUserProfile = async (userId) => {
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

const checkExistedEmailForUpdateProfile = async (userId, email) => {
	let isExistedEmail = false;

	const users = await database.collection("users").get();

	users.forEach((doc) => {
		if (doc.get("email") == email && doc.get("userId") != userId) {
			isExistedEmail = true;
		}
	});

	return isExistedEmail;
};

const updateUserProfile = async (userId, updateInfo) => {
	try {
		if (!userId) {
			return "userid-required";
		} else {
			const { email, phoneNumber, avatar } = updateInfo;

			if (!(await checkExistedUserId(userId))) return "user-notfound";

			if (
				email &&
				(await checkExistedEmailForUpdateProfile(userId, email))
			)
				return "email-existed";

			const users = await database
				.collection("users")
				.where("userId", "==", userId)
				.get();

			const updateInfos = {};
			if (email) updateInfos.email = email;
			if (phoneNumber) updateInfos.phoneNumber = phoneNumber;
			if (avatar) updateInfos.avatar = avatar;

			if (Object.entries(updateInfos).length !== 0) {
				users.forEach((doc) => {
					doc.ref.update({
						...updateInfos,
						updatedDate: firebase.firestore.Timestamp.now(),
					});
				});
			}

			return "success";
		}
	} catch (error) {
		return "error";
	}
};

module.exports = {
	getListOfUsers,
	getUsersLength,
	getUserProfile,
	checkExistedEmailForUpdateProfile,
	updateUserProfile,
};
