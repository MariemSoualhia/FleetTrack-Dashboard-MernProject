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
import TripsPage from "./pages/TripsPage";
import KpisPage from "./pages/KpisPage";
import AlertsPage from "./pages/AlertsPage";
import AlertsAnalyticsPage from "./pages/AlertsAnalyticsPage";
import ReportsPage from "./pages/ReportsPage";
import ReportsHistoryPage from "./pages/ReportsHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import ApproveUsersPage from "./pages/ApproveUsersPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import TripMapPage from "./pages/TripMapPage";
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
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected routes */}
        {token && (
          <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="drivers" element={<DriversPage />} />
            <Route path="Trucks" element={<TrucksPage />} />
            <Route path="trips" element={<TripsPage />} />
            <Route path="kpis" element={<KpisPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="alerts-analytics" element={<AlertsAnalyticsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="/reports-history" element={<ReportsHistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin/users" element={<ApproveUsersPage />} />
            <Route path="/trip-map" element={<TripMapPage />} />

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
