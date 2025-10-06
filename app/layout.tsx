import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "BA Copilot",
    description: "AI-powered code completion",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <div className="fixed from-green-50 to-emerald-100 inset-0 -z-10">
                    <div className="absolute top-72 left-1/5 w-81 h-81 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 dark:opacity-30 animate-blob"></div>
                    <div className="absolute top-0 right-2/7 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 dark:opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 right-1/5 w-114 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 dark:opacity-30 animate-blob animation-delay-4000"></div>
                </div>
                {children}
            </body>
        </html>
    );
}
