// src/routes/UsersRoutes.jsx
import { Routes, Route } from 'react-router-dom';

import Profile from '../pages/users/Profile';

export default function UsersRoutes() {
  return (
    <Routes>
      <Route path="profile" element={<Profile />} />
    </Routes>
  );
}
