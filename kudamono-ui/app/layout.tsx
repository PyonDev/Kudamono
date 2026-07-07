import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kudamono",
  description: "We gettin lit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: '#12131a' }}>
        <AuthProvider>
          {/* Automatically shows up on every single page view */}
          <Navbar />
          
          {/* Your active routes/pages fill this spot dynamically */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
