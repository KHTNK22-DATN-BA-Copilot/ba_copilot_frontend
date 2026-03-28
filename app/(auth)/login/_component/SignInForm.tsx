"use client";
//import component
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

//import hook, library and other tools from react, nextjs
import { useActionState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";
import { SignIn, getGoogleAuthUrl } from "@/actions/auth.action";

//import Icon
import { ChartGantt, Github, ChevronRightIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const formSchema = z.object({
    email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
    password: z.string().trim().min(1, "Password is required"),
});

const submitAction = async (prevState: any, formData: FormData) => {
    // Tự động map toàn bộ FormData thành Object để Zod parse cho gọn
    const parsedData = formSchema.safeParse(Object.fromEntries(formData));
    
    if (!parsedData.success) {
        return {
            success: false,
            // Trả về object lỗi cho từng field
            errors: parsedData.error.flatten().fieldErrors, 
        };
    }

    const { email, password } = parsedData.data;
    const res = await SignIn(email, password);
    console.log("SignIn response:", res);

    if (res.statusCode !== 200) {
        // Tách biệt lỗi API thành 'message' để không bị lẫn với lỗi của các input fields
        return {
            success: false,
            message: res.message || "Login failed",
        };
    }

    redirect("/dashboard");
    return { success: true };
};

export default function SignInForm() {
    const [state, formAction, isPending] = useActionState(submitAction, {
        success: false,
        errors: {},
        message: "",
    });

    async function handleGoogleLogin() {
        const response = await getGoogleAuthUrl();
        console.log("Google Auth URL:", response);
        redirect(response);
    }

    return (
        <div className="w-full sm:w-[50%] lg:w-[30%] mt-5">
            <div className="shadow-2xl px-7 md:mx-auto bg-white dark:bg-gray-800 rounded-t-2xl">
                <div className="flex justify-center items-center pt-8 gap-x-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    <ChartGantt />
                    BA COPILOT
                </div>
                <h1 className="font-bold text-center pt-8 text-gray-900 dark:text-gray-100">
                    Sign In to BA Copilot
                </h1>
                <p className="text-center text-gray-500 dark:text-gray-400 text-[0.9rem]">
                    Welcome back! Please sign in to continue
                </p>
                
                {/* Social Login Buttons ... */}
                <div className="mt-7 gap-y-3 flex flex-col sm:flex-row w-full md:justify-between sm:gap-x-3">
                    {/* <div className="w-full">
                        <Button
                            variant="outline"
                            className="w-full cursor-pointer"
                        >
                            <Github className="mr-1 h-4 w-4" />
                            GitHub
                        </Button>
                    </div> */}
                    <div className="w-full cursor-pointer" onClick={handleGoogleLogin}>
                        <Button variant="outline" className="w-full cursor-pointer">
                            <FcGoogle className="mr-1 h-4 w-4" /> Google
                        </Button>
                    </div>
                </div>
                
                <div className="w-full border-gray-300 dark:border-gray-600 my-7 border-solid border-[0.5px] relative h-[1px]">
                    <p className="absolute left-[50%] bottom-[50%] transform -translate-x-1/2 translate-y-1/2 z-1 bg-white dark:bg-gray-800 px-3 text-gray-700 dark:text-gray-300">
                        or
                    </p>
                </div>

                <form action={formAction}>
                    {/* Hiển thị lỗi chung từ API (nếu có) */}
                    {state?.message && (
                        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md text-sm text-center">
                            {state.message}
                        </div>
                    )}

                    <div className="mb-2">
                        <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                        {/* Render lỗi cụ thể của Email */}
                        {state?.errors?.email && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{state.errors.email[0]}</p>
                        )}
                        
                        <Label htmlFor="password" className="mt-2.5 inline-block text-gray-900 dark:text-gray-100">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                        {/* Render lỗi cụ thể của Password */}
                        {state?.errors?.password && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{state.errors.password[0]}</p>
                        )}
                    </div>

                    <div className="flex justify-end items-center mb-6 mt-2">
                        <Link href={"/forgot-password"} className="text-sm text-blue-500 hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        className="w-full mb-8 cursor-pointer bg-blue-500 hover:bg-blue-600"
                        type="submit"
                        disabled={isPending}
                    >
                        {!isPending ? (
                            <>
                                Continue
                                <ChevronRightIcon className="ml-1 w-4 h-4" />
                            </>
                        ) : (
                            "Loading..."
                        )}
                    </Button>
                </form>
            </div>
            {/* Footer ... */}
            <div className="bg-[#f7f7f7] dark:bg-gray-700 w-full flex justify-center items-center py-4 px-8 shadow-2xl md:mx-auto rounded-b-2xl">
                <p className="text-gray-900 dark:text-gray-100">
                    Don't have an account?
                    <Link href={"/register"} className="mx-2 hover:underline cursor-pointer text-blue-500 dark:text-blue-400">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}