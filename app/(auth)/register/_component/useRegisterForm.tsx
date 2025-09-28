import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function useRegisterForm() {
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
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    const checkPasswordRequirements = (password: string) => {
        setPasswordRequirements({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        });
    };

    const isFormValid = () => {
        // Check if all fields are filled
        const allFieldsFilled = (
            formData.name.trim() !== '' &&
            formData.email.trim() !== '' &&
            formData.password.trim() !== '' &&
            formData.confirmPassword.trim() !== ''
        );

        // Check if email format is valid
        const emailValid = /\S+@\S+\.\S+/.test(formData.email);

        // Check if password meets all requirements
        const passwordValid = (
            passwordRequirements.length &&
            passwordRequirements.uppercase &&
            passwordRequirements.lowercase &&
            passwordRequirements.number &&
            passwordRequirements.special
        );

        // Check if passwords match
        const passwordsMatch = formData.password === formData.confirmPassword;

        // Check if name is at least 2 characters
        const nameValid = formData.name.trim().length >= 2;

        return allFieldsFilled && emailValid && passwordValid && passwordsMatch && nameValid;
    };

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
        } else {
            const passwordErrors = [];

            if (formData.password.length < 8) {
                passwordErrors.push('at least 8 characters');
            }
            if (!/[A-Z]/.test(formData.password)) {
                passwordErrors.push('one uppercase letter');
            }
            if (!/[a-z]/.test(formData.password)) {
                passwordErrors.push('one lowercase letter');
            }
            if (!/\d/.test(formData.password)) {
                passwordErrors.push('one number');
            }
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
                passwordErrors.push('one special character');
            }

            if (passwordErrors.length > 0) {
                newErrors.password = `Password must contain ${passwordErrors.join(', ')}.`;
            }
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
                `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/v1/auth/register`,
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

        // Real-time password validation
        if (name === 'password') {
            checkPasswordRequirements(value);
        }

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

    return {
        formData,
        errors,
        isLoading,
        isLoginLoading,
        passwordRequirements,
        isFormValid,
        handleSubmit,
        handleChange,
        handleGoogleLogin,
    }
}