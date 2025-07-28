import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import Home from "./pages/Home";

const App = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLoginSuccess = (newUserId: number, newUserName: string) => {
    setUserId(newUserId);
    setUserName(newUserName);
    navigate("/");
  };

  const handleSignupSuccess = (newUserId: number) => {
    setUserId(newUserId);
    navigate("/");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={userId ? <Home userId={userId} username={username} /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onCreateAccountClick={() => navigate("/signup")}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <SignupPage
            onSignupSuccess={handleSignupSuccess}
            onCancel={() => navigate("/login")}
          />
        }
      />
    </Routes>
  );
};

export default App;
