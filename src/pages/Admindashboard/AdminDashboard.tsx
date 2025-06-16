import React, { useEffect, useState } from 'react';
import emailjs from 'emailjs-com';
import { supabase } from '../../supabaseClient';
import ReservationTable from './ReservationTable';
import GuestTable from './GuestTable';
import RoomTable from './RoomTable';
import MonthlyReport from './MonthlyReport';
// import RoomStatusDashboard from './RoomStatusDashboard';
import type { Reservation } from '../../types';
import RoomStatusDashboard from './RoomStatusBoard';
import RoomStatusBoard from './RoomStatusBoard';

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

type Room = {
  id: number;
  name: string;
  type: string;
  price: number;
  capacity: number;
  available: boolean;
  quantity: number;
  floor: number;
};

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reservations' | 'guests' | 'rooms' | 'report' | 'roomstatus'>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [monthlyCheckins, setMonthlyCheckins] = useState<Reservation[]>([]);
  const [monthlyCheckouts, setMonthlyCheckouts] = useState<Reservation[]>([]);
  const now = new Date();
  const [reportMonth, setReportMonth] = useState<number>(now.getMonth() + 1);
  const [reportYear, setReportYear] = useState<number>(now.getFullYear());
  const [userEmail, setUserEmail] = useState<string | null>(null);

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
  const fetchMonthlyCheckins = async () => {
    const from = `${reportYear}-${String(reportMonth).padStart(2, '0')}-01`;
    const toMonth = reportMonth === 12 ? 1 : reportMonth + 1;
    const toYear = reportMonth === 12 ? reportYear + 1 : reportYear;
    const to = `${toYear}-${String(toMonth).padStart(2, '0')}-01`;
    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .gte('check_in_date', from)
      .lt('check_in_date', to);
    if (error) {
      setMonthlyCheckins([]);
    } else {
      setMonthlyCheckins(data || []);
    }
  };
  fetchMonthlyCheckins();
}, [reportMonth, reportYear]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email ?? null);
    });
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
  // Modified to fetch only check-ins and check-outs
 
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b flex">
            {(['reservations', 'guests', 'rooms', 'report', 'roomstatus'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 py-4 px-2 text-center font-semibold transition-colors duration-200 ${
                  activeTab === t ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'reservations' && <ReservationTable roomList={roomList} />}
            {activeTab === 'guests' && <GuestTable roomList={roomList} loading={loading} reservations={reservations} />}
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
            {activeTab === 'rooms' && <RoomTable roomList={roomList} reservations={reservations} checkIn={''} checkOut={''} />}
{activeTab === 'roomstatus' && (
  <RoomStatusBoard roomList={roomList} reservations={reservations} />
)}          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;