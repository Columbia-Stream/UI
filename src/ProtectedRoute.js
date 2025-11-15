import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("authToken");
  if (!token) return <Navigate to="/login" replace />;

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const role = localStorage.getItem("userRole");
    if (!role || !allowedRoles.includes(role)) {
      const fallback = localStorage.getItem("dashboardRoute") || "/dashboard";
      return <Navigate to={fallback} replace />;
    }
  }

  return children;
}
