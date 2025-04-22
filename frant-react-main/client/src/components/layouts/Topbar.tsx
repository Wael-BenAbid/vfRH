import React from 'react';
import { Bell, Settings, Menu } from 'lucide-react';

interface TopbarProps {
  title: string;
  toggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ title, toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex justify-between items-center h-16 px-4">
        {/* Mobile Menu Toggle */}
        <button onClick={toggleSidebar} className="md:hidden block p-1" title="Toggle Sidebar">
          <Menu className="w-6 h-6 text-gray-500" />
        </button>
        
        {/* Page Title */}
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        
        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button title="Notifications" className="relative p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
          </button>
          
          {/* Settings */}
          <button title="Settings" className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <Settings className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
