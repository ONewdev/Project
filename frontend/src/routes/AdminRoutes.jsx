import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/MainLayoutAdmin";
import Dashboard from "../pages/admin/Dashboard";
import Admin from "../pages/admin/Admin";
import Customers from "../pages/admin/Customers";
import Products from "../pages/admin/Products";
import Category from "../pages/admin/Category";
import Orders from "../pages/admin/Orders";
import PaymentCheck from "../pages/admin/PaymentCheck"; // New PaymentCheck page
import ChatAdmin from "../pages/admin/ChatAdmin"; // New ChatAdmin page
import Contact from "../pages/admin/Contact";
import Material from "../pages/admin/Material";
import Finance from "../pages/admin/Finance"; 
import Quotation from "../pages/admin/Quotation";
import Report from "../pages/admin/Report";
import ReportOrder from "../pages/admin/ReportOrder";
import ReportSales from "../pages/admin/ReportSales";
import ReportMaterial from "../pages/admin/ReportMaterial"; 
import ReportProfit from "../pages/admin/ReportProfit";
import Withdraw from "../pages/admin/Withdraw";
import Inbox from "../pages/admin/Inbox";
import Custom_Orders from "../pages/admin/Custom_Orders"; 

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
          <Route path="payment-check" element={<PaymentCheck />} /> 
          <Route path="chat" element={<ChatAdmin />} /> 
          <Route path="inbox" element={<Inbox />} />
          <Route path="contact" element={<Contact />} />
          <Route path="material" element={<Material/>} />
          <Route path="finance" element={<Finance />} /> 
          <Route path="custom-orders" element={<Custom_Orders />} />
          <Route path="quotation" element={<Quotation />} />
          <Route path="report" element={<Report />} />
          <Route path="report/order" element={<ReportOrder />} />
          <Route path="report/sales" element={<ReportSales />} />
          <Route path="report/material" element={<ReportMaterial />} />
          <Route path="report/profit" element={<ReportProfit />} />
          <Route path="withdraw" element={<Withdraw />} />
          
        </Route>
      </Route>
    </Routes>
  );
}
