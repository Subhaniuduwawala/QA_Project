import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Admin Pages
import EventsDashboard from "./pages/Admin/EventsDashboard"
import "./index.css";
import "./App.css";
import HomePage from "./pages/HomePage";

// //admin pages
import AdminSignup from "./pages/Admin/Adminsignup";
import AdminLogin from "./pages/Admin/AdminLogin";


function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<HomePage />} />
        {/* Admin Routes */}
         <Route path="/admin/events" element={<EventsDashboard />} />
       {/* <Route path="/admin/event/:eventId" element={<EventOverview />} /> */}
      
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />

  
      
     
     
      </Routes>
    </Router>
  );
}

export default App;
