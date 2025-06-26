import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import Dashboard from "../pages/admin/Dashboard";
import Customers from "../pages/admin/Customers";
import Orders from "../pages/admin/Orders";
import Products from "../pages/admin/Products";
import Contact from "../pages/admin/Contact";
import Setting from "../pages/admin/Setting";
import Login from "../pages/admin/Login";
import PrivateRoute from "../utils/PrivateRoute";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />

      {/* ต้อง login ก่อนถึงเข้าได้ */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="contact" element={<Contact />} />
          <Route path="setting" element={<Setting />} />
        </Route>
      </Route>
    </Routes>
  );
}
