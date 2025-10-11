"use client";
import { useEffect, useState } from "react";
import Headers from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export default function ProjectLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Headers
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
            />

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
            <Footer />
        </div>
    );
}