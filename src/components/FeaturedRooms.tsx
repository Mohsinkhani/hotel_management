import React, { useEffect, useState } from 'react';
import RoomCard from './RoomCard';
import RoomDetail from './RoomDetail';
import { supabase } from '../supabaseClient';
import { Room } from '../types';

const FeaturedRooms: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('rooms').select('*').limit(6);;
      if (error) {
        console.error('Error fetching rooms:', error.message);
      } else {
        setRooms(data as Room[]);
      }
      setLoading(false);
    };

    fetchRooms();
  }, []);
  // Take the first 3 rooms for featured display

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
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-blue-900 mb-4">Featured Rooms</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the pinnacle of luxury with our carefully selected accommodations, designed for your ultimate comfort and satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
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
        <RoomDetail room={selectedRoomData} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default FeaturedRooms;




