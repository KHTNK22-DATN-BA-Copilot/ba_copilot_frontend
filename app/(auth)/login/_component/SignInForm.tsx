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

//import Icon
import { ChartGantt } from "lucide-react";
import { Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { ChevronRightIcon } from "lucide-react";

const formSchema = z.object({
    email: z.string().min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

const submitAction = async (preState: any, formData: FormData) => {
    const parsedData = formSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });
    if (!parsedData.success) {
        return {
            success: false,
            errors: parsedData.error.flatten().fieldErrors,
        };
    }
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const res = await fetch ("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
    const data = await res.json();

    if (!res.ok) {
        return {
            success: false,
            errors: data,
        };
    }

    redirect("/dashboard");
    return { success: true };
};

export default function SignInForm() {
    const [state, formAction, isPending] = useActionState(submitAction, {
        success: false,
    });

    return (
        <div className="w-full sm:w-[50%] lg:w-[30%] mt-5">
            <div className="shadow-2xl px-7 md:mx-auto bg-white rounded-t-2xl">
                <div className="flex justify-center items-center pt-8 gap-x-3 text-2xl font-bold">
                    <ChartGantt />
                    BA COPILOT
                </div>
                <h1 className="font-bold text-center pt-8">
                    Sign In to BA Copilot
                </h1>
                <p className="text-center text-gray-500 text-[0.9rem]">
                    Welcome back! Please sign in to continue
                </p>
                <div className="mt-7 gap-y-3 flex flex-col sm:flex-row w-full md:justify-between sm:gap-x-3">
                    <div className="w-full">
                        <Button
                            variant="outline"
                            className="w-full cursor-pointer"
                        >
                            <Github className="mr-1 h-4 w-4" />
                            GitHub
                        </Button>
                    </div>
                    <div className="w-full cursor-pointer">
                        <Button
                            variant="outline"
                            className="w-full cursor-pointer"
                        >
                            <FcGoogle className="mr-1 h-4 w-4" />
                            Google
                        </Button>
                    </div>
                </div>
                <div className="w-full border-gray-300 my-7 border-solid border-[0.5px] relative h-[1px]">
                    <p className="absolute left-[50%] bottom-[50%] transform -translate-x-1/2 translate-y-1/2 z-1 bg-background px-3">
                        or
                    </p>
                </div>
                <form action={formAction}>
                    <div className="mb-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {state.errors && (
                            <p className="text-red-500 text-sm">{state.errors.email}</p>
                        )}
                        <Label htmlFor="password" className="mt-2.5">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {state.errors && (
                            <p className="text-red-500 text-sm">{state.errors.password}</p>
                        )}
                    </div>

                    <div className="flex justify-end items-center mb-6">
                        <Link
                            href={"/forgot-password"}
                            className="text-sm text-blue-500 hover:underline"
                        >
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
            <div className="bg-[#f7f7f7] w-full flex justify-center items-center py-4 px-8 shadow-2xl md:mx-auto rounded-b-2xl">
                <p>
                    Don't have an account?
                    <Link
                        href={"/register"}
                        className="mx-2 hover:underline cursor-pointer"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
