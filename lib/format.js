// Định dạng tiền tệ VND
export function formatPrice(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

// Định dạng ngày tháng Việt Nam
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Map status sang label tiếng Việt
export const STATUS_LABELS = {
  pending:   'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping:  'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

export const STATUS_BADGE_CLASS = {
  pending:   'badge-pending',
  confirmed: 'badge-confirmed',
  shipping:  'badge-shipping',
  delivered: 'badge-delivered',
  cancelled: 'badge-cancelled',
};
