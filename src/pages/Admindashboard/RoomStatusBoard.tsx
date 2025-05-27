import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Bed, DoorOpen, DoorClosed, User, RefreshCw, CheckCircle, XCircle, Clock, Wrench, Brush } from 'lucide-react';

type Room = {
  id: number;
  name: string;
  floor: number;
  type: string;
  price: number;
};

type CheckIn = {
  id: string;
  room_id: number;
  check_in_date: string;
  check_out_date: string | null;
  guest_name?: string | null;
};

const RoomStatusDashboard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [currentFloor, setCurrentFloor] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data: roomsData } = await supabase
      .from('rooms')
      .select('*')
      .order('floor')
      .order('name');
    const { data: checkinsData } = await supabase
      .from('checkins')
      .select('id, room_id, check_in_date, check_out_date, guest_name')
      .is('check_out_date', null);

    setRooms(roomsData || []);
    setCheckIns(checkinsData || []);
    setLoading(false);
  };

  const getRoomStatus = (roomId: number): 'checkin' | 'checkout' => {
    return checkIns.some(checkIn => checkIn.room_id === roomId && !checkIn.check_out_date)
      ? 'checkout'
      : 'checkin';
  };

  const handleCheckIn = async (roomId: number) => {
    const guest_name = prompt('Enter guest name for this room:');
    if (!guest_name) return;
    const { error } = await supabase
      .from('checkins')
      .insert([{
        room_id: roomId,
        check_in_date: new Date().toISOString(),
        check_out_date: null,
        guest_name
      }]);
    if (!error) fetchData();
  };

  const handleCheckOut = async (roomId: number) => {
    const activeCheckIn = checkIns.find(
      checkIn => checkIn.room_id === roomId && !checkIn.check_out_date
    );
    if (activeCheckIn) {
      const { error } = await supabase
        .from('checkins')
        .update({ check_out_date: new Date().toISOString() })
        .eq('id', activeCheckIn.id);
      if (!error) fetchData();
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Floor configuration
  const floorConfig = {
    1: { types: ['Standard'], counts: [8] },
    2: { types: ['Jacuzzi', 'Shega', 'Hal'], counts: [2, 2, 2] },
    3: { types: ['Standard', 'Twin Bed'], counts: [15, 5] },
    4: { types: ['Deluxe', 'Suite'], counts: [5, 5] }
  };

  const renderFloor = (floor: number) => {
    const floorRooms = rooms.filter(room => room.floor === floor);
    const { types, counts } = floorConfig[floor as keyof typeof floorConfig];

    return (
      <div key={floor} className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-t-lg flex items-center justify-between shadow">
          <h2 className="text-2xl font-bold text-blue-900">Floor {floor}</h2>
          <div className="flex gap-4">
            {types.map((type, index) => (
              <span key={type} className="bg-white px-4 py-1 rounded-full text-base font-medium shadow">
                {counts[index]} {type} Rooms
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white rounded-b-lg shadow-sm">
          {types.flatMap((type, typeIndex) =>
            Array.from({ length: counts[typeIndex] }, (_, i) => {
              const roomNumber = `${floor}${String(i + 1).padStart(2, '0')}`;
              const room = floorRooms.find(r => r.name === roomNumber);
              const status = room ? getRoomStatus(room.id) : 'checkin';
              const guestName = room
                ? checkIns.find(c => c.room_id === room.id)?.guest_name
                : null;
              const checkInDate = room
                ? checkIns.find(c => c.room_id === room.id)?.check_in_date
                : null;

              return (
                <div
                  key={`${floor}-${type}-${i}`}
                  className={`relative border rounded-xl p-6 transition-all duration-200 shadow-lg hover:shadow-2xl group bg-gradient-to-br ${
                    status === 'checkin'
                      ? 'from-green-50 to-green-100'
                      : 'from-red-50 to-red-100'
                  }`}
                  onMouseEnter={() => setHoveredRoom(`${floor}-${type}-${i}`)}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                        <Bed className="inline-block h-6 w-6 text-blue-700" />
                        Room {roomNumber}
                      </h3>
                      <p className="text-sm text-gray-600">{type}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-base font-semibold shadow ${
                      status === 'checkin'
                        ? 'bg-green-200 text-green-900'
                        : 'bg-red-200 text-red-900'
                    }`}>
                      {status === 'checkin' ? (
                        <span className="flex items-center gap-1"><DoorOpen className="h-4 w-4" /> Check In</span>
                      ) : (
                        <span className="flex items-center gap-1"><DoorClosed className="h-4 w-4" /> Check Out</span>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-base font-medium text-blue-900">${room?.price || '---'}/night</span>
                    {room && (
                      <button
                        onClick={() =>
                          status === 'checkin'
                            ? handleCheckIn(room.id)
                            : handleCheckOut(room.id)
                        }
                        className={`px-4 py-1 rounded-lg text-base font-semibold transition-colors duration-150 ${
                          status === 'checkin'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                      >
                        {status === 'checkin' ? 'Check In' : 'Check Out'}
                      </button>
                    )}
                  </div>

                  {status === 'checkout' && (
                    <div className="mt-4 text-sm text-gray-700 bg-gray-50 rounded p-2">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-blue-700" />
                        <span className="font-semibold">Guest:</span>
                        <span>{guestName || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold">Since:</span>
                        <span>
                          {checkInDate
                            ? new Date(checkInDate).toLocaleString()
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Hover actions */}
                  <div
                    className={`absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                  >
                    <button
                      title="Mark as Cleaning"
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 p-2 rounded-full shadow"
                    >
                      <Brush className="h-5 w-5" />
                    </button>
                    <button
                      title="Mark as Under Construction"
                      className="bg-orange-100 hover:bg-orange-200 text-orange-800 p-2 rounded-full shadow"
                    >
                      <Wrench className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-blue-900">Hotel Room Status</h1>
            <button
              onClick={fetchData}
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 shadow transition"
            >
              <RefreshCw className="h-6 w-6" />
            </button>
          </div>

          <div className="flex gap-4 mb-8">
            {[1, 2, 3, 4].map(floor => (
              <button
                key={floor}
                onClick={() => setCurrentFloor(floor)}
                className={`px-6 py-2 rounded-xl text-lg font-semibold shadow ${
                  currentFloor === floor
                    ? 'bg-blue-800 text-white'
                    : 'bg-gray-100 text-blue-900 hover:bg-blue-200'
                }`}
              >
                Floor {floor}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center p-16">
              <RefreshCw className="animate-spin h-10 w-10 text-blue-500 mx-auto" />
              <p className="mt-4 text-lg text-gray-600">Loading room status...</p>
            </div>
          ) : (
            renderFloor(currentFloor)
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomStatusDashboard;