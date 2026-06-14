import { Navigate } from "react-router-dom";

export default function UserRouteProtection({ children }) {
  const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);

  return token ? children : <Navigate to="/login" replace />;
}