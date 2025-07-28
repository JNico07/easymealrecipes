import { useState } from "react";
import { signup } from "../api";

interface Props {
  onSignupSuccess: (userId: number) => void;
  onCancel: () => void;
}

const Signup = ({ onSignupSuccess, onCancel }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { userId } = await signup(username, password);
      onSignupSuccess(userId); // Notify parent component of successful login
    } catch (err) {
      console.error("Signup failed", err);
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
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

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

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Signup
        </button>
      </form>

      <div className="absolute bottom-8 text-black text-sm">
        <button
          type="button"
          onClick={onCancel}
          className="underline text-blue-800 hover:text-black font-bold"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Signup;
