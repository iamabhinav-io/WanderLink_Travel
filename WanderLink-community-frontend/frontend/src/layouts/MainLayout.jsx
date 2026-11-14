import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="bg-stone-900 text-stone-300 py-10 px-4 sm:px-6 lg:px-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">WanderLink</span>
            <span>• Every Journey Starts With a Connection</span>
          </div>
          <div className="text-stone-400">
            Person 3 (Community & Explore) • Goa, Manali, Kerala, Jaipur Hackathon Prototype
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
