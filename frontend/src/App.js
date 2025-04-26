import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import DriversPage from "./pages/DriversPage";
import DashboardLayout from "./components/DashboardLayout";
import TrucksPage from "./pages/TrucksPage";
function App() {
  const { user, loading } = useAuth();

  const token = localStorage.getItem("token"); // très important

  if (loading) return <div>Loading...</div>; // afficher un petit loading au début

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        {token && (
          <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="drivers" element={<DriversPage />} />
            <Route path="Trucks" element={<TrucksPage />} />
            {/* autres routes */}
          </Route>
        )}

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={token ? "/dashboard" : "/"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
