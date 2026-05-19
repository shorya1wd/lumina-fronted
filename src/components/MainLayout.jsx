import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';    
import Sidebar from './Sidebar';   

const MainLayout = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen overflow-hidden text-white bg-[#0c0a09]">
      
      <NavBar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden relative">
        
        <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
        
        <main className={`flex-1 overflow-y-auto w-full transition-all duration-300 ${
            isSidebarOpen ? "md:ml-64" : "ml-0"
        }`}>
          <Outlet />
        </main>

      </div>
      
    </div>
  );
};

export default MainLayout;