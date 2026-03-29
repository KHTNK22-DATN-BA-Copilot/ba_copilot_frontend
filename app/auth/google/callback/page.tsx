"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HandleGoogleCallback } from "@/actions/auth.action";
import { Loader2 } from "lucide-react";

const CallbackLogic = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const hasCalled = useRef(false);

    useEffect(() => {
        const code = searchParams.get("code");

        if (!code) {
            setError("Không tìm thấy mã xác thực từ Google.");
            return;
        }

        if (hasCalled.current) return;
        hasCalled.current = true;

        const authenticate = async () => {
            try {
                const response = await HandleGoogleCallback(code);

                if (response.success) {
                    router.push("/dashboard");
                } else {
                    setError(response.message || "Xác thực Google thất bại.");
                }
            } catch (err) {
                console.error(err);
                setError("Đã xảy ra lỗi hệ thống. Vui lòng thử lại.");
            }
        };

        authenticate();
    }, [searchParams, router]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-4">
                        Lỗi Đăng Nhập
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        {error}
                    </p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Quay lại trang đăng nhập
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Connecting with Google...
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
                Please wait while we authenticate your account. This may take a
                few seconds.
            </p>
        </div>
    );
};

export default function GoogleCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-6" />
                    <p>Đang tải...</p>
                </div>
            }
        >
            <CallbackLogic />
        </Suspense>
    );
}
