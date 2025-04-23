const express = require('express');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// 🔥 Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBB31ymV2vgVHVgA4Tp_jUZLy4c8VUkPY4",
    authDomain: "scient-e-library.firebaseapp.com",
    projectId: "scient-e-library",
    storageBucket: "scient-e-library.firebasestorage.app",
    messagingSenderId: "724674392756",
    appId: "1:724674392756:web:631eb7c59445f5a2509de1"
};

// 🔌 Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

// 🚀 Create Express app
const app = express();

// 📁 Serve static PDFs
app.use('/files', express.static(path.join(__dirname, 'pdfs')));

// 🧾 Route to display documents
app.get('/', async (req, res) => {
  try {
    const docsRef = collection(db, 'documents');
    const snapshot = await getDocs(docsRef);

    let html = '<h1>Document List</h1>';
    snapshot.forEach(doc => {
      const data = doc.data();
      html += `<p><a href="/files/${data.name}" target="_blank">${data.name}</a></p>`;
    });

    res.send(html);
  } catch (err) {
    console.error('Firestore Error:', err);
    res.status(500).send('Error fetching documents');
  }
});

// 🌐 Start the server
app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
