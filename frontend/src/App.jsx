import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomeRoutes from "./routes/HomeRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import UsersRoutes from "./routes/UsersRoutes";
import ChatWidget from "./components/ChatWidget";
import "./App.css";

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <>
      {!isAdmin && <ChatWidget />}
      <Routes>
        {/* Redirect root to /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        {/* Home routes */}
        <Route path="/*" element={<HomeRoutes />} />
        {/* Users routes */}
        <Route path="/users/*" element={<UsersRoutes />} />
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </>
  );
}

export default App;
