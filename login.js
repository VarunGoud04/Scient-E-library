const express = require('express');
const bcrypt = require('bcryptjs'); // Use bcryptjs for compatibility
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

// Login route
router.post('/login', async (req, res) => {
    const { email, password, regulation } = req.body;

    console.log("Login attempt:", req.body); // Debug: See incoming data

    // Validate input
    if (!email || !password || !regulation || regulation === 'choose') {
        return res.status(400).send('Please fill in all fields correctly.');
    }

    try {
        // Check if user exists
        const snapshot = await db.collection('users').where('email', '==', email).get();

        if (snapshot.empty) {
            return res.send('User not found');
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        // Compare password
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.send('Invalid credentials');
        }

        // Handle regulation routing
        if (regulation === 'R22') {
            return res.redirect('/r22'); // or res.render('r22.html') depending on your setup
        } else if (regulation === 'R18') {
            return res.send('R18 not supported');
        } else {
            return res.send('Invalid regulation selected');
        }

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;
