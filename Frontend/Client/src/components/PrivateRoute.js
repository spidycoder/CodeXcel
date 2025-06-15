import { useNavigate,Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.token) {
    return <Navigate to="/login"/>;
  }

  return children;
};

export default PrivateRoute;
