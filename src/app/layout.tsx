import type { Metadata } from "next";
import gilroy from './fonts'
import "./globals.css";
import Providers from "./providers";
import { Toaster } from 'react-hot-toast';
 

export const metadata: Metadata = {
  title: "Plural Health",
  description: "Plural Health Medical Records Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body
        className={`${gilroy.variable} antialiased`}
      >
        <Providers>
          <Toaster position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
