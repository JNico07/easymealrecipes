import { useState } from "react";
import { login, signup } from "../api";

interface Props {
  onSignupSuccess: (userId: number, username: string) => void;
  onCancel: () => void;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

const Signup = ({ onSignupSuccess, onCancel }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { userId, username: returnUsername } = await signup(
        username,
        password
      );
      await login(username, password);
      onSignupSuccess(userId, returnUsername); // Notify parent component of successful login
    } catch (error) {
      console.error("Signup failed", error);
      setErrorMsg(getErrorMessage(error));
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-start min-h-screen bg-cover bg-center px-4 pt-12"
      style={{ backgroundImage: 'url("/hero-image.jpg")' }}
    >
      <h1
        className="text-4xl md:text-5xl font-extrabold text-[#FF8C42] mb-8 text-center"
        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
      >
        Welcome to <span className="text-yellow-300">EasyMealRecipes</span>
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-lg/md:text-2xl font-bold mb-6 text-center">
          Create account
        </h2>

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
          Signup
        </button>
      </form>

      <div className="absolute bottom-8 text-black text-3xl font-bold">
        <button
          type="button"
          onClick={onCancel}
          className="underline text-yellow-400 hover:text-white font-bold"
          style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)" }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Signup;
