import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
  allowedRoles: string[];
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
