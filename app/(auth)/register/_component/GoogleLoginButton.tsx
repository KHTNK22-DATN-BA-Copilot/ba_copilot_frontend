import { Button } from "@/components/ui/button";

interface GoogleLoginButtonProps {
    onClick: () => void;
    isLoading: boolean;
}

export default function GoogleLoginButton({ onClick, isLoading }: GoogleLoginButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`mt-8 mb-4 w-full py-1.5 px-3 rounded-lg border-1 font-medium text-black transition-colors ${
        isLoading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      }`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Login...
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <img src="/ic_google.svg" alt="Google icon" className="h-5 w-5" />
          Login with Google
        </div>
      )}
    </Button>
  );
}