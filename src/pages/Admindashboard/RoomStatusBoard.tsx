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
  const [currentFloor, setCurrentFloor] = useState<number>(2);
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

  // Floor configuration with exact room numbers
  const floorConfig = {
    2: [
      { number: '201', type: 'Standard', price: 200 },
      { number: '202', type: 'Standard', price: 200 },
      { number: '203', type: 'Twin Bed', price: 200 },
      { number: '204', type: 'Twin Bed', price: 200 },
      { number: '205', type: 'Twin Bed', price: 200 }
    ],
    3: [
      { number: '301', type: 'Shega', price: 300 },
      { number: '302', type: 'Jacuzzi', price: 350 },
      { number: '303', type: 'Room with Hall', price: 300 },
      { number: '304', type: 'Jacuzzi', price: 350 },
      { number: '305', type: 'Room with Hall', price: 300 },
      { number: '306', type: 'Twin Bed', price: 200 },
      { number: '307', type: 'Twin Bed', price: 200 }
    ],
    4: [
      { number: '401', type: 'Shega', price: 300 },
      { number: '402', type: 'Standard', price: 200 },
      { number: '403', type: 'Standard', price: 200 },
      { number: '404', type: 'Standard', price: 200 },
      { number: '405', type: 'Twin Bed', price: 200 },
      { number: '406', type: 'Standard', price: 200 }
    ],
    5: [
      { number: '501', type: 'Standard', price: 200 },
      { number: '502', type: 'Twin Bed', price: 200 },
      { number: '503', type: 'Standard', price: 200 },
      { number: '504', type: 'Standard', price: 200 },
      { number: '505', type: 'Standard', price: 200 },
      { number: '506', type: 'Standard', price: 200 },
      { number: '507', type: 'Twin Bed', price: 200 },
      { number: '508', type: 'Twin Bed', price: 200 },
      { number: '509', type: 'Twin Bed', price: 200 },
      { number: '510', type: 'Twin Bed', price: 200 },
      { number: '511', type: 'Twin Bed', price: 200 },
      { number: '512', type: 'Twin Bed', price: 200 },
      { number: '513', type: 'Twin Bed', price: 200 },
      { number: '514', type: 'Standard', price: 200 },
      { number: '516', type: 'Standard', price: 200 }
    ]
  };

  // Calculate room counts for each floor
  const getRoomCounts = (floor: number) => {
    const counts: Record<string, number> = {};
    floorConfig[floor as keyof typeof floorConfig].forEach(room => {
      if (room.type === 'Shega') {
        counts['Shega'] = (counts['Shega'] || 0) + 1;
        counts['Standard'] = (counts['Standard'] || 0) + 3;
      } else {
        counts[room.type] = (counts[room.type] || 0) + 1;
      }
    });
    return counts;
  };

  const renderFloor = (floor: number) => {
    const floorRooms = rooms.filter(room => room.floor === floor);
    const roomConfigs = floorConfig[floor as keyof typeof floorConfig];
    const roomCounts = getRoomCounts(floor);

    return (
      <div key={floor} className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-t-lg flex items-center justify-between shadow">
          <h2 className="text-2xl font-bold text-blue-900">Floor {floor}</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(roomCounts).map(([type, count]) => (
              <span key={type} className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow">
                {count} {type} {count === 1 ? 'Room' : 'Rooms'}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-b-lg shadow-sm">
          {roomConfigs.flatMap((roomConfig, index) => {
            const room = floorRooms.find(r => r.name === roomConfig.number);
            
            // Shega type: show 3 subrooms
            if (roomConfig.type === 'Shega') {
              return [1, 2, 3].map(sub => {
                const subRoomNumber = `${roomConfig.number}-${sub}`;
                const status = room ? getRoomStatus(room.id) : 'checkin';
                const guestName = room ? checkIns.find(c => c.room_id === room.id)?.guest_name : null;
                const checkInDate = room ? checkIns.find(c => c.room_id === room.id)?.check_in_date : null;

                return (
                  <div
                    key={`${floor}-${roomConfig.number}-${sub}`}
                    className={`relative border-2 rounded-xl p-5 transition-all duration-200 shadow-lg hover:shadow-xl group ${
                      status === 'checkout' 
                        ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200' 
                        : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
                    }`}
                    onMouseEnter={() => setHoveredRoom(`${floor}-${roomConfig.number}-${sub}`)}
                    onMouseLeave={() => setHoveredRoom(null)}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                          <Bed className="h-5 w-5 text-blue-700" />
                          Room {subRoomNumber}
                        </h3>
                        <p className="text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded-full inline-block">Standard Room</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow ${
                        status === 'checkin' 
                          ? 'bg-green-200 text-green-900' 
                          : 'bg-red-200 text-red-900'
                      }`}>
                        {status === 'checkin' ? (
                          <span className="flex items-center gap-1"><DoorOpen className="h-3 w-3" /> Available</span>
                        ) : (
                          <span className="flex items-center gap-1"><DoorClosed className="h-3 w-3" /> Occupied</span>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-medium text-blue-900">SAR {roomConfig.price}/night</span>
                      {room && (
                        <button
                          onClick={() =>
                            status === 'checkin'
                              ? handleCheckIn(room.id)
                              : handleCheckOut(room.id)
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors duration-150 ${
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
                      <div className="mt-3 text-xs text-gray-700 bg-white rounded p-2 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-3 w-3 text-blue-700" />
                          <span className="font-semibold">Guest:</span>
                          <span className="truncate">{guestName || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="font-semibold">Since:</span>
                          <span>
                            {checkInDate
                              ? new Date(checkInDate).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className={`absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                      <button
                        title="Mark as Cleaning"
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 p-1 rounded-full shadow"
                      >
                        <Brush className="h-4 w-4" />
                      </button>
                      <button
                        title="Mark as Under Construction"
                        className="bg-orange-100 hover:bg-orange-200 text-orange-800 p-1 rounded-full shadow"
                      >
                        <Wrench className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              });
            }

            // All other room types
            const status = room ? getRoomStatus(room.id) : 'checkin';
            const guestName = room
              ? checkIns.find(c => c.room_id === room.id)?.guest_name
              : null;
            const checkInDate = room
              ? checkIns.find(c => c.room_id === room.id)?.check_in_date
              : null;

            return (
              <div
                key={`${floor}-${roomConfig.number}`}
                className={`relative border-2 rounded-xl p-5 transition-all duration-200 shadow-lg hover:shadow-xl group ${
                  status === 'checkout' 
                    ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200' 
                    : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
                }`}
                onMouseEnter={() => setHoveredRoom(`${floor}-${roomConfig.number}`)}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                      <Bed className="h-5 w-5 text-blue-700" />
                      Room {roomConfig.number}
                    </h3>
                    <p className="text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded-full inline-block">{roomConfig.type}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow ${
                    status === 'checkin' 
                      ? 'bg-green-200 text-green-900' 
                      : 'bg-red-200 text-red-900'
                  }`}>
                    {status === 'checkin' ? (
                      <span className="flex items-center gap-1"><DoorOpen className="h-3 w-3" /> Available</span>
                    ) : (
                      <span className="flex items-center gap-1"><DoorClosed className="h-3 w-3" /> Occupied</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium text-blue-900">SAR {roomConfig.price}/night</span>
                  {room && (
                    <button
                      onClick={() =>
                        status === 'checkin'
                          ? handleCheckIn(room.id)
                          : handleCheckOut(room.id)
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors duration-150 ${
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
                  <div className="mt-3 text-xs text-gray-700 bg-white rounded p-2 border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-3 w-3 text-blue-700" />
                      <span className="font-semibold">Guest:</span>
                      <span className="truncate">{guestName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="font-semibold">Since:</span>
                      <span>
                        {checkInDate
                          ? new Date(checkInDate).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                )}

                <div className={`absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                  <button
                    title="Mark as Cleaning"
                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 p-1 rounded-full shadow"
                  >
                    <Brush className="h-4 w-4" />
                  </button>
                  <button
                    title="Mark as Under Construction"
                    className="bg-orange-100 hover:bg-orange-200 text-orange-800 p-1 rounded-full shadow"
                  >
                    <Wrench className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900">Hotel Room Dashboard</h1>
              <p className="text-gray-600 mt-1">Real-time room status and management</p>
            </div>
            <button
              onClick={fetchData}
              className="bg-blue-600 text-white p-2 sm:p-3 rounded-lg hover:bg-blue-700 shadow transition flex items-center gap-2"
            >
              <RefreshCw className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {[2, 3, 4, 5].map(floor => (
              <button
                key={floor}
                onClick={() => setCurrentFloor(floor)}
                className={`px-4 py-2 rounded-xl text-base font-semibold shadow transition 
                  ${currentFloor === floor 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                  }`}
              >
                              Floor {floor}
                            </button>
                          ))}
                        </div>
              
                        {renderFloor(currentFloor)}
                      </div>
                    </div>
                  </div>
                );
              };
              
              export default RoomStatusDashboard;