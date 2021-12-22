require("dotenv/config");

const admin = require("firebase-admin");
const serviceAccountKey = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
});

const getUserClaims = async (idToken) => {
    return await admin.auth().verifyIdToken(idToken).catch(console.log);
};

const getUser = async (uid) => {
    return await admin.auth().getUser(uid).catch(console.log);
};

module.exports = {
    admin: admin,
    getUserClaims: getUserClaims,
    getUser: getUser,
};
