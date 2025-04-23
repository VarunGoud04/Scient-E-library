const express = require('express');
const path = require('path');
const { auth, db } = require('./firebaseConfig');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { doc, setDoc, getDoc } = require('firebase/firestore');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 2008;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/register', async (req, res) => {
  const { name, email, password, university, college, regulation, branch } = req.body;

  if (!name || !email || !password || !university || !college || !regulation || !branch) {
    return res.status(400).send('All fields are required.');
  }

  try {
    const userDocRef = doc(db, 'users', email);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      return res.status(400).send('User already exists!');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(userDocRef, {
      uid: userCredential.user.uid,
      name,
      email,
      university,
      college,
      regulation,
      branch,
      createdAt: new Date().toISOString()
    });

    res.redirect('/login');
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Registration failed: ' + error.message);
  }
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
  const { email, password, regulation } = req.body;

  if (!email || !password || !regulation) {
    return res.status(400).send('All fields are required.');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const userDocRef = doc(db, 'users', email);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      return res.status(400).send('User data not found in database.');
    }

    const userData = userSnapshot.data();

    if (userData.regulation !== regulation) {
      return res.status(400).send('Incorrect regulation selected.');
    }

    if (regulation === 'R18') {
      return res.redirect('/courses18');
    } else if (regulation === 'R22') {
      return res.redirect('/courses');
    } else {
      return res.status(400).send('Invalid regulation selected.');
    }

  } catch (error) {
    console.error('Login error:', error);
    return res.status(400).send('Login failed: ' + error.message);
  }
});

app.get('/courses18', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'courses18.html'));
});

app.get('/courses', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'courses.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
