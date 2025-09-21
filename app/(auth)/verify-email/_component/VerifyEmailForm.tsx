'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function VerifyEmailForm() {
    const [email, setEmail] = useState('');
    const [pin, setPin] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [message, setMessage] = useState('');
    const [countdown, setCountdown] = useState(0);
    const router = useRouter();
    const searchParams = useSearchParams();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);// mặc định = 0, sẽ set khi vào trang


    useEffect(() => {
        // Get email from URL params
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(decodeURIComponent(emailParam));
        }
    }, [searchParams]);

    useEffect(() => {
        setCountdown(60);
    }, []);

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
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
        if (newPin.every(digit => digit !== '') && value) {
            handleVerifyPin(newPin.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const digits = pastedData.replace(/\D/g, '').slice(0, 6);

        if (digits.length === 6) {
            const newPin = digits.split('');
            setPin(newPin);
            handleVerifyPin(digits);
        }
    };

    const handleVerifyPin = async (pinCode: string) => {
        if (pinCode.length !== 6) return;

        setIsVerifying(true);
        setMessage('');

        try {
            // Simulate API call to verify PIN
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Here you would make an actual API call to verify PIN
            console.log('Verifying PIN:', pinCode, 'for email:', email);

            // Simulate successful verification
            if (pinCode === '123456') { // Mock successful PIN
                setMessage('Email verified successfully! Redirecting...');
                setTimeout(() => {
                    router.push('/login?verified=true');
                }, 2000);
            } else {
                setMessage('Invalid PIN. Please try again.');
                setPin(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }

        } catch (error) {
            console.error('Error verifying PIN:', error);
            setMessage('Verification failed. Please try again.');
            setPin(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendPin = async () => {
        if (countdown > 0 || !email) return;

        setIsResending(true);
        setMessage('');

        try {
            // Simulate API call to resend PIN
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Here you would make an actual API call to resend PIN
            console.log('Resending PIN to:', email);

            setMessage('New PIN sent successfully!');
            setCountdown(60); // 60 second cooldown
            setPin(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();

        } catch (error) {
            console.error('Error resending PIN:', error);
            setMessage('Failed to resend PIN. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    const handleChangeEmail = () => {
        router.push('/register');
    };

    return (
        <>
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg text-center">
                {/* Shield Icon */}
                <div className="flex justify-center">
                    <div className="bg-green-100 p-6 rounded-full">
                        <svg
                            className="w-16 h-16 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                    <p className="text-gray-600">
                        Enter the verification code sent to your email
                    </p>
                    {email && (
                        <p className="text-lg text-blue-600 mt-2 break-all">
                            {email}
                        </p>
                    )}
                </div>

                {/* PIN Input */}
                <div className="space-y-2">
                    <div className="flex justify-center space-x-1.5">
                        {pin.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handlePinChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="w-12 h-12 text-center text-xl font-bold border-1 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                disabled={isVerifying}
                            />
                        ))}
                    </div>

                    {/* Resend Section */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Didn't receive a code?{' '}
                            <button
                                onClick={handleResendPin}
                                disabled={isResending || countdown > 0}
                                className={`font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded ${isResending || countdown > 0
                                    ? 'text-gray-500 cursor-not-allowed'
                                    : 'text-blue-600 hover:underline'
                                    }`}
                            >
                                {isResending
                                    ? 'Sending...'
                                    : countdown > 0
                                        ? `Resend in ${countdown}s`
                                        : 'Resend'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`p-3 rounded-lg ${message.includes('successfully') || message.includes('Redirecting')
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {message}
                    </div>
                )}

                {/* Manual Verify Button */}
                <Button
                    onClick={() => handleVerifyPin(pin.join(''))}
                    disabled={isVerifying || pin.some(digit => digit === '')}
                    className={`w-full py-1.5 px-3 rounded-lg font-medium transition-colors ${isVerifying || pin.some(digit => digit === '')
                        ? 'bg-blue-500 cursor-not-allowed text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                        }`}
                >
                    {isVerifying ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Verifying...
                        </div>
                    ) : (
                        'Verify PIN'
                    )}
                </Button>

                {/* Support */}
                <div className="text-center text-sm text-gray-500 pt-4">
                    <p>
                        Still having trouble?{' '}
                        <Link href="/support" className="text-blue-600 hover:text-blue-800 underline">
                            Contact Support
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
