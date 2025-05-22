// App.tsx
import {  Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import AdminDashboard from './pages/AdminDashboard';
import Amenities from './components/Amenities';
import About from './pages/About';
import Layout from './components/Layout';
import ContactPage from './pages/contactus';
import BookingForm from './components/BookingForm';
import { Room } from './types';
import AuthPage from './pages/AuthPage';
import UpdatePasswordForm from './auth/UpdatePasswordForm';
import { AdminRoute } from './components/AdminRoute';
 


const dummyRoom: Room = {
  id: 1,
  name: 'Deluxe Suite',
  price: 150,
  description: 'Spacious room with a sea view and a king-size bed.',
  images: ["image1.jpg", "image2.jpg"],
  type: 'standard',
  capacity: 0,
  amenities: [],
  available: false
};

const handleCancelBooking = () => {
  window.location.href = '/rooms'; // You can also use navigate here if needed
};

function App() {
  return (
    <AppProvider>
        <Layout>
          <Routes>
            
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            {/* <Route path="/admin" element={<AdminDashboard />} /> */}
            <Route path="/amenities" element={<Amenities />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/booking" element={<BookingForm room={dummyRoom} onCancel={handleCancelBooking} />} />
             <Route path="/auth" element={<AuthPage />} />
             <Route path="/update-password" element={<UpdatePasswordForm />} />
            {/* Optional: add a catch-all route for 404 */}
            <Route path="*" element={<Home />} />
            <Route
    path="/admin"
    element={
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    }
  />
          </Routes>
        </Layout>
    </AppProvider>
  );
}

export default App;
