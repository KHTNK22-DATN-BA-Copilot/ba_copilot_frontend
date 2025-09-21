'use client';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";

const handleEmailSubmit = (prev: any, form: FormData) => {
    const email = form.get("email");
    console.log("Email submitted:", email);
};
export default function EmailForm() {
    const [state, submitAction] = useActionState(handleEmailSubmit, null)

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">
                Quên mật khẩu
            </h2>
            <p className="text-gray-600 text-center mb-6">
                Nhập email của bạn để nhận mã xác thực
            </p>
            <form action={submitAction}>
                <div className="mb-4">
                    <Label className="block text-sm font-medium mb-2">
                        Email
                    </Label>
                    <Input
                        type="email"
                        name="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Gửi mã xác thực
                </Button>
            </form>
        </div>
    );
}
