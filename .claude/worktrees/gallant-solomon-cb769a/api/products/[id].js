const { getSupabase } = require('../../lib/db');
const { toProduct, fromProduct } = require('../../lib/mappers');
const { verifyAdmin } = require('../../lib/auth');

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
};

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const sb = getSupabase();

  if (req.method === 'GET') {
    const { data, error } = await sb.from('products').select('*').eq('id', id).single();
    if (error || !data) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    return res.json(toProduct(data));
  }

  try { verifyAdmin(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }

  if (req.method === 'PUT') {
    const row = fromProduct(req.body);
    const { data, error } = await sb.from('products').update(row).eq('id', id).select().single();
    if (error || !data) return res.status(404).json({ error: error?.message || 'Không tìm thấy sản phẩm' });
    return res.json(toProduct(data));
  }

  if (req.method === 'DELETE') {
    const { error } = await sb.from('products').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ message: 'Đã xóa sản phẩm' });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
