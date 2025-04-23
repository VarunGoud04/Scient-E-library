const admin = require("firebase-admin");

const serviceAccount = require("./path/to/your-service-account.json"); // Download this from Firebase console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://scient-e-library.firebaseio.com"
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
