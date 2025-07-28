// src/routes/UsersRoutes.jsx
import { Routes, Route } from 'react-router-dom';

import Profile from '../pages/users/Profile';
import Favorite from '../pages/users/Favorite';
import Orders from '../pages/users/Orders';
import Checkout from '../pages/users/Checkout';
import Payments from '../pages/users/Payments';
import Notifications from '../pages/users/Notifications';
import MainLayout from '../components/MainLayoutProflie';


export default function UsersRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
      <Route path="profile" element={<Profile />} />
      <Route path="favorite" element={<Favorite />} />
      <Route path="orders" element={<Orders />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="payments" element={<Payments />} />
      <Route path="notifications" element={<Notifications />} />
      </Route>
      
    </Routes>
  );
}
