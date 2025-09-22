interface Props {
  message: string;
}

export default function VerifyMessage({ message }: Props) {
  if (!message) return null;

  const success = message.includes("successfully") || message.includes("Redirecting");

  return (
    <div
      className={`p-3 rounded-lg ${
        success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {message}
    </div>
  );
}
