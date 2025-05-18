import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Problems from "./pages/problems";
import Contribute from "./pages/contribute";
import Admin from "./pages/admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
const Home = () => <div className="p-4 text-xl">Home Page</div>;

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/contribute" element={<Contribute />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
