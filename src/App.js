import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./SignUpPage";
import SignInPage from "./SignInPage";
import Dashboard from "./Dashboard";
import DashboardStudent from "./DashboardStudent";
import DashboardFaculty from "./DashboardFaculty";
import Splash from "./Splash";
import SearchPage from "./SearchPage";
import ProtectedRoute from "./ProtectedRoute";

// Keep these in sync with ROLE_ROUTES returned by the API.
const DASHBOARD_ROUTES = [
  { path: "/dashboard", Component: Dashboard },
  {
    path: "/dashboard/student",
    Component: DashboardStudent,
    allowedRoles: ["student"],
  },
  {
    path: "/dashboard/faculty",
    Component: DashboardFaculty,
    allowedRoles: ["faculty"],
  },
];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* default → /signup */}
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<SignInPage />} />
        {DASHBOARD_ROUTES.map(({ path, Component, allowedRoles }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute allowedRoles={allowedRoles}>
                <Component />
              </ProtectedRoute>
            }
          />
        ))}
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
