const { getSupabase } = require('../../lib/db');
const { toOrder } = require('../../lib/mappers');
const { verifyAdmin } = require('../../lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();

  try { verifyAdmin(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }

  const sb = getSupabase();

  const [
    { count: totalOrders },
    { count: totalProducts },
    { count: pendingOrders },
    { data: recentRows },
    { data: allOrders },
  ] = await Promise.all([
    sb.from('orders').select('*', { count: 'exact', head: true }),
    sb.from('products').select('*', { count: 'exact', head: true }),
    sb.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    sb.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    sb.from('orders').select('status,total').neq('status', 'cancelled'),
  ]);

  const totalRevenue = (allOrders || []).reduce((sum, o) => sum + (o.total || 0), 0);

  const ordersByStatus = {};
  for (const o of (recentRows || [])) {
    ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
  }

  res.json({
    totalOrders:   totalOrders || 0,
    totalProducts: totalProducts || 0,
    totalRevenue,
    pendingOrders: pendingOrders || 0,
    recentOrders:  (recentRows || []).map(toOrder),
    ordersByStatus,
  });
};
