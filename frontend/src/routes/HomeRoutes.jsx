// src/routes/HomeRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home/Home';  // หน้า Home ที่คุณสร้าง
import UserLogin from '../pages/users/Login';
import Register from '../pages/users/Register';
import Products from '../pages/home/Products';
import Contact from '../pages/home/Contact';
import CustomMirrorOrder from '../components/Custom';
import ProductDetail from '../pages/home/ProductDetail'; 



export default function HomeRoutes() {
  return (
     <>
       
      <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<Products />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/custom-order" element={<CustomMirrorOrder />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      {/* เส้นทางอื่น ๆ ที่เกี่ยวข้องกับ Home */}
     </Routes>
    </>
  
  );
}
