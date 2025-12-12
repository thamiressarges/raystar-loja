
import type { Metadata } from "next";
import { Poppins, Ibarra_Real_Nova } from "next/font/google";
import "./globals.css";
import { createSupabaseServerClient } from "@/lib/server";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/app/providers";
import { Suspense } from "react"; 

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const ibarra = Ibarra_Real_Nova({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibarra",
});

export const metadata: Metadata = {
  title: "Raystar",
  description: "Loja de vendas de roupas",
};

async function checkUserSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await checkUserSession();
  const isLoggedIn = !!user;

  return (
    <html lang="pt-br" className={`${poppins.variable} ${ibarra.variable}`}>
      <body className={poppins.className}>
        <Providers isLoggedIn={isLoggedIn}>
          <div className="flex flex-col min-h-screen">
            
            <Suspense fallback={<div className="h-20 w-full bg-white border-b border-gray-200" />}>
              <Header isLoggedIn={isLoggedIn} />
            </Suspense>

            <main className="container mx-auto p-4 flex-1">
              <div className={ibarra.className}>{children}</div>
            </main>

            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}