// Import the Firebase Admin SDK to verify authentication tokens
const admin = require('firebase-admin');

// Middleware function to check and verify Firebase ID tokens
module.exports = async (req, res, next) => {
  // Get the Authorization header from the incoming request
  const header = req.headers.authorization;

  // If there is no header or it doesn't start with "Bearer ", reject the request
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  // Extract the token string (the part after "Bearer ")
  const token = header.split(' ')[1];

  try {
    // Verify the token using Firebase Admin SDK
    const decoded = await admin.auth().verifyIdToken(token);

    // Attach the decoded token (user data) to the request object
    req.user = decoded; 

    // Pass control to the next middleware or route handler
    next();
  } catch (err) {
    
    console.error('Auth error', err);
    return res.status(401).json({ msg: 'Invalid token' });
  }
};