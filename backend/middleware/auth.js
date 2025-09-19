const admin = require('firebase-admin');


module.exports = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Ingen token' });
  }
  const token = header.split(' ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // decoded.uid finns
    next();
  } catch (err) {
    console.error('Auth error', err);
    return res.status(401).json({ msg: 'Ogiltig token' });
  }
};