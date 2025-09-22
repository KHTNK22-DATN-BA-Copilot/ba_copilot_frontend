'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Divider from '@mui/material/Divider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RegisterForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 8 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character.';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                passwordhash: formData.password
            }

            const respond = await axios.post(
                'http://localhost:8010/api/v1/auth/register',
                payload
            )

            console.log('Registration successful:', respond.data);

            router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        } catch (error) {
            console.error('Registration error:', error);
            
            if (axios.isAxiosError(error) && error.response) {
                alert("Registration failed: " + error.response.data.message);
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoginLoading(true);

        // Simulate Google login process
    }

    return (
        <>
            <div className="w-full sm:w-[50%] lg:w-[30%] mt-5">
                <div className="shadow-2xl px-7 md:mx-auto bg-white rounded-t-2xl">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900  pt-8">Create Account</h2>
                        <p className="text-gray-600">Join us today and get started</p>
                    </div>

                    {/* Google Login Button */}
                    <Button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoginLoading}
                        className={`mt-8 mb-4 w-full py-1.5 px-3 rounded-lg border-1  font-medium text-black transition-colors ${isLoginLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                            }`}
                    >
                        {isLoginLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Login...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <img src="/ic_google.svg" alt="Google icon" className="h-5 w-5" />
                                Login with Google
                            </div>
                        )}
                    </Button>

                    <Divider>or</Divider>

                    <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.name
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                placeholder="Enter your full name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.email
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.password
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                placeholder="Create a password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.confirmPassword
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-1.5 px-3 rounded-lg font-medium text-white transition-colors ${isLoading
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
                    <div className="pb-4 pt-2 text-center text-sm text-gray-600">
                        By creating an account, you agree to our{' '}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">
                            Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                            Privacy Policy
                        </Link>
                    </div>
                </div>

                {/* Login Link */}
                <div className="bg-[#f7f7f7] w-full flex justify-center items-center py-4 px-8 shadow-2xl md:mx-auto rounded-b-2xl">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="mx-2 hover:underline cursor-pointer">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
