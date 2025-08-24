import { useState } from "react";
import { getCurrentUser, login } from "../api";

interface Props {
  onLoginSuccess: (userId: number, username: string) => void;
  onCreateAccountClick: () => void;
  onGuestAccess: () => void;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const Login = ({
  onLoginSuccess,
  onCreateAccountClick,
  onGuestAccess,
}: Props) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(username, password); // log in and sets cookie
      const { user } = await getCurrentUser(); // get user info
      onLoginSuccess(user.id, user.username); // Notify parent component of successful login
    } catch (error) {
      console.error("Login failed", error);
      setErrorMsg(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    onGuestAccess();
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center px-4"
      style={{ backgroundImage: 'url("/hero-image.jpg")' }}
    >
      <h1
        className="text-4xl md:text-5xl font-extrabold text-[#FF8C42] mb-6 text-center"
        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
      >
        Welcome to <span className="text-yellow-300">EasyMealRecipes</span>
      </h1>

      <div className="bg-white bg-opacity-95 p-8 rounded-xl shadow-lg w-full max-w-sm backdrop-blur-sm">
        <h2 className="text-lg/md:text-2xl font-bold mb-6 text-center text-gray-800">
          Get Started
        </h2>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              disabled={isLoading}
            />
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-center"
            >
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium mb-3"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500 font-medium">or</span>
          </div>
        </div>

        {/* Guest Access Button */}
        <button
          onClick={handleGuestAccess}
          className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium border border-gray-300 mb-4"
        >
          Continue as Guest
        </button>

        <p className="text-center text-sm text-gray-600">
          Guest mode offers limited features.{" "}
          <span className="font-medium">Sign in for full access!</span>
        </p>
      </div>

      <div
        className="mt-6 text-[#FF8C42] text-lg text-center font-bold"
        style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)" }}
      >
        <p className="text-lg/md:text-xl md:text-3xl">
          Don't have an account?{" "}
          <button
            onClick={onCreateAccountClick}
            className="underline text-yellow-300 hover:text-white font-bold transition-colors"
            style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)" }}
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
