import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function NewPassword() {
    const [formData, setFormData] = useState({
        email: "",
        verificationCode: "",
        newPassword: "",
        confirmPassword: "",
    });

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">
                Đặt mật khẩu mới
            </h2>
            <form>
                <div className="mb-4">
                    <Label className="block text-sm font-medium mb-2">
                        Mật khẩu mới
                    </Label>
                    <Input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        minLength={8}
                    />
                </div>
                <div className="mb-6">
                    <Label className="block text-sm font-medium mb-2">
                        Xác nhận mật khẩu
                    </Label>
                    <Input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mb-4"
                    disabled={formData.newPassword !== formData.confirmPassword}
                >
                    Đặt lại mật khẩu
                </Button>
                <Button
                    type="button"
                    className="w-full text-blue-600 py-2 px-4 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                    Quay lại
                </Button>
            </form>
        </div>
    );
}
