import "./globals.css";

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