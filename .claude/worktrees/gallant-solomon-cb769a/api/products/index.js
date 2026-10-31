const { getSupabase } = require('../../lib/db');
const { toProduct, fromProduct } = require('../../lib/mappers');
const { verifyAdmin } = require('../../lib/auth');

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
};

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const sb = getSupabase();

  if (req.method === 'GET') {
    const { sport, category, secondhand, hot, isNew, sort, limit = '50', page = '1', search } = req.query;
    const lim  = Math.min(Number(limit), 200);
    const skip = (Number(page) - 1) * lim;

    let query = sb.from('products').select('*', { count: 'exact' });

    if (sport && sport !== 'all')    query = query.eq('sport', sport);
    if (category && category !== 'all') query = query.eq('category', category);
    if (secondhand === 'true')       query = query.eq('is_secondhand', true);
    if (secondhand === 'false')      query = query.eq('is_secondhand', false);
    if (hot === 'true')              query = query.eq('is_hot', true);
    if (isNew === 'true')            query = query.eq('is_new', true);
    if (search)                      query = query.ilike('name', `%${search}%`);

    switch (sort) {
      case 'price_asc':  query = query.order('price',      { ascending: true });  break;
      case 'price_desc': query = query.order('price',      { ascending: false }); break;
      case 'bestseller': query = query.order('sold',       { ascending: false }); break;
      case 'discount':   query = query.order('discount',   { ascending: false }); break;
      default:           query = query.order('created_at', { ascending: false });
    }

    query = query.range(skip, skip + lim - 1);
    const { data, error, count } = await query;

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ products: (data || []).map(toProduct), total: count || 0, page: Number(page), limit: lim });
  }

  if (req.method === 'POST') {
    try { verifyAdmin(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }

    const row = fromProduct(req.body);
    const { data, error } = await sb.from('products').insert(row).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(toProduct(data));
  }

  res.status(405).json({ error: 'Method not allowed' });
};
