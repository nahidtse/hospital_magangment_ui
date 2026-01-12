// App.jsx
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../common/redux/Store';
import Header from './layoutcomponents/Header';
import Sidebar from './layoutcomponents/Sidebar';
import Footer from './layoutcomponents/Footer';
import Tabtotop from './layoutcomponents/Tabtotop';
import { loadMenu, isMenuLoaded } from '../common/Sidemenudata'; // Import menu functions

const App = () => {
  const [lateLoad, setlateLoad] = useState(false);
  const [menuLoading, setMenuLoading] = useState(true);

  useEffect(() => {
    setlateLoad(true);
    
    // Load menu when component mounts
    const initializeMenu = async () => {
      try {
        // Check if menu is already loaded
        if (!isMenuLoaded()) {
          await loadMenu();
        }
        setMenuLoading(false);
      } catch (error) {
        console.error('Menu initialization failed:', error);
        setMenuLoading(false); // Continue even if menu fails
      }
    };
    
    initializeMenu();
  }, []);

  return (
    <Fragment>
      <div style={{ display: `${lateLoad ? 'block' : 'none'}` }}>
        <Provider store={store}>
          <HelmetProvider>
            <Helmet
              htmlAttributes={{
                lang: "en",
                dir: "ltr",
                "data-nav-layout": "vertical",
                "data-theme-mode": "light",
                "data-header-styles": "light",
                "data-menu-styles": "light",
                "data-vertical-style": "overlay",
              }}
            >
              <body className=''></body>
            </Helmet>
          </HelmetProvider>

          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          
          {menuLoading ? (
            // Show loading state while menu is loading
            <div className="page">
              <Header />
              <div className="d-flex">
                {/* Loading sidebar skeleton */}
                <aside className="app-sidebar">
                  <div className="main-sidebar">
                    <div className="p-4">
                      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="h-10 bg-gray-100 rounded animate-pulse"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </aside>
                
                {/* Loading content */}
                <div className="main-content app-content w-100">
                  <div className="container-fluid mt-4">
                    <div className="row">
                      <div className="col-12">
                        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
                        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Footer />
            </div>
          ) : (
            // Show actual app when menu is loaded
            <div className="page">
              <Header />
              <Sidebar />
              <div className="main-content app-content">
                <div className="container-fluid mt-4">
                  <Outlet />
                </div>
              </div>
              <Footer />
            </div>
          )}
        </Provider>
      </div>
      <Tabtotop />
    </Fragment>
  )
}

export default App;