const jwt = require('jsonwebtoken');

const SECRET = () => process.env.JWT_SECRET || 'sigon_jwt_secret_2025';

function verifyAdmin(req) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }
  return jwt.verify(auth.slice(7), SECRET());
}

function signToken(payload) {
  return jwt.sign(payload, SECRET(), { expiresIn: '7d' });
}

module.exports = { verifyAdmin, signToken };
