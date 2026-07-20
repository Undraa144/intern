import "./globals.css";
import "@ant-design/v5-patch-for-react-19";

export const metadata = {
  title: "InternHub",
  description: "InternHub",
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
