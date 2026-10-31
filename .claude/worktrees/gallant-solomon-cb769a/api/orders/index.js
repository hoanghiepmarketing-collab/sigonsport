const { getSupabase } = require('../../lib/db');
const { toOrder } = require('../../lib/mappers');
const { verifyAdmin } = require('../../lib/auth');

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
};

function genOrderNumber(count) {
  return `SIGON${String(count + 1).padStart(5, '0')}`;
}

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const sb = getSupabase();

  if (req.method === 'POST') {
    const { customer, items, subtotal, shipping, total, paymentMethod } = req.body || {};
    if (!customer?.name || !customer?.phone || !items?.length) {
      return res.status(400).json({ error: 'Thiếu thông tin đơn hàng' });
    }

    const { count } = await sb.from('orders').select('*', { count: 'exact', head: true });
    const orderNumber = genOrderNumber(count || 0);

    const { data, error } = await sb.from('orders').insert({
      order_number:      orderNumber,
      customer_name:     customer.name,
      customer_phone:    customer.phone,
      customer_email:    customer.email || '',
      customer_address:  customer.address || '',
      customer_province: customer.province || '',
      customer_note:     customer.note || '',
      items:             items,
      subtotal:          subtotal || 0,
      shipping:          shipping || 30000,
      total:             total || 0,
      payment_method:    paymentMethod || 'cod',
      status:            'pending',
    }).select().single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(toOrder(data));
  }

  if (req.method === 'GET') {
    try { verifyAdmin(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }

    const { status, page = '1', limit = '20' } = req.query;
    const lim  = Number(limit);
    const skip = (Number(page) - 1) * lim;

    let query = sb.from('orders').select('*', { count: 'exact' }).order('created_at', { ascending: false });
    if (status && status !== 'all') query = query.eq('status', status);
    query = query.range(skip, skip + lim - 1);

    const { data, error, count } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ orders: (data || []).map(toOrder), total: count || 0, page: Number(page), limit: lim });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
