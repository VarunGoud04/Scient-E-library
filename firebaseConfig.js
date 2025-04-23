const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');

const firebaseConfig = {
    apiKey: "AIzaSyBB31ymV2vgVHVgA4Tp_jUZLy4c8VUkPY4",
    authDomain: "scient-e-library.firebaseapp.com",
    projectId: "scient-e-library",
    storageBucket: "scient-e-library.firebasestorage.app",
    messagingSenderId: "724674392756",
    appId: "1:724674392756:web:631eb7c59445f5a2509de1"
  };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

module.exports = { db, auth };
