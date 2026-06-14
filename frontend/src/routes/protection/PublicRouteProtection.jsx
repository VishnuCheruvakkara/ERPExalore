import { Navigate } from "react-router-dom";

export default function PublicRouteProtection({ children }) {
  const token = localStorage.getItem(
    import.meta.env.VITE_AUTH_TOKEN_KEY
  );

  return token ? <Navigate to="/" replace /> : children;
}