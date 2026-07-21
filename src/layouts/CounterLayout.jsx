import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@components/layout/Navbar';
import Sidebar from '@components/layout/Sidebar';
import Footer from '@components/layout/Footer';
import { useNavigation } from '@hooks/useNavigation';

/**
 * CounterLayout — Layout pour l'espace guichet
 * Uses dynamic navigation filtered by role + permissions
 */
const CounterLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { menuItems } = useNavigation();

  return (
    <div className="btc-layout">
      <Sidebar
        items={menuItems}
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

export default CounterLayout;
