import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import { Check, X, Clock, LogOut, User, Pencil } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { reservations, rooms, guests, getGuestById, getRoomById, updateReservation } = useApp();
  const [activeTab, setActiveTab] = useState<'reservations' | 'rooms' | 'guests'>('reservations');

  const handleStatusChange = (reservationId: string, newStatus: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled') => {
    updateReservation(reservationId, { status: newStatus });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center">
            <Check size={12} className="mr-1" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
      case 'checked-in':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center">
            <User size={12} className="mr-1" />
            Checked In
          </span>
        );
      case 'checked-out':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 flex items-center">
            <LogOut size={12} className="mr-1" />
            Checked Out
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 flex items-center">
            <X size={12} className="mr-1" />
            Cancelled
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b">
              <div className="flex">
                <button
                  className={`px-6 py-4 font-medium ${
                    activeTab === 'reservations'
                      ? 'text-blue-900 border-b-2 border-blue-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('reservations')}
                >
                  Reservations
                </button>
                <button
                  className={`px-6 py-4 font-medium ${
                    activeTab === 'rooms'
                      ? 'text-blue-900 border-b-2 border-blue-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('rooms')}
                >
                  Rooms
                </button>
                <button
                  className={`px-6 py-4 font-medium ${
                    activeTab === 'guests'
                      ? 'text-blue-900 border-b-2 border-blue-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('guests')}
                >
                  Guests
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'reservations' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Reservations</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-gray-600">ID</th>
                          <th className="px-4 py-3 text-gray-600">Guest</th>
                          <th className="px-4 py-3 text-gray-600">Room</th>
                          <th className="px-4 py-3 text-gray-600">Check-in</th>
                          <th className="px-4 py-3 text-gray-600">Check-out</th>
                          <th className="px-4 py-3 text-gray-600">Status</th>
                          <th className="px-4 py-3 text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.map((reservation) => {
                          const guest = getGuestById(reservation.guestId);
                          const room = getRoomById(reservation.roomId);
                          
                          return (
                            <tr key={reservation.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="px-4 py-3 font-mono text-sm">{reservation.id}</td>
                              <td className="px-4 py-3">
                                {guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown Guest'}
                              </td>
                              <td className="px-4 py-3">{room ? room.name : 'Unknown Room'}</td>
                              <td className="px-4 py-3">{reservation.checkInDate}</td>
                              <td className="px-4 py-3">{reservation.checkOutDate}</td>
                              <td className="px-4 py-3">{getStatusBadge(reservation.status)}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                                    className="p-1 hover:bg-green-100 rounded-full transition-colors duration-200"
                                    title="Confirm"
                                  >
                                    <Check size={18} className="text-green-600" />
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(reservation.id, 'checked-in')}
                                    className="p-1 hover:bg-blue-100 rounded-full transition-colors duration-200"
                                    title="Check In"
                                  >
                                    <User size={18} className="text-blue-600" />
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(reservation.id, 'checked-out')}
                                    className="p-1 hover:bg-purple-100 rounded-full transition-colors duration-200"
                                    title="Check Out"
                                  >
                                    <LogOut size={18} className="text-purple-600" />
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                                    className="p-1 hover:bg-red-100 rounded-full transition-colors duration-200"
                                    title="Cancel"
                                  >
                                    <X size={18} className="text-red-600" />
                                  </button>
                                  <button
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                    title="Edit"
                                  >
                                    <Pencil size={18} className="text-gray-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'rooms' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Rooms</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-gray-600">ID</th>
                          <th className="px-4 py-3 text-gray-600">Room</th>
                          <th className="px-4 py-3 text-gray-600">Type</th>
                          <th className="px-4 py-3 text-gray-600">Price</th>
                          <th className="px-4 py-3 text-gray-600">Capacity</th>
                          <th className="px-4 py-3 text-gray-600">Status</th>
                          <th className="px-4 py-3 text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rooms.map((room) => (
                          <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-sm">{room.id}</td>
                            <td className="px-4 py-3">{room.name}</td>
                            <td className="px-4 py-3 capitalize">{room.type}</td>
                            <td className="px-4 py-3">${room.price}/night</td>
                            <td className="px-4 py-3">{room.capacity} Guests</td>
                            <td className="px-4 py-3">
                              {room.available ? (
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                  Available
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                  Unavailable
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                title="Edit"
                              >
                                <Pencil size={18} className="text-gray-600" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'guests' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Guests</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-gray-600">ID</th>
                          <th className="px-4 py-3 text-gray-600">Name</th>
                          <th className="px-4 py-3 text-gray-600">Email</th>
                          <th className="px-4 py-3 text-gray-600">Phone</th>
                          <th className="px-4 py-3 text-gray-600">Country</th>
                          <th className="px-4 py-3 text-gray-600">Reservations</th>
                          <th className="px-4 py-3 text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {guests.map((guest) => (
                          <tr key={guest.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-sm">{guest.id}</td>
                            <td className="px-4 py-3">{guest.firstName} {guest.lastName}</td>
                            <td className="px-4 py-3">{guest.email}</td>
                            <td className="px-4 py-3">{guest.phone}</td>
                            <td className="px-4 py-3">{guest.country}</td>
                            <td className="px-4 py-3">{guest.reservations.length}</td>
                            <td className="px-4 py-3">
                              <button
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                title="Edit"
                              >
                                <Pencil size={18} className="text-gray-600" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;