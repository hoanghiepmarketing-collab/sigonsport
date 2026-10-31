const { getSupabase } = require('../../lib/db');
const { toOrder } = require('../../lib/mappers');
const { verifyAdmin } = require('../../lib/auth');

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
};

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try { verifyAdmin(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }

  const { id } = req.query;
  const sb = getSupabase();

  if (req.method === 'GET') {
    const { data, error } = await sb.from('orders').select('*').eq('id', id).single();
    if (error || !data) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    return res.json(toOrder(data));
  }

  if (req.method === 'PUT') {
    const allowed = ['status', 'customer_note'];
    const body = req.body || {};
    const update = {};
    if (body.status) update.status = body.status;
    if (body.note)   update.customer_note = body.note;

    const { data, error } = await sb.from('orders').update(update).eq('id', id).select().single();
    if (error || !data) return res.status(404).json({ error: error?.message || 'Không tìm thấy đơn hàng' });
    return res.json(toOrder(data));
  }

  res.status(405).json({ error: 'Method not allowed' });
};
