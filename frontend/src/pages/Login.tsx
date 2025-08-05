import { useState } from "react";
import { getCurrentUser, login } from "../api";

interface Props {
  onLoginSuccess: (userId: number, username: string) => void;
  onCreateAccountClick: () => void;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const Login = ({ onLoginSuccess, onCreateAccountClick }: Props) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password); // log in and sets cookie
      const { user } = await getCurrentUser(); // get user info
      onLoginSuccess(user.id, user.username); // Notify parent component of successful login
    } catch (error) {
      console.error("Login failed", error);
      setErrorMsg(getErrorMessage(error));
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center px-4"
      style={{ backgroundImage: 'url("/hero-image.jpg")' }}
    >
      <h1
        className="text-4xl md:text-5xl font-extrabold text-[#FF8C42] mb-8 text-center"
        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
      >
        🍽️ Welcome to <span className="text-yellow-300">EasyMealRecipes</span>
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login to your account
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
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
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="mb-4 text-sm text-red-600 bg-red-100 border border-red-300 rounded px-2 py-1 text-center"
          >
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>

      <div
        className="absolute bottom-8 text-[#FF8C42] text-lg text-center font-bold"
        style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)" }}
      >
        <p>
          Don’t have an account?{" "}
          <button
            onClick={onCreateAccountClick}
            className="underline text-yellow-300 hover:text-white font-bold"
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
