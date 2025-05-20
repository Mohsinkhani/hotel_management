import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import RoomCard from './RoomCard';
import RoomDetail from './RoomDetail';
import { supabase } from '../supabaseClient';
import { Room } from '../types';

const CATEGORY_LIMITS: Record<string, number> = {
  deluxe: 4,
  standard: 4,
  luxury: 2,
  presidential: 4,
};

const FeaturedRooms: React.FC = () => {
  const { rooms } = useApp();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchAvailability = async () => {
      // If no dates selected, show up to the limit for each category
      if (!checkInDate || !checkOutDate) {
        const byCategory: Record<string, Room[]> = {};
        rooms.forEach(room => {
          const cat = room.type.toLowerCase();
          if (!byCategory[cat]) byCategory[cat] = [];
          if (byCategory[cat].length < (CATEGORY_LIMITS[cat] || 0)) {
            byCategory[cat].push(room);
          }
        });
        setAvailableRooms(Object.values(byCategory).flat());
        return;
      }

      // Fetch reservations with status 'pending' or 'checked-in'
      const { data: reservations } = await supabase
        .from('reservations')
        .select('room_id, status')
        .in('status', ['pending', 'checked-in'])
        .lte('check_in_date', checkOutDate)
        .gte('check_out_date', checkInDate);

      const bookedRoomIds = new Set(reservations?.map(r => r.room_id));
      const byCategory: Record<string, Room[]> = {};
      rooms.forEach(room => {
        const cat = room.type.toLowerCase();
        if (!bookedRoomIds.has(room.id) && room.available) {
          if (!byCategory[cat]) byCategory[cat] = [];
          if (byCategory[cat].length < (CATEGORY_LIMITS[cat] || 0)) {
            byCategory[cat].push(room);
          }
        }
      });
      setAvailableRooms(Object.values(byCategory).flat());
    };

    fetchAvailability();
  }, [checkInDate, checkOutDate, rooms]);

  const handleRoomClick = (roomId: string) => {
    setSelectedRoom(roomId);
  };

  const handleCloseDetail = () => {
    setSelectedRoom(null);
  };

  const selectedRoomData = rooms.find((room) => room.id === (selectedRoom !== null ? Number(selectedRoom) : null));

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Check Availability</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Check-in</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Check-out</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                min={checkInDate || new Date().toISOString().split('T')[0]}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-blue-900 mb-4">Featured Rooms</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the pinnacle of luxury with our carefully selected accommodations, designed for your ultimate comfort and satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              // checkInDate={checkInDate}
              // checkOutDate={checkOutDate}
              onClick={() => handleRoomClick(room.id.toString())}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/rooms"
            className="inline-block px-6 py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 shadow-md"
          >
            View All Rooms
          </a>
        </div>
      </div>

      {selectedRoom && selectedRoomData && (
        <RoomDetail
          room={selectedRoomData}
          onClose={handleCloseDetail}
          // checkInDate={checkInDate}
        //   checkOutDate={checkOutDate}
         />
      )}
    </div>
  );
};

export default FeaturedRooms;