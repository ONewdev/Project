
import SidebarProflie from './SidebarProflie';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="d-flex flex-column">
      {/* Navbar */}
      <Navbar />
      
      <div className="d-flex">
        <div className="bg-light" style={{ width: '250px', height: 'calc(100vh - 64px)' }}>
          <SidebarProflie />
        </div>

        <div className="flex-grow-1 p-4" style={{ paddingLeft: '280px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
 