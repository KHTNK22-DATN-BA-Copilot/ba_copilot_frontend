'use client';
import { useState, useRef } from 'react';

interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    status: 'uploading' | 'completed' | 'error';
}

export default function FileUpload() {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (files: FileList) => {
        const validFiles = Array.from(files).filter(file => {
            const validTypes = ['.pdf', '.doc', '.docx', '.txt'];
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            return validTypes.includes(fileExtension) && file.size <= 10 * 1024 * 1024; // 10MB
        });

        validFiles.forEach(file => {
            const newFile: UploadedFile = {
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                size: file.size,
                type: file.type,
                status: 'uploading'
            };

            setUploadedFiles(prev => [...prev, newFile]);

            // Mock upload with timeout
            setTimeout(() => {
                setUploadedFiles(prev => 
                    prev.map(f => f.id === newFile.id ? { ...f, status: 'completed' } : f)
                );
            }, 2000);
        });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFiles(files);
        }
    };

    const removeFile = (id: string) => {
        setUploadedFiles(prev => prev.filter(f => f.id !== id));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <>
            <h1>Upload Project Documents</h1>
            <h1 className="text-sm text-gray-500">
                Upload any documents related to your project for AI analysis
            </h1>
            <div 
                className={`border-2 mt-5 cursor-pointer border-dashed rounded-lg p-12 text-center transition-colors duration-200 ${
                    isDragOver 
                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-gray-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 text-gray-400 dark:text-gray-500">
                        <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            className="w-full h-full"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            PDF, DOC, DOCX, TXT (max 10MB)
                        </p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                        multiple
                        onChange={handleFileInputChange}
                    />
                </div>
            </div>

            {uploadedFiles.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Uploaded Files</h3>
                    <div className="space-y-3">
                        {uploadedFiles.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 text-gray-500">
                                        <svg fill="currentColor" viewBox="0 0 20 20" className="w-full h-full">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {file.status === 'uploading' && (
                                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                    {file.status === 'completed' && (
                                        <div className="w-4 h-4 text-green-500">
                                            <svg fill="currentColor" viewBox="0 0 20 20" className="w-full h-full">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(file.id);
                                        }}
                                        className="w-4 h-4 text-red-500 hover:text-red-700"
                                    >
                                        <svg fill="currentColor" viewBox="0 0 20 20" className="w-full h-full">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
