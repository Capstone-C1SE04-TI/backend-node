const database = require("../../configs/connect-database");
const firebase = require("firebase-admin");

const checkExistedUserId = async (userId) => {
	const users = await database
		.collection("users")
		.where("userId", "==", userId)
		.get();

	// users._size = 1: existed
	return users._size === 1;
};

const getListOfUsers = async () => {
	let usersList = [];
	let userInfo = {};
	let users = await database.collection("users").orderBy("id", "asc").get();

	users.forEach((doc) => {
		const data = doc.data();

		userInfo = {
			userId: data.userId,
			username: data.username,
			email: data.email,
			phoneNumber: data.phoneNumber,
			fullName: data.fullName,
			avatar: data.avatar,
			website: data.website,
			updatedDate: data.updatedDate,
			createdDate: data.createdDate,
		};

		usersList.push(userInfo);
	});

	return usersList;
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
				fullName: data.fullName,
				avatar: data.avatar,
				website: data.website,
				updatedDate: data.updatedDate,
				createdDate: data.createdDate,
			};
		});
	}

	return userInfo;
};

const checkExistedUsernameForUpdateProfile = async (userId, username) => {
	let check = false;
	const users = await database.collection("users").get();

	users.forEach((doc) => {
		if (doc.get("username") == username && doc.get("userId") != userId) {
			check = true;
			return;
		}
	});

	return check;
};

const checkExistedEmailForUpdateProfile = async (userId, email) => {
	let check = false;
	const users = await database.collection("users").get();

	users.forEach((doc) => {
		if (doc.get("email") == email && doc.get("userId") != userId) {
			check = true;
			return;
		}
	});

	return check;
};

const updateUserProfile = async (userId, updateInfo) => {
	try {
		if (!userId) return "userid-required";
		else {
			const { fullName, email, phoneNumber, website, avatar } =
				updateInfo;

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
			if (fullName) updateInfos.fullName = fullName;
			if (email) updateInfos.email = email;
			if (phoneNumber) updateInfos.phoneNumber = phoneNumber;
			if (website) updateInfos.website = website;
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

const upgradeUserPremiumAccount = async (userId) => {
	try {
		if (userId === null) return "userid-required";

		if (userId === undefined) return "userid-invalid";

		if (!(await checkExistedUserId(userId))) return "user-notfound";

		const users = await database
			.collection("users")
			.where("userId", "==", userId)
			.get();

		users.forEach((doc) => {
			doc.ref.update({ premiumAccount: true });
		});

		return "success";
	} catch (error) {
		return "error";
	}
};

const checkExistedUsername = async (username) => {
	const admins = await database
		.collection("admins")
		.where("username", "==", username)
		.get();

	// admins._size = 1: existed
	return admins._size === 1;
};

const getPasswordByUsername = async (username) => {
	let password;

	const admins = await database
		.collection("admins")
		.where("username", "==", username)
		.get();

	admins.forEach((doc) => {
		password = doc.get("password");
	});

	return password;
};

const getAdminByUsername = async (username) => {
	let user;

	const admins = await database
		.collection("admins")
		.where("username", "==", username)
		.get();

	admins.forEach((doc) => {
		user = doc.data();
	});

	return user;
};

const deleteUserById = async (userId) => {
	let rawDataUser = await database
		.collection("users")
		.where("id", "==", userId)
		.get();

	let isDeleted = false;

	rawDataUser.forEach((doc) => {
		isDeleted = true;
		doc.ref.delete();
	});

	return isDeleted;
};

module.exports = {
	getListOfUsers,
	getUserProfile,
	checkExistedUsername,
	checkExistedUsernameForUpdateProfile,
	checkExistedEmailForUpdateProfile,
	updateUserProfile,
	upgradeUserPremiumAccount,
	getPasswordByUsername,
	getAdminByUsername,
	deleteUserById,
};
