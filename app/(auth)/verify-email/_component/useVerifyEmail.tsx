import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function useVerifyEmail() {
    const [email, setEmail] = useState("");
    const [pin, setPin] = useState(["", "", "", "", "", ""]);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [message, setMessage] = useState("");
    const [countdown, setCountdown] = useState(0);
    const router = useRouter();
    //const searchParams = useSearchParams();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Get email from URL params
        // const emailParam = searchParams.get('email');
        // if (emailParam) {
        //     setEmail(decodeURIComponent(emailParam));
        // }
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const emailParam = urlParams.get("email");
            if (emailParam) {
                setEmail(decodeURIComponent(emailParam));
            }
        }
    }, []);

    useEffect(() => {
        setCountdown(60);
    }, []);

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    useEffect(() => {
        // Countdown for resend button
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handlePinChange = (index: number, value: string) => {
        if (value.length > 1) return; // Only allow single digit
        if (!/^\d*$/.test(value)) return; // Only allow numbers

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Auto focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto verify when all 6 digits are entered
        if (newPin.every((digit) => digit !== "") && value) {
            handleVerifyPin(newPin.join(""));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !pin[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text");
        const digits = pastedData.replace(/\D/g, "").slice(0, 6);

        if (digits.length === 6) {
            const newPin = digits.split("");
            setPin(newPin);
            handleVerifyPin(digits);
        }
    };

    const handleVerifyPin = async (pinCode: string) => {
        if (pinCode.length !== 6) return;

        setIsVerifying(true);
        setMessage("");

        try {
            const payload = {
                code: pinCode,
            };

            const respond = await axios.post(
                `${
                    process.env.NEXT_PUBLIC_BACKEND_DOMAIN
                }/api/v1/auth/verify-email?email=${encodeURIComponent(email)}`,
                payload
            );

            console.log("Response:", respond.data);

            setTimeout(() => {
                router.push("/login?verified=true");
            }, 2000);

            if (pinCode === respond.data.code) {
                // Mock successful PIN
                setMessage("Email verified successfully! Redirecting...");
                setTimeout(() => {
                    router.push("/login?verified=true");
                }, 2000);
            } else {
            }
        } catch (error) {
            console.error("Error verifying PIN:", error);

            if (axios.isAxiosError(error) && error.response) {
                setMessage(
                    error.response.data.message || " PIN. Please try again."
                );
            } else {
                setMessage("An unexpected error occurred. Please try again.");
            }

            setPin(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendPin = async () => {
        if (countdown > 0 || !email) return;

        setIsResending(true);
        setMessage("");

        try {
            // Simulate API call to resend PIN
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Here you would make an actual API call to resend PIN
            console.log("Resending PIN to:", email);

            setMessage("New PIN sent successfully!");
            setCountdown(60); // 60 second cooldown
            setPin(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } catch (error) {
            console.error("Error resending PIN:", error);
            setMessage("Failed to resend PIN. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    const handleChangeEmail = () => {
        router.push("/register");
    };

    return {
        email,
        pin,
        setPin,
        isVerifying,
        isResending,
        message,
        countdown,
        inputRefs,
        handlePinChange,
        handleKeyDown,
        handlePaste,
        handleVerifyPin,
        handleResendPin,
    };
}
