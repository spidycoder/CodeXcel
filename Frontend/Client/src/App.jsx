import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Problems from "./pages/problems";
import ProblemPage from "./pages/problemPage";
import Contribute from "./pages/contribute";
import Admin from "./pages/admin";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import UserDetails from "./pages/UserDetails";
import LeaderBoard from "./pages/LeaderBoard";

function App() {
  // const user = JSON.parse(localStorage.getItem("user"));
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/problems"
          element={
            <PrivateRoute>
              <Problems />
            </PrivateRoute>
          }
        />
        <Route
          path="/problems/:problemName"
          element={
            <PrivateRoute>
              <ProblemPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/contribute"
          element={
            <PrivateRoute>
              <Contribute />
            </PrivateRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <PrivateRoute>
              <LeaderBoard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:userName"
          element={
            <PrivateRoute>
              <UserDetails />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
