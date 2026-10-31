const { getSupabase } = require('../lib/db');
const { verifyAdmin } = require('../lib/auth');

const img = (sport, color = '0057FF', bg = 'f0f4ff') =>
  `https://placehold.co/400x400/${bg}/${color}?text=${encodeURIComponent(sport)}`;

const mockProducts = [
  { name: 'Nike Mercurial Vapor 15 Elite FG', brand: 'Nike', sport: 'bong-da', category: 'giay', price: 3290000, original_price: 4500000, discount: 27, rating: 4.9, review_count: 87, sold: 412, is_new: true, is_hot: true, is_secondhand: false, in_stock: true, img: img('Mercurial','FFFFFF','0057FF') },
  { name: 'Adidas Predator Accuracy.1 FG', brand: 'Adidas', sport: 'bong-da', category: 'giay', price: 2890000, original_price: 3800000, discount: 24, rating: 4.8, review_count: 63, sold: 298, is_new: false, is_hot: true, is_secondhand: false, in_stock: true, img: img('Predator','FFFFFF','E5002B') },
  { name: 'Puma Future 7 Pro TF', brand: 'Puma', sport: 'bong-da', category: 'giay', price: 1990000, original_price: 2700000, discount: 26, rating: 4.7, review_count: 45, sold: 187, is_new: true, is_hot: false, is_secondhand: false, in_stock: true, img: img('Puma+Future','FFFFFF','FF6B00') },
  { name: 'Mizuno Morelia Neo IV Japan FG', brand: 'Mizuno', sport: 'bong-da', category: 'giay', price: 4200000, original_price: 5500000, discount: 24, rating: 4.9, review_count: 34, sold: 89, is_new: false, is_hot: true, is_secondhand: false, in_stock: true, img: img('Mizuno','FFFFFF','111111') },
  { name: 'Yonex Astrox 88D Pro', brand: 'Yonex', sport: 'cau-long', category: 'vot', price: 3500000, original_price: 4200000, discount: 17, rating: 4.9, review_count: 112, sold: 534, is_new: false, is_hot: true, is_secondhand: false, in_stock: true, img: img('Yonex+88D','FFFFFF','1a1a1a') },
  { name: 'Victor Thruster F Claw II', brand: 'Victor', sport: 'cau-long', category: 'vot', price: 2800000, original_price: 3600000, discount: 22, rating: 4.8, review_count: 78, sold: 321, is_new: true, is_hot: false, is_secondhand: false, in_stock: true, img: img('Victor+F','FFFFFF','E5002B') },
  { name: 'Li-Ning Axforce 90', brand: 'Li-Ning', sport: 'cau-long', category: 'vot', price: 2200000, original_price: 2900000, discount: 24, rating: 4.7, review_count: 56, sold: 210, is_new: false, is_hot: false, is_secondhand: false, in_stock: true, img: img('Li-Ning','FFFFFF','FF6B00') },
  { name: 'Yonex Power Cushion 65Z3 Cầu Lông', brand: 'Yonex', sport: 'cau-long', category: 'giay', price: 2100000, original_price: 2800000, discount: 25, rating: 4.8, review_count: 92, sold: 445, is_new: false, is_hot: true, is_secondhand: false, in_stock: true, img: img('Yonex+65Z3','FFFFFF','0057FF') },
  { name: 'Wilson Pro Staff RF97 Autograph', brand: 'Wilson', sport: 'tennis', category: 'vot', price: 5200000, original_price: 6800000, discount: 24, rating: 4.9, review_count: 67, sold: 156, is_new: false, is_hot: true, is_secondhand: false, in_stock: true, img: img('Wilson+RF97','FFFFFF','E5002B') },
  { name: 'Babolat Pure Drive 2023', brand: 'Babolat', sport: 'tennis', category: 'vot', price: 3800000, original_price: 4900000, discount: 22, rating: 4.8, review_count: 89, sold: 267, is_new: true, is_hot: false, is_secondhand: false, in_stock: true, img: img('Babolat','FFFFFF','0057FF') },
  { name: 'Nike Court Zoom Vapor Pro 2 Tennis', brand: 'Nike', sport: 'tennis', category: 'giay', price: 2750000, original_price: 3500000, discount: 21, rating: 4.7, review_count: 48, sold: 178, is_new: false, is_hot: false, is_secondhand: false, in_stock: true, img: img('Court+VP2','FFFFFF','111111') },
  { name: 'Selkirk AMPED Epic Paddle', brand: 'Selkirk', sport: 'pickleball', category: 'vot', price: 2900000, original_price: 3800000, discount: 24, rating: 4.8, review_count: 43, sold: 134, is_new: true, is_hot: true, is_secondhand: false, in_stock: true, img: img('Selkirk','FFFFFF','00B04F') },
  { name: 'Joola Ben Johns Hyperion CFS 16', brand: 'Joola', sport: 'pickleball', category: 'vot', price: 3400000, original_price: 4200000, discount: 19, rating: 4.9, review_count: 31, sold: 98, is_new: true, is_hot: false, is_secondhand: false, in_stock: true, img: img('Joola','FFFFFF','0057FF') },
  { name: 'Franklin Sports X-40 Pickleball', brand: 'Franklin', sport: 'pickleball', category: 'phu-kien', price: 380000, original_price: 500000, discount: 24, rating: 4.6, review_count: 87, sold: 423, is_new: false, is_hot: false, is_secondhand: false, in_stock: true, img: img('Pickleball','FFFFFF','FF6B00') },
  { name: 'Nike Phantom GT2 Elite FG — Secondhand', brand: 'Nike', sport: 'bong-da', category: 'giay', price: 850000, original_price: 3900000, discount: 78, rating: null, review_count: 0, sold: 0, is_new: false, is_hot: false, is_secondhand: true, condition: 'Mới 85%', in_stock: true, img: img('Phantom+GT2','FFFFFF','8B6914') },
  { name: 'Adidas Copa Pure .1 FG — Secondhand', brand: 'Adidas', sport: 'bong-da', category: 'giay', price: 690000, original_price: 2900000, discount: 76, rating: null, review_count: 0, sold: 0, is_new: false, is_hot: false, is_secondhand: true, condition: 'Mới 80%', in_stock: true, img: img('Copa+Pure','FFFFFF','8B6914') },
  { name: 'Yonex Astrox 99 Pro — Secondhand', brand: 'Yonex', sport: 'cau-long', category: 'vot', price: 1200000, original_price: 4800000, discount: 75, rating: null, review_count: 0, sold: 0, is_new: false, is_hot: false, is_secondhand: true, condition: 'Mới 90%', in_stock: true, img: img('Astrox+99','FFFFFF','8B6914') },
  { name: 'Puma Ultra 1.4 TF — Secondhand', brand: 'Puma', sport: 'bong-da', category: 'giay', price: 480000, original_price: 1900000, discount: 75, rating: null, review_count: 0, sold: 0, is_new: false, is_hot: false, is_secondhand: true, condition: 'Mới 75%', in_stock: true, img: img('Ultra+1.4','FFFFFF','8B6914') },
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try { verifyAdmin(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }

  const sb = getSupabase();

  // Delete existing
  await sb.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Insert mock data
  const { data, error } = await sb.from('products').insert(mockProducts).select();
  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: `Đã seed ${data.length} sản phẩm`, count: data.length });
};
