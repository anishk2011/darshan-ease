import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import './App.css';
import AppNavbar from "./components/AppNavbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TemplesPage from "./pages/TemplesPage";
import TempleDetailsPage from "./pages/TempleDetailsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import DonatePage from "./pages/DonatePage";
import AdminPage from "./pages/AdminPage";
import { getRole, getToken } from "./utils/auth";

function ProtectedRoute({ children }) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const role = getRole();
  if (!["ADMIN", "ORGANIZER"].includes(role || "")) {
    return <Navigate to="/temples" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Navigate to="/temples" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/temples" element={<TemplesPage />} />
          <Route path="/temples/:id" element={<TempleDetailsPage />} />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donate"
            element={
              <ProtectedRoute>
                <DonatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/temples" replace />} />
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={2500} />
    </BrowserRouter>
  );
}
