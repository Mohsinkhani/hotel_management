import React from 'react';
import type { Reservation } from '../../types'; // Adjust path as needed


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

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const MonthlyReport: React.FC<MonthlyReportProps> = ({
  reportMonth,
  setReportMonth,
  reportYear,
  setReportYear,
  monthlyCheckins,
  roomList,
  downloadCSV,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4">
      {/* Embedded print styles */}
    

      {/* Print-only header */}
      <div className="hidden print:block print-header print-content">
        <h1 className="text-2xl font-bold">Lerelax Hotel</h1>
        <div className="text-lg">
          Monthly Report - {monthNames[reportMonth - 1]} {reportYear}
        </div>
      </div>

      {/* Print-only footer */}
      <div className="hidden print:block print-footer print-content">
        <div>123 Luxury Street, Resort City | Contact: +1 (555) 123-4567</div>
      </div>

      <h2 className="text-2xl font-bold mb-6 print:hidden">Monthly Report</h2>
      
      <div className="flex gap-4 mb-6 print:hidden">
        <label>
          Month:{' '}
          <select 
            value={reportMonth} 
            onChange={e => setReportMonth(Number(e.target.value))} 
            className="border rounded p-2"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>
        </label>
        <label>
          Year:{' '}
          <select 
            value={reportYear} 
            onChange={e => setReportYear(Number(e.target.value))} 
            className="border rounded p-2"
          >
            {[2023, 2024, 2025].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </label>
      </div>
      
      {/* Download & Print Buttons - hidden when printing */}
      <div className="mb-4 flex flex-wrap gap-2 print:hidden no-print">
        <button
          onClick={() => downloadCSV(monthlyCheckins, 'checkins')}
          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
        >
          Download Check-ins CSV
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Print Report
        </button>
      </div>
      
      {/* Check-ins Table */}
      <div className="mb-8 print:mb-4 print-content">
        <h3 className="text-lg font-bold mb-2 print:text-sm">Check-ins</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left mb-4 print-table">
            <thead>
              <tr className="bg-gray-50 print:bg-gray-200">
                <th className="px-2 py-1 print:px-1 print:py-1 text-sm print:text-xs">ID</th>
                <th className="px-2 py-1 print:px-1 print:py-1 text-sm print:text-xs">Name</th>
                <th className="px-2 py-1 print:px-1 print:py-1 text-sm print:text-xs">Email</th>
                <th className="px-2 py-1 print:px-1 print:py-1 text-sm print:text-xs">Phone</th>
                <th className="px-2 py-1 print:px-1 print:py-1 text-sm print:text-xs">Room</th>
                <th className="px-2 py-1 print:px-1 print:py-1 text-sm print:text-xs">Price</th>
                <th className="px-2 py-1 print:px-1 print:py-1 text-sm print:text-xs">Check-in</th>
                <th className="px-2 py-1 print:px-1 print:py-1 text-sm print:text-xs">Check-out</th>
              </tr>
            </thead>
            <tbody>
              {monthlyCheckins.map(r => {
                const room = roomList.find(room => String(room.id) === String(r.room_id));
                return (
                  <tr key={r.id} className="border-b hover:bg-gray-50 text-sm print:text-xs">
                    <td className="px-2 py-1 print:px-1 print:py-1 font-mono">{r.id.slice(0, 8)}</td>
                    <td className="px-2 py-1 print:px-1 print:py-1">{r.first_name} {r.last_name}</td>
                    <td className="px-2 py-1 print:px-1 print:py-1">{r.email}</td>
                    <td className="px-2 py-1 print:px-1 print:py-1">{r.phone}</td>
                    <td className="px-2 py-1 print:px-1 print:py-1">{room ? room.name : r.room_id}</td>
                    <td className="px-2 py-1 print:px-1 print:py-1">{room ? `$${room.price}` : '-'}</td>
                    <td className="px-2 py-1 print:px-1 print:py-1">{r.check_in_date}</td>
                    <td className="px-2 py-1 print:px-1 print:py-1">{r.check_out_date}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="font-bold bg-gray-100 print:bg-gray-200">
                <td colSpan={5} className="px-2 py-1 print:px-1 print:py-1 text-sm print:text-xs">Total</td>
                <td className="px-2 py-1 print:px-1 print:py-1 text-sm print:text-xs">
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
      </div>
    </div>
  );
};

export default MonthlyReport;