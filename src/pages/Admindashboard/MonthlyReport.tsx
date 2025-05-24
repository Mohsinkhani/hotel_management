import React from 'react';
import { Reservation } from './AdminDashboard'; // Or from your types file

type Room = {
  id: number;
  name: string;
  type: string;
  price: number;
  capacity: number;
  available: boolean;
};

interface MonthlyReportProps {
  reportMonth: number;
  setReportMonth: (month: number) => void;
  reportYear: number;
  setReportYear: (year: number) => void;
  monthlyCheckins: Reservation[];
  monthlyCheckouts: Reservation[];
  roomList: Room[];
  downloadCSV: (rows: Reservation[], type: string) => void;
}

const MonthlyReport: React.FC<MonthlyReportProps> = ({
  reportMonth,
  setReportMonth,
  reportYear,
  setReportYear,
  monthlyCheckins,
  monthlyCheckouts,
  roomList,
  downloadCSV,
}) => (
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
      <button
        onClick={() => downloadCSV(monthlyCheckins, 'checkins')}
        className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
      >
        Download Check-ins CSV
      </button>
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
    {/* Check-outs Table */}

  </div>
);

export default MonthlyReport;