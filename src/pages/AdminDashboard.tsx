import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../supabaseClient';
import InvoiceGenerator from '../components/InvoiceGenerator';
import {
  Check,
  X,
  Clock,
  LogOut,
  User,
  Pencil,
  FileText,
} from 'lucide-react';
import emailjs from 'emailjs-com';

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY); // Replace with your actual PUBLIC KEY

type Reservation = {
  id: string;
  room_id: string | null;
  guest_id: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  status: string | null;
  adults: number | null;
  children: number | null;
  special_requests: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
};

type Guest = {
  guestKey: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  reservations: Reservation[];
};

type Room = {
  id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  available: boolean;
};

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reservations' | 'guests' | 'rooms'>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // Add state for search term
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [selectedReservationForInvoice, setSelectedReservationForInvoice] = useState<Reservation | null>(null);

  const getRooms = async () => {
    const { data, error } = await supabase.from('rooms').select('*');
    if (error) {
      console.error('Error fetching rooms:', error.message);
    } else {
      setRoomList(data as Room[]);
    }
  };

  useEffect(() => {
    const getReservations = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('check_in_date', { ascending: false });

      if (error) console.error(error.message);
      else setReservations(data as Reservation[]);
      setLoading(false);
    };

    getReservations();
    getRooms();
  }, []);

  // Filter reservations based on the search term
  const filteredReservations = reservations.filter((r) => {
    const fullName = `${r.first_name} ${r.last_name}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      (r.email?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (r.room_id ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const deleteReservation = async (id: string) => {
    const { error } = await supabase.from('reservations').delete().eq('id', id);
    if (error) return console.error(error.message);
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const guests: Guest[] = useMemo(() => {
    const map = new Map<string, Guest>();
    reservations
      .filter((r) => r.status === 'checked-in') // Only include checked-in reservations
      .forEach((r) => {
        const key = r.guest_id || r.email || r.id;
        if (!map.has(key)) {
          map.set(key, {
            guestKey: key,
            first_name: r.first_name,
            last_name: r.last_name,
            email: r.email,
            phone: r.phone,
            reservations: [],
          });
        }
        map.get(key)!.reservations.push(r);
      });
    return Array.from(map.values());
  }, [reservations]);

  const sendEmail = (reservation: Reservation, newStatus: string) => {
    if (!reservation.email) {
      console.warn('No email provided for this reservation.');
      return;
    }

    const templateParams = {
      user_name: `${reservation.first_name} ${reservation.last_name}`,
      reservation_id: reservation.id,
      status: newStatus,
      check_in: reservation.check_in_date,
      check_out: reservation.check_out_date,
      email: reservation.email,
    };

    emailjs
      .send(import.meta.env.VITE_EMAILJS_SERVICE_ID, // Use service ID from .env
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
         templateParams) // Replace template ID
      .then((response) => {
        console.log('Email sent successfully:', response.status, response.text);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
      });
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('reservations').update({ status }).eq('id', id);
    if (error) return console.error(error.message);

    const updatedReservation = reservations.find((r) => r.id === id);
    if (updatedReservation) sendEmail(updatedReservation, status);

    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const handleGenerateInvoice = (reservation: Reservation) => {
    setSelectedReservationForInvoice(reservation);
  };

  const badge = (status: string | null) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center">
            <Check size={12} className="mr-1" /> Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center">
            <Clock size={12} className="mr-1" /> Pending
          </span>
        );
      case 'checked-in':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center">
            <User size={12} className="mr-1" /> Checked In
          </span>
        );
      case 'checked-out':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 flex items-center">
            <LogOut size={12} className="mr-1" /> Checked Out
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 flex items-center">
            <X size={12} className="mr-1" /> Cancelled
          </span>
        );
      default:
        return <span>{status || '—'}</span>;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b flex">
              {(['reservations', 'guests', 'rooms'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-6 py-4 font-medium ${
                    activeTab === t
                      ? 'text-blue-900 border-b-2 border-blue-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'reservations' && (
                <>
                <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
                 <h2 className="text-2xl font-bold">Reservations</h2>
                    <input
                    type="text"
                    placeholder="Search by name, email, or room"
                    className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                     value={searchTerm} // Bind input value to searchTerm
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  </div>

                  {loading ? (
                    <p>Loading…</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Guest</th>
                            <th className="px-4 py-3">Room ID</th>
                            <th className="px-4 py-3">Check-in</th>
                            <th className="px-4 py-3">Check-out</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredReservations.map((r) => (
                            <tr key={r.id} className="border-b hover:bg-gray-50 text-sm">
                              <td className="px-4 py-3 font-mono">{r.id.slice(0, 8)}</td>
                              <td className="px-4 py-3">{r.first_name} {r.last_name}</td>
                              <td className="px-4 py-3">{r.room_id || '—'}</td>
                              <td className="px-4 py-3">{r.check_in_date}</td>
                              <td className="px-4 py-3">{r.check_out_date}</td>
                              <td className="px-4 py-3">{badge(r.status)}</td>
                              <td className="px-4 py-3">
                                <div className="flex space-x-2">
                                  <button title="Confirm" onClick={() => updateStatus(r.id, 'confirmed')}>
                                    <Check size={18} className="text-green-600" />
                                  </button>
                                  <button title="Check In" onClick={() => updateStatus(r.id, 'checked-in')}>
                                    <User size={18} className="text-blue-600" />
                                  </button>
                                  <button title="Check Out" onClick={() => updateStatus(r.id, 'checked-out')}>
                                    <LogOut size={18} className="text-purple-600" />
                                  </button>
                                  <button title="Cancel" onClick={() => updateStatus(r.id, 'cancelled')}>
                                    <X size={18} className="text-red-600" />
                                  </button>
                                  {(r.status === 'checked-in' || r.status === 'checked-out') && (
                                    <button 
                                      title="Generate Invoice" 
                                      onClick={() => handleGenerateInvoice(r)}
                                      className="text-indigo-600 hover:text-indigo-800"
                                    >
                                      <FileText size={18} />
                                    </button>
                                  )}
                                  <button title="Edit">
                                    <Pencil size={18} className="text-gray-600" />
                                  </button>
                                  <button
                                    title="Delete"
                                    onClick={() => {
                                      if (confirm('Are you sure you want to delete this reservation?')) {
                                        deleteReservation(r.id);
                                      }
                                    }}
                                  >
                                    <X size={18} className="text-red-400 hover:text-red-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'guests' && (
                <>
                  <h2 className="text-2xl font-bold mb-6">Guests</h2>
                  {loading ? (
                    <p>Loading…</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Reservations</th>
                            <th className="px-4 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {guests.map((g) => (
                            <tr key={g.guestKey} className="border-b hover:bg-gray-50 text-sm">
                              <td className="px-4 py-3 font-mono">{g.guestKey.slice(0, 8)}</td>
                              <td className="px-4 py-3">{g.first_name} {g.last_name}</td>
                              <td className="px-4 py-3">{g.email}</td>
                              <td className="px-4 py-3">{g.phone}</td>
                              <td className="px-4 py-3">{g.reservations.length}</td>
                              <td className="px-4 py-3">
                                {g.reservations.length > 0 && (
                                  <button 
                                    title="Generate Invoice" 
                                    onClick={() => handleGenerateInvoice(g.reservations[0])}
                                    className="text-indigo-600 hover:text-indigo-800"
                                  >
                                    <FileText size={18} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'rooms' && (
                <div>
<div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-bold text-gray-800">Rooms</h2>
  <button
    // onClick={() => setShowAddRoom(true)}
    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  >
    + Add Room
  </button>
</div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3">ID</th>
                          <th className="px-4 py-3">Room</th>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Price</th>
                          <th className="px-4 py-3">Capacity</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roomList.map((room) => (
                          <tr key={room.id} className="border-b hover:bg-gray-50 text-sm">
                            <td className="px-4 py-3 font-mono">{room.id}</td>
                            <td className="px-4 py-3">{room.name}</td>
                            <td className="px-4 py-3 capitalize">{room.type}</td>
                            <td className="px-4 py-3">${room.price}/night</td>
                            <td className="px-4 py-3">{room.capacity} Guests</td>
                            <td className="px-4 py-3">
                              {room.available ? (
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Available</span>
                              ) : (
                                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Unavailable</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <button className="p-1 hover:bg-gray-100 rounded-full" title="Edit">
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

      {/* Invoice Generator Modal */}
      {selectedReservationForInvoice && (
        <InvoiceGenerator
          reservationData={selectedReservationForInvoice}
          onClose={() => setSelectedReservationForInvoice(null)}
        />
      )}
    </Layout>
  );
};

export default AdminDashboard;