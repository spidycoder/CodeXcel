import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  if (!user || !user.token) {
    return navigate("/login");
  }

  return children;
};

export default PrivateRoute;
