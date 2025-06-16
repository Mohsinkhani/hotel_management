import React from 'react';
import type { Reservation } from '../../types';

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

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

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
    <div className="p-4 print:p-0 print:bg-white print:w-full print:max-w-none">
      {/* Print-specific styles */}
     <style>
  {`
    @media print {
      body {
        background: white !important;
      }
      .print-hide, .no-print, nav, footer, .navbar, .sidebar, .tab-header {
        display: none !important;
      }
      .print-header {
        display: block !important;
        text-align: center;
        margin-bottom: 12px;
      }
      .print-table {
        font-size: 11px;
        width: 100%;
        border-collapse: collapse;
      }
      .print-table th, .print-table td {
        border: 1px solid #ccc;
        padding: 2px 4px;
      }
      .print-table th {
        background: #f3f3f3;
      }
      .print-content {
        margin: 0 !important;
        padding: 0 !important;
      }
      .print\:mb-4 {
        margin-bottom: 6px !important;
      }
    }
  `}
</style>

      {/* Print-only header */}
      <div className="print-header hidden print:block">
        <h1 className="text-2xl font-bold mb-1">Lerelax Hotel</h1>
        <div className="text-lg mb-2">
          Monthly Report - {monthNames[reportMonth - 1]} {reportYear}
        </div>
      </div>

      {/* On-screen heading (not printed) */}
      <h2 className="text-2xl font-bold mb-6 print-hide">Monthly Report</h2>
      
      {/* Controls (not printed) */}
      <div className="flex gap-4 mb-6 print-hide">
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
      
      {/* Download & Print Buttons - not printed */}
      <div className="mb-4 flex flex-wrap gap-2 print-hide">
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
        <h3 className="text-lg font-bold mb-2 print-hide">Check-ins</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left mb-4 print-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Room</th>
                <th>Price</th>
                <th>Check-in</th>
                <th>Check-out</th>
              </tr>
            </thead>
            <tbody>
              {monthlyCheckins.map(r => {
                const room = roomList.find(room => String(room.id) === String(r.room_id));
                return (
                  <tr key={r.id}>
                    <td>{r.id.slice(0, 8)}</td>
                    <td>{r.first_name} {r.last_name}</td>
                    <td>{r.email}</td>
                    <td>{r.phone}</td>
                    <td>{room ? room.name : r.room_id}</td>
                    <td>{room ? `$${room.price}` : '-'}</td>
                    <td>{r.check_in_date}</td>
                    <td>{r.check_out_date}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5}><b>Total</b></td>
                <td>
                  <b>
                  ${monthlyCheckins.reduce((sum, r) => {
                    const room = roomList.find(room => String(room.id) === String(r.room_id));
                    return sum + (room ? Number(room.price) : 0);
                  }, 0)}
                  </b>
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