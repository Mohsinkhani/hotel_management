import React, { useEffect, useMemo, useState } from 'react';

import {

  Pencil,
} from 'lucide-react';
import emailjs from 'emailjs-com';
import { supabase } from '../../supabaseClient';
import ReservationTable from './ReservationTable';
import GuestTable from './GuestTable';
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

// Move this type to a new file, e.g., src/types/Reservation.ts, and import it in both AdminDashboard.tsx and ReservationTable.tsx

// src/types/Reservation.ts
export type Reservation = {
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


type Room = {
  id: number;
  name: string;
  type: string;
  price: number;
  capacity: number;
  available: boolean;
};

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reservations' | 'guests' | 'rooms' | 'report'>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setSearchTerm] = useState('');
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [, setShowWalkInForm] = useState(false);

  // For monthly report
  const now = new Date();
  const [reportMonth, setReportMonth] = useState<number>(now.getMonth() + 1); // 1-12
  const [reportYear, setReportYear] = useState<number>(now.getFullYear());

  // CSV Download Helper
  function downloadCSV(rows: Reservation[], type: string) {
    if (!rows.length) return;
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Room', 'Price', 'Check-in', 'Check-out'];
    const csvRows = [
      headers.join(','),
      ...rows.map(r => {
        const room = roomList.find(room => String(room.id) === String(r.room_id));
        return [
          r.id,
          `"${r.first_name} ${r.last_name}"`,
          r.email,
          r.phone,
          room ? room.name : r.room_id,
          room ? room.price : '',
          r.check_in_date,
          r.check_out_date,
        ].join(',');
      }),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const getRooms = async () => {
    const { data, error } = await supabase.from('rooms').select('*');
    if (error) {
      console.error('Error fetching rooms:', error.message);
    } else {
      setRoomList(data as Room[]);
    }
  };

  useEffect(() => {
     const fetchReservations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('check_in_date', { ascending: false });
    if (error) {
      setReservations([]);
    } else {
      setReservations(data as Reservation[]);
    }
    setLoading(false);
  };
  fetchReservations();
    getRooms();
  }, []);

  // Monthly report logic
  const monthlyCheckins = useMemo(() => {
    return reservations.filter(r => {
      if (!r.check_in_date) return false;
      const date = new Date(r.check_in_date);
      return (
        date.getMonth() + 1 === reportMonth &&
        date.getFullYear() === reportYear
      );
    });
  }, [reservations, reportMonth, reportYear]);

  const monthlyCheckouts = useMemo(() => {
    return reservations.filter(r => {
      if (!r.check_out_date) return false;
      const date = new Date(r.check_out_date);
      return (
        date.getMonth() + 1 === reportMonth &&
        date.getFullYear() === reportYear
      );
    });
  }, [reservations, reportMonth, reportYear]);




return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b flex">
              {(['reservations', 'guests', 'rooms', 'report'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-6 py-4 font-medium ${
                    activeTab === t
                      ? 'text-blue-900 border-b-2 border-blue-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t === 'report' ? 'Monthly Report' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-6">
              RESERVATIONS TABLE
              {activeTab === 'reservations' && (
<ReservationTable roomList={roomList} />
      )}
              

              {/* GUESTS TABLE */}
            {activeTab === 'guests' && (
  <GuestTable roomList={roomList} loading={loading} reservations={reservations} />
)}

              {/* MONTHLY REPORT */}
              {activeTab === 'report' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Monthly Report</h2>
                  <div className="flex gap-4 mb-6">
                    <label>
                      Month:{' '}
                      <select value={reportMonth} onChange={e => setReportMonth(Number(e.target.value))} className="border rounded p-2">
                        {[...Array(12)].map((_, i) => (
                          <option key={i+1} value={i+1}>{i+1}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Year:{' '}
                      <select value={reportYear} onChange={e => setReportYear(Number(e.target.value))} className="border rounded p-2">
                        {[2023, 2024, 2025].map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  {/* Download & Print Buttons */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {/* <button
                      onClick={() => downloadCSV(monthlyCheckins, 'checkins')}
                      className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                    >
                      Download Check-ins CSV
                    </button> */}   
                    <button
                      onClick={() => downloadCSV(monthlyCheckouts, 'checkouts')}
                      className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                    >
                      Download Check-outs CSV
                    </button>
                    {/* <button
                      onClick={() => downloadCSV([...monthlyCheckins, ...monthlyCheckouts], 'all')}
                      className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                    >
                      Download All CSV
                    </button> */}
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                      Print Report
                    </button>
                  </div>
                  {/* Check-ins Table */}
                   <div className="mb-8">
                    <h3 className="text-lg font-bold mb-2">Check-ins</h3>
                    <table className="w-full text-left mb-4">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3">ID</th>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Phone</th>
                          <th className="px-4 py-3">Room</th>
                          <th className="px-4 py-3">Price</th>
                          <th className="px-4 py-3">Check-in</th>
                          <th className="px-4 py-3">Check-out</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyCheckins.map(r => {
                          const room = roomList.find(room => String(room.id) === String(r.room_id));
                          return (
                            <tr key={r.id} className="border-b hover:bg-gray-50 text-sm">
                              <td className="px-4 py-3 font-mono">{r.id.slice(0, 8)}</td>
                              <td className="px-4 py-3">{r.first_name} {r.last_name}</td>
                              <td className="px-4 py-3">{r.email}</td>
                              <td className="px-4 py-3">{r.phone}</td>
                              <td className="px-4 py-3">{room ? room.name : r.room_id}</td>
                              <td className="px-4 py-3">{room ? `$${room.price}` : '-'}</td>
                              <td className="px-4 py-3">{r.check_in_date}</td>
                              <td className="px-4 py-3">{r.check_out_date}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="font-bold bg-gray-100">
                          <td colSpan={5}>Total</td>
                          <td className="px-4 py-3">
                            ${monthlyCheckins.reduce((sum, r) => {
                              const room = roomList.find(room => String(room.id) === String(r.room_id));
                              return sum + (room ? Number(room.price) : 0);
                            }, 0)}
                          </td>
                          <td colSpan={2}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div> 
                  Check-outs Table */
                   <div>
                    <h3 className="text-lg font-bold mb-2">Check-outs</h3>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3">ID</th>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Phone</th>
                          <th className="px-4 py-3">Room</th>
                          <th className="px-4 py-3">Price</th>
                          <th className="px-4 py-3">Check-in</th>
                          <th className="px-4 py-3">Check-out</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyCheckouts.map(r => {
                          const room = roomList.find(room => String(room.id) === String(r.room_id));
                          return (
                            <tr key={r.id} className="border-b hover:bg-gray-50 text-sm">
                              <td className="px-4 py-3 font-mono">{r.id.slice(0, 8)}</td>
                              <td className="px-4 py-3">{r.first_name} {r.last_name}</td>
                              <td className="px-4 py-3">{r.email}</td>
                              <td className="px-4 py-3">{r.phone}</td>
                              <td className="px-4 py-3">{room ? room.name : r.room_id}</td>
                              <td className="px-4 py-3">{room ? `$${room.price}` : '-'}</td>
                              <td className="px-4 py-3">{r.check_in_date}</td>
                              <td className="px-4 py-3">{r.check_out_date}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="font-bold bg-gray-100">
                          <td colSpan={5}>Total</td>
                          <td className="px-4 py-3">
                            ${monthlyCheckouts.reduce((sum, r) => {
                              const room = roomList.find(room => String(room.id) === String(r.room_id));
                              return sum + (room ? Number(room.price) : 0);
                            }, 0)}
                          </td>
                          <td colSpan={2}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* ROOMS TABLE */}
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
  );
};

export default AdminDashboard;