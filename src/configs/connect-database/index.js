const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./service-account-Capstone-C1SE04-TI-Main.json");

initializeApp({
	credential: cert(serviceAccount),
});

const database = getFirestore();

module.exports = database;
