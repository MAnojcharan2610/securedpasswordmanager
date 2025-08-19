// Example Express.js API endpoint for saving credentials to Firebase
import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
2  databaseURL: 'https://password-manager-2e87e.firebaseio.com'
});

app.post('/api/save-credentials', async (req, res) => {
  const { site, username, password, userId } = req.body;
  if (!site || !username || !password || !userId) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  // Encrypt password here before saving (implement your encryption logic)
  const encryptedPassword = password; // Replace with encryption
  const ref = admin.database().ref(`userPasswords/${userId}`);
  const newEntry = ref.push();
  await newEntry.set({
    inputSite: site,
    inputUsername: username,
    cipherText: encryptedPassword,
    encryptionMethod: 'AES-256', // or your method
    iv: '', // your IV if needed
    timestamp: Date.now(),
    isFavourite: false
  });
  res.json({ success: true });
});

app.listen(3001, () => {
  console.log('API server running on port 3001');
});

// Replace <YOUR-FIREBASE-PROJECT> with your Firebase project ID.
// Add authentication and encryption for production use.
