"use client";
import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

import Success from "./_component/Success";

const STEPS = {
    EMAIL: "email",
    VERIFY_CODE: "verify_code",
    NEW_PASSWORD: "new_password",
    SUCCESS: "success",
};

const getCurrentStepNumber = (currentStep: string) => {
    switch (currentStep) {
        case STEPS.EMAIL:
            return 1;
        case STEPS.VERIFY_CODE:
            return 2;
        case STEPS.NEW_PASSWORD:
            return 3;
        case STEPS.SUCCESS:
            return 4;
        default:
            return 1;
    }
};

function Indicator({ currentStep }: { currentStep: string }) {
    const steps = [
        { key: STEPS.EMAIL, label: "Enter your email", step: 1 },
        { key: STEPS.VERIFY_CODE, label: "Verify code", step: 2 },
        { key: STEPS.NEW_PASSWORD, label: "New password", step: 3 },
        { key: STEPS.SUCCESS, label: "Success", step: 4 },
    ];

    return (
        <div className="flex justify-center mb-8">
            {steps.map((step, index) => (
                <div key={step.key} className="flex items-center">
                    <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium
              ${
                  getCurrentStepNumber(currentStep) >= step.step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
              }`}
                    >
                        {step.step}
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={`w-8 h-1 mx-2 
                ${
                    getCurrentStepNumber(currentStep) > step.step
                        ? "bg-blue-600"
                        : "bg-gray-200"
                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export default function ForgotPasswordPage() {
    const [currentStep, setCurrentStep] = useState(STEPS.EMAIL);
    const [formData, setFormData] = useState({
        email: "",
        verificationCode: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleEmailSubmit = async (e: any) => {
        e.preventDefault();
        try {
            
            const res = await fetch("/api/forgot-password/sendEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: formData.email }),
            });
            const response = await res.json();
            if (!res.ok) {
                alert(response.message || "Failed to send email");
                return;
            }
            setCurrentStep(STEPS.VERIFY_CODE);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleCodeVerification = async (e: any) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/forgot-password/verifyPin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: formData.verificationCode,
                    email: formData.email,
                })
            });
            if (!res.ok) {
                alert("Failed to verify code");
                return;
            }
            setCurrentStep(STEPS.NEW_PASSWORD);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handlePasswordReset = async (e: any) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/forgot-password/resetPassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    new_password: formData.newPassword,
                    email: formData.email,
                })
            });
            if (!res.ok) {
                alert("Failed to reset password");
                return;
            }
            setCurrentStep(STEPS.SUCCESS);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const updateFormData = (field: any, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case STEPS.EMAIL:
                return (
                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-center mb-6">
                            Forgot Password
                        </h2>
                        <p className="text-gray-600 text-center mb-6">
                            Enter your email to receive a verification code
                        </p>
                        <form onSubmit={handleEmailSubmit}>
                            <div className="mb-4">
                                <Label
                                    htmlFor="email"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Email
                                </Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        updateFormData("email", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Send Verification Code
                            </Button>
                        </form>
                    </div>
                );

            case STEPS.VERIFY_CODE:
                return (
                    <div className="max-w-md mx-auto">
                        <h2 className="text-2xl font-bold text-center mb-6">
                            Enter Verification Code
                        </h2>
                        <p className="text-gray-600 text-center mb-6">
                            We have sent a verification code to the email{" "}
                            {formData.email}
                        </p>
                        <form
                            onSubmit={handleCodeVerification}
                            className="flex flex-col justify-center"
                        >
                            <div className="mb-4">
                                <Label
                                    htmlFor="verificationCode"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Verification Code
                                </Label>
                                <div className="flex justify-center">
                                    <InputOTP
                                        maxLength={6}
                                        value={formData.verificationCode}
                                        onChange={(e) =>
                                            updateFormData(
                                                "verificationCode",
                                                e
                                            )
                                        }
                                        name="verificationCode"
                                        required
                                    >
                                        <InputOTPGroup>
                                        {Array.from({ length: 6 }).map((_, index) => (
                                            <InputOTPSlot key={index} index={index} className="w-12 mx-1 h-12 text-center text-xl font-bold border-1 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"/>
                                        ))}
                                            
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="bg-blue-600 w-full text-white py-2 px-4 rounded-md hover:bg-blue-700 cursor-pointer transition-colors mb-4"
                            >
                                Verify
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setCurrentStep(STEPS.EMAIL)}
                                className=" hover:bg-blue-50 w-full transition-colors"
                            >
                                Back
                            </Button>
                        </form>
                    </div>
                );

            case STEPS.NEW_PASSWORD:
                return (
                    <div className="max-w-md mx-auto">
                        <h2 className="text-2xl font-bold text-center mb-6">
                            Set New Password
                        </h2>
                        <form onSubmit={handlePasswordReset}>
                            <div className="mb-4">
                                <Label
                                    htmlFor="newPassword"
                                    className="block text-sm font-medium mb-2"
                                >
                                    New Password
                                </Label>
                                <Input
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={(e) =>
                                        updateFormData(
                                            "newPassword",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    minLength={8}
                                />
                            </div>
                            <div className="mb-6">
                                <Label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Confirm Password
                                </Label>
                                <Input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        updateFormData(
                                            "confirmPassword",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mb-4"
                                disabled={
                                    formData.newPassword !==
                                    formData.confirmPassword
                                }
                            >
                                Reset Password
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() =>
                                    setCurrentStep(STEPS.VERIFY_CODE)
                                }
                                className="w-full rounded-md hover:bg-blue-50 transition-colors"
                            >
                                Back
                            </Button>
                        </form>
                    </div>
                );

            case STEPS.SUCCESS:
                return <Success />;

            default:
                return null;
        }
    };

    return (
        <div className="shadow-2xl md:mx-auto bg-white rounded-2xl py-5 flex flex-col items-center w-full sm:w-[50%]">
            <Indicator currentStep={currentStep} />
            <div className="max-w-2xl mx-auto px-4 h-full flex items-center">
                {renderCurrentStep()}
            </div>
        </div>
    );
}
