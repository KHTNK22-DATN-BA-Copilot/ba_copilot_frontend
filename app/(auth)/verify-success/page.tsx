'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifySuccessPage() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | 'expired'>('success');
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get token from URL params
    const token = searchParams.get('token');
    
    // Simulate email verification process
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus('error');
        setIsVerifying(false);
        return;
      }

      try {
        // Simulate API call to verify email
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Here you would make an actual API call to verify the email token
        console.log('Verifying email with token:', token);
        
        // Simulate different outcomes based on token
        if (token === 'expired') {
          setVerificationStatus('expired');
        } else if (token === 'invalid') {
          setVerificationStatus('error');
        } else {
          setVerificationStatus('success');
        }
        
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams]);

  useEffect(() => {
    // Auto redirect to login after successful verification
    if (verificationStatus === 'success' && !isVerifying && countdown > 0) {
      const timer = setTimeout(() => {
        if (countdown === 1) {
          router.push('/login');
        } else {
          setCountdown(countdown - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [verificationStatus, isVerifying, countdown, router]);

  const getStatusContent = () => {
    if (isVerifying) {
      return {
        icon: (
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        ),
        title: 'Verifying Your Email',
        message: 'Please wait while we verify your email address...',
        bgColor: 'from-blue-50 to-indigo-100',
        iconBg: 'bg-blue-100'
      };
    }

    switch (verificationStatus) {
      case 'success':
        return {
          icon: (
            <svg
              className="w-16 h-16 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          title: 'Email Verified Successfully!',
          message: 'Your email has been verified. You can now sign in to your account.',
          bgColor: 'from-green-50 to-emerald-100',
          iconBg: 'bg-green-100'
        };

      case 'expired':
        return {
          icon: (
            <svg
              className="w-16 h-16 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          ),
          title: 'Verification Link Expired',
          message: 'This verification link has expired. Please request a new verification email.',
          bgColor: 'from-yellow-50 to-amber-100',
          iconBg: 'bg-yellow-100'
        };

      case 'error':
      default:
        return {
          icon: (
            <svg
              className="w-16 h-16 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          title: 'Verification Failed',
          message: 'We could not verify your email. The link may be invalid or expired.',
          bgColor: 'from-red-50 to-red-100',
          iconBg: 'bg-red-100'
        };
    }
  };

  const content = getStatusContent();

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${content.bgColor} p-4`}>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg text-center">
        {/* Status Icon */}
        <div className="flex justify-center">
          <div className={`${content.iconBg} p-6 rounded-full flex items-center justify-center`}>
            {content.icon}
          </div>
        </div>

        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{content.title}</h2>
          <p className="text-gray-600">{content.message}</p>
        </div>

        {/* Auto-redirect message for success */}
        {verificationStatus === 'success' && !isVerifying && (
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800">
              Redirecting to login page in <span className="font-bold">{countdown}</span> seconds...
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          {verificationStatus === 'success' && (
            <Link
              href="/login"
              className="block w-full py-3 px-4 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Continue to Login
            </Link>
          )}

          {verificationStatus === 'expired' && (
            <>
              <Link
                href="/register"
                className="block w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Request New Verification
              </Link>
              <Link
                href="/login"
                className="block w-full py-3 px-4 rounded-lg font-medium text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Back to Login
              </Link>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <Link
                href="/register"
                className="block w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Try Registration Again
              </Link>
              <Link
                href="/support"
                className="block w-full py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Contact Support
              </Link>
            </>
          )}
        </div>

        {/* Home Link */}
        <div className="text-center text-sm text-gray-500 pt-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
