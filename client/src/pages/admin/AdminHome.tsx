/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState,useEffect } from 'react';
import Header from '../../components/instructor/Header/index';
import Sidebar from '../../components/instructor/Sidebar/index';
import Dashboard from '../instructor/Dashboard';



const AdminHome: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  

  useEffect(() => {
    // Push a new entry to the history stack to disable going back
    window.history.pushState(null, '', window.location.href);

    
    const handlePopState = () => {
      // Prevent the default action (going back)
      window.history.pushState(null, '', window.location.href);
    };

    // Listen for popstate event (triggered by back button)
    window.addEventListener('popstate', handlePopState);

    return () => {
      // Cleanup event listener when the component unmounts
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Dashboard/>
                          </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default AdminHome;
