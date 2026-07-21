import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@components/layout/Navbar';
import Sidebar from '@components/layout/Sidebar';
import Footer from '@components/layout/Footer';
import { superAdminMenu } from '@components/layout/menuItems';

/**
 * SuperAdminLayout — Layout pour l'administration
 * Structure: Sidebar → (Navbar + Content + Footer)
 */
const SuperAdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="btc-layout">
      <Sidebar
        items={superAdminMenu}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="btc-layout-main">
        <Navbar />
        <main className="btc-layout-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default SuperAdminLayout;
