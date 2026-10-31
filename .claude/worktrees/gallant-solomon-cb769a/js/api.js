// ============================================
// SIGON SPORT — API Client (Frontend)
// ============================================

const SigonApi = {
  base: '/api',

  async get(path, params = {}) {
    const url = new URL(this.base + path, window.location.origin);
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') url.searchParams.set(k, v); });
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API ${res.status}`);
    return res.json();
  },

  async post(path, body) {
    const res = await fetch(this.base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Lỗi kết nối');
    return data;
  },

  // Fetch products with filter params
  async getProducts(params = {}) {
    return this.get('/products', params);
  },

  // Fetch single product
  async getProduct(id) {
    return this.get(`/products/${id}`);
  },

  // Create order
  async createOrder(order) {
    return this.post('/orders', order);
  },
};
