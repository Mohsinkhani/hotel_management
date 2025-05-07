import React from 'react';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import AdminDashboard from './pages/AdminDashboard';
import Amenities from './components/Amenities';
import About from './pages/About';
import Layout from './components/Layout';
import ContactPage from './pages/contactus';

function App() {
  const path = window.location.pathname;

  const getPage = () => {
    switch (path) {
      case '/':
        return <Home />;
      case '/rooms':
        return <Rooms />;
      case '/admin':
        return <AdminDashboard />;
      case '/amenities':
        return <Amenities />;
      case '/about':
        return <About />;
        case '/contact':
        return <ContactPage/>; // Assuming you have a Contact component
      default:
        return <Home />;
    }
  };

  return (
    <AppProvider>
      <Layout>
        {getPage()}
      </Layout>
    </AppProvider>
  );
}

export default App;
