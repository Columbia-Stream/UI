import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./SignUpPage";
import SignInPage from "./SignInPage";
import Dashboard from "./Dashboard";
import Splash from "./Splash";
import SearchPage from "./SearchPage";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* default → /signup */}
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/splash" element={<Splash />} />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}