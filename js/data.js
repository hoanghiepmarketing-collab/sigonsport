// ============================================
// SIGON SPORT — Product Data (Mock)
// ============================================

const formatPrice = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);

// Placeholder image generator
const img = (sport, color = '0057FF', bg = 'f0f4ff') =>
  `https://placehold.co/400x400/${bg}/${color}?text=${encodeURIComponent(sport)}`;

const products = [
  // ===== BÓNG ĐÁ =====
  { id: 1, name: 'Nike Mercurial Vapor 15 Elite FG', brand: 'Nike', sport: 'bong-da', category: 'giay', price: 3290000, originalPrice: 4500000, discount: 27, rating: 4.9, reviewCount: 87, sold: 412, isNew: true, isHot: true, isSecondhand: false, inStock: true, img: img('Mercurial','FFFFFF','0057FF') },
  { id: 2, name: 'Adidas Predator Accuracy.1 FG', brand: 'Adidas', sport: 'bong-da', category: 'giay', price: 2890000, originalPrice: 3800000, discount: 24, rating: 4.8, reviewCount: 63, sold: 298, isNew: false, isHot: true, isSecondhand: false, inStock: true, img: img('Predator','FFFFFF','E5002B') },
  { id: 3, name: 'Puma Future 7 Pro TF', brand: 'Puma', sport: 'bong-da', category: 'giay', price: 1990000, originalPrice: 2700000, discount: 26, rating: 4.7, reviewCount: 45, sold: 187, isNew: true, isHot: false, isSecondhand: false, inStock: true, img: img('Puma+Future','FFFFFF','FF6B00') },
  { id: 4, name: 'Mizuno Morelia Neo IV β Japan FG', brand: 'Mizuno', sport: 'bong-da', category: 'giay', price: 4200000, originalPrice: 5500000, discount: 24, rating: 4.9, reviewCount: 34, sold: 89, isNew: false, isHot: true, isSecondhand: false, inStock: true, img: img('Mizuno','FFFFFF','111111') },
  // ===== CẦU LÔNG =====
  { id: 5, name: 'Yonex Astrox 88D Pro', brand: 'Yonex', sport: 'cau-long', category: 'vot', price: 3500000, originalPrice: 4200000, discount: 17, rating: 4.9, reviewCount: 112, sold: 534, isNew: false, isHot: true, isSecondhand: false, inStock: true, img: img('Yonex+88D','FFFFFF','1a1a1a') },
  { id: 6, name: 'Victor Thruster F Claw II', brand: 'Victor', sport: 'cau-long', category: 'vot', price: 2800000, originalPrice: 3600000, discount: 22, rating: 4.8, reviewCount: 78, sold: 321, isNew: true, isHot: false, isSecondhand: false, inStock: true, img: img('Victor+F','FFFFFF','E5002B') },
  { id: 7, name: 'Li-Ning Axforce 90', brand: 'Li-Ning', sport: 'cau-long', category: 'vot', price: 2200000, originalPrice: 2900000, discount: 24, rating: 4.7, reviewCount: 56, sold: 210, isNew: false, isHot: false, isSecondhand: false, inStock: true, img: img('Li-Ning','FFFFFF','FF6B00') },
  { id: 8, name: 'Yonex Power Cushion 65Z3 Giày Cầu Lông', brand: 'Yonex', sport: 'cau-long', category: 'giay', price: 2100000, originalPrice: 2800000, discount: 25, rating: 4.8, reviewCount: 92, sold: 445, isNew: false, isHot: true, isSecondhand: false, inStock: true, img: img('Yonex+65Z3','FFFFFF','0057FF') },
  // ===== TENNIS =====
  { id: 9, name: 'Wilson Pro Staff RF97 Autograph', brand: 'Wilson', sport: 'tennis', category: 'vot', price: 5200000, originalPrice: 6800000, discount: 24, rating: 4.9, reviewCount: 67, sold: 156, isNew: false, isHot: true, isSecondhand: false, inStock: true, img: img('Wilson+RF97','FFFFFF','E5002B') },
  { id: 10, name: 'Babolat Pure Drive 2023', brand: 'Babolat', sport: 'tennis', category: 'vot', price: 3800000, originalPrice: 4900000, discount: 22, rating: 4.8, reviewCount: 89, sold: 267, isNew: true, isHot: false, isSecondhand: false, inStock: true, img: img('Babolat','FFFFFF','0057FF') },
  { id: 11, name: 'Nike Court Zoom Vapor Pro 2 Tennis', brand: 'Nike', sport: 'tennis', category: 'giay', price: 2750000, originalPrice: 3500000, discount: 21, rating: 4.7, reviewCount: 48, sold: 178, isNew: false, isHot: false, isSecondhand: false, inStock: true, img: img('Court+VP2','FFFFFF','111111') },
  // ===== PICKLEBALL =====
  { id: 12, name: 'Selkirk AMPED Epic Paddle', brand: 'Selkirk', sport: 'pickleball', category: 'vot', price: 2900000, originalPrice: 3800000, discount: 24, rating: 4.8, reviewCount: 43, sold: 134, isNew: true, isHot: true, isSecondhand: false, inStock: true, img: img('Selkirk','FFFFFF','00B04F') },
  { id: 13, name: 'Joola Ben Johns Hyperion CFS 16', brand: 'Joola', sport: 'pickleball', category: 'vot', price: 3400000, originalPrice: 4200000, discount: 19, rating: 4.9, reviewCount: 31, sold: 98, isNew: true, isHot: false, isSecondhand: false, inStock: true, img: img('Joola','FFFFFF','0057FF') },
  { id: 14, name: 'Franklin Sports X-40 Pickleball', brand: 'Franklin', sport: 'pickleball', category: 'phu-kien', price: 380000, originalPrice: 500000, discount: 24, rating: 4.6, reviewCount: 87, sold: 423, isNew: false, isHot: false, isSecondhand: false, inStock: true, img: img('Pickleball','FFFFFF','FF6B00') },
  // ===== SECONDHAND =====
  { id: 101, name: 'Nike Phantom GT2 Elite FG — Secondhand', brand: 'Nike', sport: 'bong-da', category: 'giay', price: 850000, originalPrice: 3900000, discount: 78, rating: null, reviewCount: 0, sold: 0, isNew: false, isHot: false, isSecondhand: true, condition: 'Mới 85%', inStock: true, img: img('Phantom+GT2','FFFFFF','8B6914') },
  { id: 102, name: 'Adidas Copa Pure .1 FG — Secondhand', brand: 'Adidas', sport: 'bong-da', category: 'giay', price: 690000, originalPrice: 2900000, discount: 76, rating: null, reviewCount: 0, sold: 0, isNew: false, isHot: false, isSecondhand: true, condition: 'Mới 80%', inStock: true, img: img('Copa+Pure','FFFFFF','8B6914') },
  { id: 103, name: 'Yonex Astrox 99 Pro — Secondhand', brand: 'Yonex', sport: 'cau-long', category: 'vot', price: 1200000, originalPrice: 4800000, discount: 75, rating: null, reviewCount: 0, sold: 0, isNew: false, isHot: false, isSecondhand: true, condition: 'Mới 90%', inStock: true, img: img('Astrox+99','FFFFFF','8B6914') },
  { id: 104, name: 'Puma Ultra 1.4 TF — Secondhand', brand: 'Puma', sport: 'bong-da', category: 'giay', price: 480000, originalPrice: 1900000, discount: 75, rating: null, reviewCount: 0, sold: 0, isNew: false, isHot: false, isSecondhand: true, condition: 'Mới 75%', inStock: true, img: img('Ultra+1.4','FFFFFF','8B6914') },
];

// Helper: get products by sport
const getProductsBySport = (sport, limit = 8) =>
  products.filter(p => p.sport === sport && !p.isSecondhand).slice(0, limit);

const getHotProducts = (limit = 8) =>
  products.filter(p => p.isHot && !p.isSecondhand).slice(0, limit);

const getNewProducts = (limit = 8) =>
  products.filter(p => p.isNew && !p.isSecondhand).slice(0, limit);

const getSecondhandProducts = (limit = 8) =>
  products.filter(p => p.isSecondhand).slice(0, limit);
