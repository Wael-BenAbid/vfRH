import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNavigation from './MobileNavigation';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for desktop and tablet */}
      <Sidebar open={sidebarOpen} user={user} />
      
      {/* Main Content Area */}
      <div className={`content flex-1 ${sidebarOpen ? 'ml-[250px]' : 'ml-0 md:ml-[250px]'} transition-all duration-300`}>
        {/* Top Navigation */}
        <Topbar title={title} toggleSidebar={toggleSidebar} />
        
        {/* Page Content */}
        <main className="p-6 overflow-y-auto h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default MainLayout;
