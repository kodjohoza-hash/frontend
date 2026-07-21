import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@components/layout/Navbar';
import Sidebar from '@components/layout/Sidebar';
import Footer from '@components/layout/Footer';
import { counterMenu } from '@components/layout/menuItems';

/**
 * CounterLayout — Layout pour l'espace guichet
 * Structure: Sidebar → (Navbar + Content + Footer)
 */
const CounterLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="btc-layout">
      <Sidebar
        items={counterMenu}
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
