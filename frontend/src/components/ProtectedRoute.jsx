import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Wraps any page that should require login. If there's no user in
// context, redirect to /login instead of rendering the page's children.
// `replace` swaps the history entry so the back button doesn't bounce
// the user right back into the protected page.
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
