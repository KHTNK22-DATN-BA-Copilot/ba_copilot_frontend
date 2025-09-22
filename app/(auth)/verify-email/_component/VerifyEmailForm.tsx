'use client';
import useVerifyEmail from './useVerifyEmail';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PinInput from './PinInput';
import ResendButton from './ResendButton';
import VerifyMessage from './VerifyMessage';

export default function VerifyEmailForm() {
    const {
        email,
        pin,
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
    } = useVerifyEmail();

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
                    <PinInput
                        pin={pin}
                        inputRefs={inputRefs}
                        isVerifying={isVerifying}
                        onChange={handlePinChange}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                    />
                    <ResendButton
                        countdown={countdown}
                        isResending={isResending}
                        onResend={handleResendPin}
                    />
                </div>

                {/* Message */}
                <VerifyMessage message={message} />

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