import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Lesson from "./pages/Lesson";
import Modules from "./pages/Modules";
import Lessons from "./pages/Lessons";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lesson/:id" element={<Lesson />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/module/:id" element={<Lessons />} />
      </Routes>
    </>
  );
}

export default App;
//React fragment is a wrapper that lets you run multiple elements from a component without adding extra DOM element to it
