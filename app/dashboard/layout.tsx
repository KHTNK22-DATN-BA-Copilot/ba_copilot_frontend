"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    // Check if we're on a project page (which has its own layout)
    const isProjectPage = pathname?.startsWith("/dashboard/project/");

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => {
            const newMode = !prev;
            localStorage.setItem("theme", newMode ? "dark" : "light");
            if (newMode) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            return newMode;
        });
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${
                isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
            }`}
        >
            <Header
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
            />

            {isProjectPage ? (
                <>
                    <div className="flex h-[calc(100vh-4rem)]">
                        {/* Desktop Sidebar - visible on extra large screens */}
                        <div className="hidden xl:block">
                            <Sidebar
                                isDarkMode={isDarkMode}
                                isOpen={false}
                                isMobile={false}
                            />
                        </div>

                        {/* Mobile/Tablet/iPad Sidebar - overlay on smaller screens */}
                        <div className="xl:hidden">
                            <Sidebar
                                isDarkMode={isDarkMode}
                                isOpen={isMenuOpen}
                                onClose={() => setIsMenuOpen(false)}
                                isMobile={true}
                            />
                        </div>

                        {/* Main Content */}
                        {children}
                    </div>
                </>
            ) : (
                <main className="min-h-[calc(100vh-4rem)]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </div>
                </main>
            )}

            <Footer />
        </div>
    );
}
