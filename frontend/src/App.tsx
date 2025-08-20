import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom"; // ✅ Add useLocation
import { useEffect, useState } from "react";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { getCurrentUser } from "./api";
import Footer from "./components/Footer";

const App = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get current route

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-orange-400 border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              userId ? (
                <Dashboard userId={userId} username={username} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/home"
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
      </div>

      {/* Show Footer only on non-auth pages */}
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <Footer />
      )}
    </div>
  );
};

export default App;