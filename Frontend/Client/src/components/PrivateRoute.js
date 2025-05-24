import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.token) {
    return window.location="/login"
  }

  return children;
};

export default PrivateRoute;
