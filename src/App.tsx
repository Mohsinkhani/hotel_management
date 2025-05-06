import React from 'react';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  // Simple routing based on URL path
  const path = window.location.pathname;

  return (
    <AppProvider>
      {path === '/' && <Home />}
      {path === '/rooms' && <Rooms />}
      {path === '/admin' && <AdminDashboard />}
      {!['/rooms', '/admin', '/'].includes(path) && <Home />} {/* Default to home for unknown routes */}
    </AppProvider>
  );
}

export default App;