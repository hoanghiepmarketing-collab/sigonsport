const { signToken } = require('../../lib/auth');

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
};

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body || {};
  const validUser = process.env.ADMIN_USERNAME || 'admin';
  const validPass = process.env.ADMIN_PASSWORD || 'sigon@2025';

  if (username !== validUser || password !== validPass) {
    return res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu' });
  }

  const token = signToken({ role: 'admin', username });
  res.json({ token, username });
};
