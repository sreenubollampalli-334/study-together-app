import { Navigate } from "react-router-dom";

// same validation logic
function isValidToken(token) {
  return token && token.length > 20;
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  return isValidToken(token)
    ? children
    : <Navigate to="/login" />;
}

export default ProtectedRoute;