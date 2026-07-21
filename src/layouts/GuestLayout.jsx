import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';

/**
 * GuestLayout — Layout pour les pages publiques
 * Structure: Navbar → Content → Footer
 */
const GuestLayout = () => {
  return (
    <div className="guest-layout d-flex flex-column min-vh-100">
      <Navbar />
      <main className="guest-main flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default GuestLayout;
