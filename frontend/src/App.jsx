import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomeRoutes from "./routes/HomeRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import UsersRoutes from "./routes/UsersRoutes";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
