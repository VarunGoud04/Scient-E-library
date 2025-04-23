const express = require('express');
const bcrypt = require('bcryptjs'); // Use bcryptjs
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

router.post('/login', async (req, res) => {
    const { email, password, regulation } = req.body;

    try {
        const snapshot = await db.collection('users').where('email', '==', email).get();
        
        if (snapshot.empty) {
            return res.send('User not found');
        }

        const userData = snapshot.docs[0].data();

        // Compare password
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.send('Invalid credentials');
        }

        // Redirect or render based on regulation
        if (regulation === 'R22') {
            res.redirect('/r22');
        } else if (regulation === 'R18') {
            res.send('R18 not supported');
        } else {
            res.send('Invalid regulation selected');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
