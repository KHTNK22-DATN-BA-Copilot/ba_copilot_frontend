interface PasswordMatchIndicatorProps {
  password: string;
  confirmPassword: string;
}

export default function PasswordMatchIndicator({ password, confirmPassword }: PasswordMatchIndicatorProps) {
  if (!confirmPassword) return null;

  const match = password === confirmPassword;

  return (
    <div className="mt-2">
      <div className={`flex items-center text-xs ${match ? "text-green-600" : "text-red-500"}`}>
        <span className="mr-1">{match ? "✓" : "✗"}</span>
        {match ? "Passwords match" : "Passwords do not match"}
      </div>
    </div>
  );
}