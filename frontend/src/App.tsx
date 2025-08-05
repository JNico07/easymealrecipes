import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import Home from "./pages/Home";
import { getCurrentUser } from "./api";

const App = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUserId(data.user.id);
        setUserName(data.user.username);
        navigate("/");
      } catch (error) {
        console.error(error);
        setUserId(null);
        setUserName(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLoginSuccess = (newUserId: number, newUserName: string) => {
    setUserId(newUserId);
    setUserName(newUserName);
    navigate("/");
  };

  const handleSignupSuccess = (newUserId: number, newUserName: string) => {
    setUserId(newUserId);
    setUserName(newUserName);
    navigate("/");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={
          userId ? (
            <Home userId={userId} username={username} />
          ) : (
            <Navigate to="/login" />
          )
        }
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
