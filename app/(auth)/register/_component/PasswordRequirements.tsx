interface PasswordRequirementsProps {
    requirements: {
        length: boolean;
        uppercase: boolean;
        lowercase: boolean;
        number: boolean;
        special: boolean;
    };
    password: string;
}

export default function PasswordRequirements({ requirements, password }: PasswordRequirementsProps) {
    if (!password) return null;
    
    const items = [
        { label: "At least 8 characters", valid: requirements.length },
        { label: "One uppercase letter (A-Z)", valid: requirements.uppercase },
        { label: "One lowercase letter (a-z)", valid: requirements.lowercase },
        { label: "One number (0-9)", valid: requirements.number },
        { label: "One special character (!@#$%^&*)", valid: requirements.special },
    ];

    return (
        <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-600 mb-1">Password must contain:</p>
            <div className="grid grid-cols-1 gap-1 text-xs">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className={`flex items-center ${item.valid ? "text-green-600" : "text-red-500"}`}
                    >
                        <span className="mr-1">{item.valid ? "✓" : "✗"}</span>
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    )
}