const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Middleware to parse the body of POST requests
app.use(bodyParser.urlencoded({ extended: true }));

// Mock database (for testing)
let users = [
  { email: "user@example.com", password: bcrypt.hashSync("password123", 10) },
  // add more users as needed
];

// Forgot Password Route
app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  
  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(400).send("No user found with that email address");
  }

  // Generate a reset token
  const token = jwt.sign({ email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });

  // Send email with reset link (You can mock this for local testing)
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  
  // Here, you'd normally send the email using a service like nodemailer
  console.log(`Reset link: ${resetLink}`); // Simulate email sending for testing

  res.send("Password reset link sent to your email address.");
});

// Reset Password Route
app.get("/reset-password", (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).send("Token not provided");
  }

  // Verify the token
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(400).send("Invalid or expired token");
    }

    // You can render a reset form here (send HTML or JSON response)
    res.send(`
      <form method="POST" action="/reset-password">
        <input type="hidden" name="token" value="${token}">
        <input type="password" name="new-password" placeholder="Enter new password" required>
        <button type="submit">Reset Password</button>
      </form>
    `);
  });
});

// Reset Password Submit Route
app.post("/reset-password", (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).send("Missing token or new password");
  }

  // Verify token
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(400).send("Invalid or expired token");
    }

    const user = users.find(user => user.email === decoded.email);
    if (!user) {
      return res.status(400).send("User not found");
    }

    // Hash the new password and update the mock database
    user.password = bcrypt.hashSync(newPassword, 10);

    res.send("Password has been reset successfully!");
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
