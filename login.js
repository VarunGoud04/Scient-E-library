const { signInWithEmailAndPassword } = require('firebase/auth');
const { auth } = require('./firebaseConfig');

async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
}

module.exports = loginUser;
