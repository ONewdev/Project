import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/MainLayoutAdmin";
import Dashboard from "../pages/admin/Dashboard";
import Admin from "../pages/admin/Admin";
import Customers from "../pages/admin/Customers";
import Products from "../pages/admin/Products";
import Category from "../pages/admin/Category";
import Orders from "../pages/admin/Orders";
import ChatAdmin from "../pages/admin/ChatAdmin"; // New ChatAdmin page
import Contact from "../pages/admin/Contact";
import Stock from "../pages/admin/Stock";
import Finance from "../pages/admin/Finance"; // New Finance page
import Sales from "../pages/admin/Sales";
import Quotation from "../pages/admin/Quotation";
import Report from "../pages/admin/Report";
import Withdraw from "../pages/admin/Withdraw";
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
          <Route path="admins" element={<Admin />} />
          <Route path="customers" element={<Customers />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Category />} />
          <Route path="orders" element={<Orders />} />
          <Route path="chat" element={<ChatAdmin />} /> 
          <Route path="contact" element={<Contact />} />
          <Route path="stock" element={<Stock />} />
          <Route path="finance" element={<Finance />} /> 
          <Route path="sales" element={<Sales />} />
          <Route path="quotation" element={<Quotation />} />
          <Route path="report" element={<Report />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="setting" element={<Setting />} />
        </Route>
      </Route>
    </Routes>
  );
}
