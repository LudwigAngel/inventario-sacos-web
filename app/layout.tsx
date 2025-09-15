import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Sistema de Inventario de Sacos",
  description: "Sistema de gestión de inventario de sacos con autenticación JWT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1F2937',
              color: '#F8FAFC',
            },
          }}
        />
      </body>
    </html>
  );
}
