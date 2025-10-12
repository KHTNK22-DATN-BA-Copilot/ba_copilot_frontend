import { Button } from "@/components/ui/button";
import { FcDocument } from "react-icons/fc";

export default function Template() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mx-auto">
            <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                    <FcDocument className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Web Application</h3>
                <p className="mb-4">Standard template for web application projects</p>
                <Button className="w-full border border-gray-300 rounded-lg py-2 px-4 cursor-pointer">
                    Use Template
                </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                    <FcDocument className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Web Application</h3>
                <p className="mb-4">Standard template for web application projects</p>
                <Button className="w-full border border-gray-300 rounded-lg py-2 px-4 cursor-pointer">
                    Use Template
                </Button>
            </div>

            
        </div>
    )
}