import React, { useEffect, useMemo, useState } from 'react';

import {

  Pencil,
} from 'lucide-react';
import emailjs from 'emailjs-com';
import { supabase } from '../../supabaseClient';
import ReservationTable from './ReservationTable';
import GuestTable from './GuestTable';
import RoomTable from './RoomTable';
import MonthlyReport from './MonthlyReport';
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

import type { Reservation } from '../../types';


type Room = {
  id: number;
  name: string;
  type: string;
  price: number;
  capacity: number;
  available: boolean;
  quantity: number;
};

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reservations' | 'guests' | 'rooms' | 'report'>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomList, setRoomList] = useState<Room[]>([]);
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
             <ReservationTable
  roomList={roomList}
  
/>
              )}
              

              {/* GUESTS TABLE */}
            {activeTab === 'guests' && (
            <GuestTable roomList={roomList} loading={loading} reservations={reservations} />
              )}

              {/* MONTHLY REPORT */}
            {activeTab === 'report' && (
              <MonthlyReport
    reportMonth={reportMonth}
    setReportMonth={setReportMonth}
    reportYear={reportYear}
    setReportYear={setReportYear}
    monthlyCheckins={monthlyCheckins}
    monthlyCheckouts={monthlyCheckouts}
    roomList={roomList}
    downloadCSV={downloadCSV}
    />
      )}

              {/* ROOMS TABLE */}
             {activeTab === 'rooms' && (
            <RoomTable roomList={roomList} reservations={reservations} checkIn={''} checkOut={''} />
        )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;