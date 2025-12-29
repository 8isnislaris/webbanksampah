import "./globals.css";

export const metadata = {
  title: "Bank Sampah - Kelola Sampah, Hasilkan Uang",
  description: "Aplikasi Bank Sampah untuk mengelola sampah daur ulang dan menghasilkan nilai ekonomis. Mudah, cepat, dan ramah lingkungan.",
  keywords: "bank sampah, daur ulang, lingkungan, sampah, recycle, green",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
