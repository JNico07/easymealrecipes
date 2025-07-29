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
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url("/hero-image.jpg")' }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
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

      <div className="absolute bottom-8 text-black text-sm">
        <p>
          Don't have an account?{" "}
          <button
            onClick={onCreateAccountClick}
            className="underline text-blue-900 hover:text-black font-bold"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
