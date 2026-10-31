// Map Supabase row (snake_case) → API response (camelCase)
function toProduct(row) {
  if (!row) return null;
  return {
    id:            row.id,
    name:          row.name,
    brand:         row.brand || '',
    sport:         row.sport || '',
    category:      row.category || '',
    price:         row.price,
    originalPrice: row.original_price,
    discount:      row.discount || 0,
    img:           row.img || '',
    images:        row.images || [],
    sizes:         row.sizes || [],
    colors:        row.colors || [],
    rating:        row.rating,
    reviewCount:   row.review_count || 0,
    sold:          row.sold || 0,
    isNew:         row.is_new || false,
    isHot:         row.is_hot || false,
    isSecondhand:  row.is_secondhand || false,
    inStock:       row.in_stock !== false,
    condition:     row.condition || '',
    description:   row.description || '',
    tags:          row.tags || [],
    createdAt:     row.created_at,
    updatedAt:     row.updated_at,
  };
}

// Map request body (camelCase) → DB row (snake_case)
function fromProduct(data) {
  const row = {};
  if (data.name          !== undefined) row.name           = data.name;
  if (data.brand         !== undefined) row.brand          = data.brand;
  if (data.sport         !== undefined) row.sport          = data.sport;
  if (data.category      !== undefined) row.category       = data.category;
  if (data.price         !== undefined) row.price          = Number(data.price);
  if (data.originalPrice !== undefined) row.original_price = Number(data.originalPrice) || null;
  if (data.discount      !== undefined) row.discount       = Number(data.discount) || 0;
  if (data.img           !== undefined) row.img            = data.img;
  if (data.images        !== undefined) row.images         = data.images;
  if (data.sizes         !== undefined) row.sizes          = data.sizes;
  if (data.colors        !== undefined) row.colors         = data.colors;
  if (data.rating        !== undefined) row.rating         = data.rating;
  if (data.reviewCount   !== undefined) row.review_count   = data.reviewCount;
  if (data.sold          !== undefined) row.sold           = data.sold;
  if (data.isNew         !== undefined) row.is_new         = !!data.isNew;
  if (data.isHot         !== undefined) row.is_hot         = !!data.isHot;
  if (data.isSecondhand  !== undefined) row.is_secondhand  = !!data.isSecondhand;
  if (data.inStock       !== undefined) row.in_stock       = !!data.inStock;
  if (data.condition     !== undefined) row.condition      = data.condition;
  if (data.description   !== undefined) row.description    = data.description;
  if (data.tags          !== undefined) row.tags           = data.tags;
  return row;
}

function toOrder(row) {
  if (!row) return null;
  return {
    id:            row.id,
    orderNumber:   row.order_number,
    customer: {
      name:     row.customer_name,
      phone:    row.customer_phone,
      email:    row.customer_email,
      address:  row.customer_address,
      province: row.customer_province,
      note:     row.customer_note,
    },
    items:         row.items || [],
    subtotal:      row.subtotal || 0,
    shipping:      row.shipping || 0,
    total:         row.total || 0,
    status:        row.status,
    paymentMethod: row.payment_method,
    createdAt:     row.created_at,
    updatedAt:     row.updated_at,
  };
}

module.exports = { toProduct, fromProduct, toOrder };
