interface Props {
    countdown: number;
    isResending: boolean;
    onResend: () => void;
}

export default function ResendButton({ countdown, isResending, onResend }: Props) {
    return (
        <p className="text-sm text-gray-600">
            Didn’t receive a code?{" "}
            <button
                onClick={onResend}
                disabled={isResending || countdown > 0}
                className={`font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded ${isResending || countdown > 0
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-blue-600 hover:underline"
                    }`}
            >
                {isResending ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend"}
            </button>
        </p>
    )
}