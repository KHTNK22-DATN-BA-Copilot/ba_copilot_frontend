import Link from "next/link";

export default function Success() {
    return (
        <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-center">Success!</h2>
            <p className="text-gray-600 mb-6 text-center">
                Your password has been reset successfully. You can log in with
                your new password.
            </p>
            <div className="flex justify-center">
                <Link
                    href="/login"
                    className="text-center bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Log In
                </Link>
            </div>
        </div>
    );
}
