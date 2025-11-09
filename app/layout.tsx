import type { Metadata } from "next";
import { Poppins, Ibarra_Real_Nova } from 'next/font/google'
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

const ibarra = Ibarra_Real_Nova({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibarra',
})

export const metadata: Metadata = {
  title: "Raystar",
  description: "Loja de vendas de roupas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${poppins.variable} ${ibarra.variable}`}>
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  );
}