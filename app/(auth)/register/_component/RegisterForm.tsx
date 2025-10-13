'use client';

import Link from 'next/link';
import Divider from '@mui/material/Divider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useRegisterForm } from "./useRegisterForm";
import GoogleLoginButton from './GoogleLoginButton';
import PasswordRequirements from './PasswordRequirements';
import PasswordMatchIndicator from './PasswordMatchIndicator';

export default function RegisterForm() {

    const {
        formData,
        errors,
        isLoading,
        isLoginLoading,
        passwordRequirements,
        isFormValid,
        handleSubmit,
        handleChange,
        handleGoogleLogin,
    } = useRegisterForm();

    return (
        <>
            <div className="w-full sm:w-[50%] lg:w-[30%] mt-5">
                <div className="shadow-2xl px-7 md:mx-auto bg-white dark:bg-gray-800 rounded-t-2xl">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 pt-8">Create Account</h2>
                        <p className="text-gray-600 dark:text-gray-400">Join us today and get started</p>
                    </div>

                    {/* Google Login Button */}
                    <GoogleLoginButton onClick={handleGoogleLogin} isLoading={isLoginLoading} />

                    <Divider>or</Divider>

                    {/* Registration Form */}
                    <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                                Full Name
                            </label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 ${errors.name
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600'
                                    }`}
                                placeholder="Enter your full name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 ${errors.email
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600'
                                    }`}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 ${errors.password
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600'
                                    }`}
                                placeholder="Create a password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                            )}

                            {/* Password Requirements */}
                            <PasswordRequirements
                                requirements={passwordRequirements}
                                password={formData.password}
                            />
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                                Confirm Password
                            </label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 ${errors.confirmPassword
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600'
                                    }`}
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                            )}

                            {/* Password Match Indicator */}
                            <PasswordMatchIndicator
                                password={formData.password}
                                confirmPassword={formData.confirmPassword}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading || !isFormValid()}
                            className={`w-full py-1.5 px-3 rounded-lg font-medium text-white transition-colors ${isLoading || !isFormValid()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </form>

                    {/* Terms and Privacy */}
                    <div className="pb-4 pt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        By creating an account, you agree to our{' '}
                        <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline">
                            Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline">
                            Privacy Policy
                        </Link>
                    </div>
                </div>

                {/* Login Link */}
                <div className="bg-[#f7f7f7] dark:bg-gray-700 w-full flex justify-center items-center py-4 px-8 shadow-2xl md:mx-auto rounded-b-2xl">
                    <p className="text-gray-600 dark:text-gray-100">
                        Already have an account?{' '}
                        <Link href="/login" className="mx-2 hover:underline cursor-pointer text-blue-600 dark:text-blue-400">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}