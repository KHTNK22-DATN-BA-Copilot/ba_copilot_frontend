import { Metadata } from "next";

export const metadata: Metadata = {
    title: "SRS Generator - BA Copilot",
}

export default function SRSGeneratorPage() {

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Content */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <div className="max-w-md mx-auto">
                        <div className="text-6xl mb-6">📋</div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            📋 SRS Generator
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Generate comprehensive Software Requirements Specification (SRS) documents automatically based on your project requirements and business rules.
                        </p>
                        <div className="space-y-3 text-left">
                            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>AI-powered SRS generation</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Template-based structure</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Export to multiple formats</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}