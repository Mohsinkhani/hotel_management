import React, { useState } from 'react';
import { reservations } from '../../data/reservations';
import { Reservation } from '../../types';

type Room = {
  id: number;
  name: string;
  floor: number;
  type: string;
  price: number;
  quantity: number;
};



const getToday = () => new Date().toISOString().split('T')[0];
const getTomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

function isRoomUnavailable(room: Room, reservations: Reservation[], checkIn: string, checkOut: string) {
  const reservedCount = reservations.filter(r =>
    String(r.room_id) === String(room.id) &&
    (r.status === 'confirmed' || r.status === 'checked-in') &&
    !(r.check_out_date <= checkIn || r.check_in_date >= checkOut)
  ).length;
  return reservedCount >= room.quantity;
}

interface RoomStatusBoardProps {
  roomList: Room[];
  reservations: Reservation[];
}

const RoomStatusBoard: React.FC<RoomStatusBoardProps> = ({ roomList, reservations }) => {
  const [currentFloor, setCurrentFloor] = useState<number>(2);
  const [localCheckIn, setLocalCheckIn] = useState(getToday());
  const [localCheckOut, setLocalCheckOut] = useState(getTomorrow());

  const renderFloor = (floor: number) => {
    const floorRooms = roomList.filter(room => room.floor === floor);

    return (
      <div key={floor} className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-t-lg flex items-center justify-between shadow-lg">
          <h2 className="text-2xl font-bold text-white">Floor {floor}</h2>
          <div className="flex gap-2">
            <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-medium text-white backdrop-blur-sm">
              {floorRooms.length} Total Rooms
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6 bg-white rounded-b-lg shadow-sm">
          {floorRooms.map(room => {
            const unavailable = isRoomUnavailable(room, reservations, localCheckIn, localCheckOut);
            return (
              <div
                key={`${floor}-${room.id}`}
                className={`relative border rounded-xl p-4 transition-all duration-200 shadow-md ${
                  unavailable
                    ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
                    : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{room.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                        {room.type}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {room.price} SAR
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow ${
                    unavailable
                      ? 'bg-red-200 text-red-900'
                      : 'bg-green-200 text-green-900'
                  }`}>
                    {unavailable ? 'Unavailable' : 'Available'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Lerelax Hotel</h1>
                <p className="text-blue-200 mt-1">Room Status Board</p>
              </div>
            </div>
          </div>

          {/* Date Filters */}
          <div className="p-4 bg-gray-50 border-b flex flex-wrap gap-4 items-center">
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
            <div className="flex overflow-x-auto pb-2 gap-2 ml-auto">
              {[2, 3, 4, 5].map(floor => (
                <button
                  key={floor}
                  onClick={() => setCurrentFloor(floor)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                    currentFloor === floor
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                  }`}
                >
                  Floor {floor}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-6">
            {renderFloor(currentFloor)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomStatusBoard;