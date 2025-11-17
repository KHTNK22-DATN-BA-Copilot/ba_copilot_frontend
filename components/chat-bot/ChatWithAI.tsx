import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatWithAIProps {
    onContentUpdate?: (newContent: string) => void;
    projectId?: string;
    documentId?: string;
}

const generateMockMarkdown = (userPrompt: string): string => {
    const mockResponses = [
        `# Software Requirements Specification\n\n## 1. Introduction\n\n### 1.1 Purpose\nThis document describes the software requirements for the E-Commerce Platform. The system aims to provide a comprehensive online shopping experience with enhanced user features based on your request: "${userPrompt}"\n\n### 1.2 Scope\nThe platform will support:\n- User authentication and authorization\n- Product catalog management\n- Shopping cart functionality\n- Order processing and tracking\n- Payment integration\n\n## 2. Functional Requirements\n\n### 2.1 User Management\n- **FR-001**: Users shall be able to register with email and password\n- **FR-002**: Users shall be able to login using OAuth providers (Google, Facebook)\n- **FR-003**: Users shall be able to reset their password via email\n\n### 2.2 Product Management\n- **FR-004**: System shall display products with images, descriptions, and prices\n- **FR-005**: Users shall be able to search and filter products\n- **FR-006**: Users shall be able to view detailed product information\n\n## 3. Non-Functional Requirements\n\n### 3.1 Performance\n- Page load time shall not exceed 3 seconds\n- System shall support 10,000 concurrent users\n\n### 3.2 Security\n- All passwords shall be encrypted using bcrypt\n- API endpoints shall be protected with JWT authentication\n- Payment information shall be processed via PCI-DSS compliant gateway`,

        `# Updated Requirements Document\n\n## Overview\nBased on your input: "${userPrompt}", I've updated the document with the following sections:\n\n## Key Features\n\n### Feature 1: Enhanced Search\n\n**Description**: Advanced search functionality with multiple filters\n\n**Requirements**:\n1. Full-text search across product titles and descriptions\n2. Filter by category, price range, and ratings\n3. Auto-complete suggestions\n4. Search history for logged-in users\n\n### Feature 2: User Reviews\n\n**Description**: Allow customers to review and rate products\n\n**Requirements**:\n1. Users can submit ratings (1-5 stars)\n2. Users can write text reviews\n3. Reviews display with user name and date\n4. Admin moderation for inappropriate content\n\n## Technical Specifications\n\n### Database Schema\n\n\`\`\`sql\nCREATE TABLE products (\n  id INT PRIMARY KEY,\n  name VARCHAR(255),\n  description TEXT,\n  price DECIMAL(10,2),\n  category_id INT\n);\n\nCREATE TABLE reviews (\n  id INT PRIMARY KEY,\n  product_id INT,\n  user_id INT,\n  rating INT,\n  comment TEXT,\n  created_at TIMESTAMP\n);\n\`\`\`\n\n### API Endpoints\n\n| Method | Endpoint | Description |\n|--------|----------|-------------|\n| GET | /api/products | List all products |\n| GET | /api/products/:id | Get product details |\n| POST | /api/reviews | Submit a review |\n| GET | /api/reviews/:productId | Get product reviews |`,

        `# Security Requirements Specification\n\n## 1. Security Overview\n\nThis section addresses: "${userPrompt}"\n\n## 2. Authentication & Authorization\n\n### 2.1 Authentication Requirements\n\n- **SEC-001**: Multi-factor authentication (MFA) for admin accounts\n- **SEC-002**: Password complexity requirements:\n  - Minimum 8 characters\n  - At least one uppercase letter\n  - At least one lowercase letter\n  - At least one number\n  - At least one special character\n- **SEC-003**: Session timeout after 30 minutes of inactivity\n- **SEC-004**: Account lockout after 5 failed login attempts\n\n### 2.2 Authorization Requirements\n\n- **SEC-005**: Role-based access control (RBAC)\n- **SEC-006**: Principle of least privilege\n- **SEC-007**: Audit logging for all privileged operations\n\n## 3. Data Protection\n\n### 3.1 Encryption\n\n- **SEC-008**: TLS 1.3 for all data in transit\n- **SEC-009**: AES-256 encryption for sensitive data at rest\n- **SEC-010**: Encrypted database backups\n\n### 3.2 Privacy\n\n- **SEC-011**: GDPR compliance for EU users\n- **SEC-012**: Data retention policy (7 years)\n- **SEC-013**: Right to erasure implementation\n\n## 4. Security Testing\n\n- Penetration testing quarterly\n- Automated vulnerability scanning\n- Code security reviews\n\n## 5. Incident Response\n\n1. Detection and analysis\n2. Containment\n3. Eradication\n4. Recovery\n5. Post-incident review`
    ];

    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
};

export function ChatWithAI({ onContentUpdate, projectId, documentId }: ChatWithAIProps) {
    const [chatMessages, setChatMessages] = useState<
        { id: number; message: string; isUser: boolean }[]
    >([]);
    const [content, setContent] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSend = async () => {
        if (!content.trim() || isProcessing) return;

        const userMessage = {
            id: Date.now(),
            message: content,
            isUser: true,
        };
        setChatMessages((prev) => [...prev, userMessage]);
        const userPrompt = content;
        setContent("");
        setIsProcessing(true);

        try {
            // Prepare FormData with project_id, document_id and description
            const formData = new FormData();
            if (projectId) formData.append("project_id", projectId);
            if (documentId) formData.append("document_id", documentId);
            formData.append("description", userPrompt);

            // Call API to regenerate document
            const res = await fetch(`/api/srs-generate/doc`, {
                method: "PATCH",
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`API error: ${res.status}`);
            }

            const data = await res.json();

            // Show AI response message
            const aiResponseText = "I've updated the document based on your request. The preview should now show the new content.";
            setChatMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    message: aiResponseText,
                    isUser: false,
                },
            ]);

            // Update the document content via callback with the 'document' field from response
            if (onContentUpdate && data.document) {
                onContentUpdate(data.document);
            }

            setIsProcessing(false);
            console.log("Document regenerated:", data);
        } catch (error) {
            console.error("Error regenerating document:", error);

            // Show error message in chat
            setChatMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    message: "Sorry, there was an error processing your request. Please try again.",
                    isUser: false,
                },
            ]);

            setIsProcessing(false);
        }
    };

    return (
        <div className="h-[calc(100vh-250px)] flex flex-col border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 ">
            {/* Chat messages area */}
            <div className="flex-1 overflow-y-auto p-1 space-y-3 scrollbar-thin 
                                scrollbar-thumb-blue-500 
                                scrollbar-track-transparent 
                                scrollbar-thumb-rounded-full ">
                {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 text-xs px-2">
                        Ask me anything about your diagram!
                        <br />
                        Example: "Add a new section about security requirements"
                    </div>
                ) : (
                    chatMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] p-2 rounded-lg text-xs break-words whitespace-pre-line ${msg.isUser
                                    ? "bg-blue-600 text-white rounded-lg rounded-br-none"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg rounded-bl-none"
                                    }`}
                            >
                                {msg.message}
                            </div>
                        </div>
                    ))
                )}
                {isProcessing && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-xs">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                                <span>Processing...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input + Send button */}
            <div className="mt-4 flex items-end gap-2">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 w-full text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] max-h-[120px]"
                    placeholder="Enter your prompt here..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />

                <Button
                    onClick={handleSend}
                    className="p-3 rounded-full shadow-md flex items-center justify-center h-10"
                    disabled={!content.trim() || isProcessing}
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}