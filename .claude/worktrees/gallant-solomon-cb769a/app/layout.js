import Script from 'next/script';
import { CartProvider } from '../lib/cart-context';
import './globals.css';

export const metadata = {
  title: 'SIGON SPORT — Giày & Dụng Cụ Thể Thao Chính Hãng',
  description:
    'Mua giày đá bóng, vợt cầu lông, tennis, pickleball và thiết bị thể thao chính hãng giá tốt tại SIGON SPORT. Giao hàng toàn quốc.',
  keywords: 'giày thể thao, vợt cầu lông, giày bóng đá, tennis, pickleball, giày secondhand',
  openGraph: {
    title: 'SIGON SPORT — Năng động mỗi ngày, Chất lượng mỗi bước',
    description: 'Website thể thao chuyên nghiệp với hàng nghìn sản phẩm chính hãng và secondhand.',
    url: 'https://sigonsport.vn',
    siteName: 'SIGON SPORT',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {/* Font Awesome Icons */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/js/all.min.js"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
