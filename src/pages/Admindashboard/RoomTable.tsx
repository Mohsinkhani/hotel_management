import React, { useState } from 'react';
import { Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reservation } from '../../types';
import { reservations } from '../../data/reservations';

type Room = {
  id: number;
  name: string;
  type: string;
  price: number;
  capacity: number;
  available: boolean;
  quantity: number;
};

function getAvailableRooms(room: Room, reservations: Reservation[], checkIn: string, checkOut: string) {
  // Count overlapping reservations for this room
  const reservedCount = reservations.filter(r =>
    String(r.room_id) === String(room.id) &&
    (r.status === 'confirmed' || r.status === 'checked-in') &&
    // Overlapping date logic
    !(r.check_out_date <= checkIn || r.check_in_date >= checkOut)
  ).length;
  return room.quantity - reservedCount;
}

interface RoomTableProps {
  roomList: Room[];
  reservations: Reservation[];
  checkIn: string;
  checkOut: string;
}

const getToday = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const getTomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const RoomTable: React.FC<RoomTableProps> = ({ roomList, reservations, checkIn, checkOut }) => {
  const today = getToday();
  const tomorrow = getTomorrow();
  const [localCheckIn, setLocalCheckIn] = useState(checkIn || today);
  const [localCheckOut, setLocalCheckOut] = useState(checkOut || tomorrow);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(5); // You can adjust this number
  
  // Get current rooms
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = roomList.slice(indexOfFirstRoom, indexOfLastRoom);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Calculate total pages
  const totalPages = Math.ceil(roomList.length / roomsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Rooms</h2>
        <div className="flex gap-2 items-center">
          <label>
            Check-in:{' '}
            <input
              type="date"
              value={localCheckIn}
              onChange={e => setLocalCheckIn(e.target.value)}
              className="border rounded p-1"
            />
          </label>
          <label>
            Check-out:{' '}
            <input
              type="date"
              value={localCheckOut}
              onChange={e => setLocalCheckOut(e.target.value)}
              className="border rounded p-1"
            />
          </label>
        </div>
        <button
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
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRooms.map((room) => (
              <tr key={room.id} className="border-b hover:bg-gray-50 text-sm">
                <td className="px-4 py-3 font-mono">{room.id}</td>
                <td className="px-4 py-3">{room.name}</td>
                <td className="px-4 py-3 capitalize">{room.type}</td>
                <td className="px-4 py-3">${room.price}/night</td>
                <td className="px-4 py-3">{room.capacity} Guests</td>
                <td className="px-4 py-3">{getAvailableRooms(room, reservations, localCheckIn, localCheckOut)} / {room.quantity}</td>
                <td className="px-4 py-3">
                  {getAvailableRooms(room, reservations, localCheckIn, localCheckOut) > 0 ? (
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
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstRoom + 1} to {Math.min(indexOfLastRoom, roomList.length)} of {roomList.length} rooms
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <ChevronLeft size={20} />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`w-8 h-8 rounded-full ${currentPage === number ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {number}
            </button>
          ))}
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomTable;