import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  Bed, 
  DoorOpen, 
  DoorClosed, 
  User, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Wrench, 
  Brush, 
  Star, 
  Users, 
  Home, 
  Bath,
  Hotel,
  Calendar,
  Shield,
  Zap
} from 'lucide-react';

type Room = {
  id: number;
  name: string;
  floor: number;
  type: string;
  price: number;
  status?: 'available' | 'occupied' | 'cleaning' | 'maintenance';
};

type CheckIn = {
  id: string;
  room_id: number;
  check_in_date: string;
  check_out_date: string | null;
  guest_name?: string | null;
};

const RoomStatusDashboard: React.FC = () => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [currentFloor, setCurrentFloor] = useState<number>(2);
  const [loading, setLoading] = useState(true);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showRoomDetails, setShowRoomDetails] = useState(false);

  // Static room configuration based on requirements
  const staticRooms: Room[] = [
    // Floor 2
    { id: 201, name: '201', floor: 2, type: 'Standard', price: 200 },
    { id: 202, name: '202', floor: 2, type: 'Standard', price: 200 },
    { id: 203, name: '203', floor: 2, type: 'Twin Bed', price: 200 },
    { id: 204, name: '204', floor: 2, type: 'Twin Bed', price: 200 },
    { id: 205, name: '205', floor: 2, type: 'Twin Bed', price: 200 },
    
    // Floor 3
    { id: 301, name: '301', floor: 3, type: 'Shega', price: 350 },
    { id: 3011, name: '301-1', floor: 3, type: 'Shega Subroom', price: 350 },
    { id: 3012, name: '301-2', floor: 3, type: 'Shega Subroom', price: 350 },
    { id: 3013, name: '301-3', floor: 3, type: 'Shega Subroom', price: 350 },
    { id: 302, name: '302', floor: 3, type: 'Jacuzzi', price: 300 },
    { id: 303, name: '303', floor: 3, type: 'Room with Hall', price: 280 },
    { id: 304, name: '304', floor: 3, type: 'Shega', price: 350 },
    { id: 3041, name: '304-1', floor: 3, type: 'Shega Subroom', price: 350 },
    { id: 3042, name: '304-2', floor: 3, type: 'Shega Subroom', price: 350 },
    { id: 3043, name: '304-3', floor: 3, type: 'Shega Subroom', price: 350 },
    { id: 305, name: '305', floor: 3, type: 'Room with Hall', price: 280 },
    { id: 306, name: '306', floor: 3, type: 'Twin Bed', price: 200 },
    { id: 307, name: '307', floor: 3, type: 'Twin Bed', price: 200 },
    
    // Floor 4
    { id: 401, name: '401', floor: 4, type: 'Shega', price: 350 },
    { id: 4011, name: '401-1', floor: 4, type: 'Shega Subroom', price: 350 },
    { id: 4012, name: '401-2', floor: 4, type: 'Shega Subroom', price: 350 },
    { id: 4013, name: '401-3', floor: 4, type: 'Shega Subroom', price: 350 },
    { id: 402, name: '402', floor: 4, type: 'Standard', price: 200 },
    { id: 403, name: '403', floor: 4, type: 'Standard', price: 200 },
    { id: 404, name: '404', floor: 4, type: 'Standard', price: 200 },
    { id: 405, name: '405', floor: 4, type: 'Twin Bed', price: 200 },
    { id: 406, name: '406', floor: 4, type: 'Standard', price: 200 },
    
    // Floor 5
    { id: 501, name: '501', floor: 5, type: 'Standard', price: 200 },
    { id: 502, name: '502', floor: 5, type: 'Twin Bed', price: 200 },
    { id: 503, name: '503', floor: 5, type: 'Standard', price: 200 },
    { id: 504, name: '504', floor: 5, type: 'Standard', price: 200 },
    { id: 505, name: '505', floor: 5, type: 'Standard', price: 200 },
    { id: 506, name: '506', floor: 5, type: 'Standard', price: 200 },
    { id: 507, name: '507', floor: 5, type: 'Twin Bed', price: 200 },
    { id: 508, name: '508', floor: 5, type: 'Twin Bed', price: 200 },
    { id: 509, name: '509', floor: 5, type: 'Twin Bed', price: 200 },
    { id: 510, name: '510', floor: 5, type: 'Twin Bed', price: 200 },
    { id: 511, name: '511', floor: 5, type: 'Twin Bed', price: 200 },
    { id: 512, name: '512', floor: 5, type: 'Twin Bed', price: 200 },
    { id: 513, name: '513', floor: 5, type: 'Twin Bed', price: 200 },
    { id: 514, name: '514', floor: 5, type: 'Standard', price: 200 },
    { id: 516, name: '516', floor: 5, type: 'Standard', price: 200 },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: checkinsData, error } = await supabase
        .from('checkins')
        .select('id, room_id, check_in_date, check_out_date, guest_name')
        .is('check_out_date', null);

      if (error) throw error;
      setCheckIns(checkinsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoomStatus = (roomId: number): 'occupied' | 'available' => {
    return checkIns.some(checkIn => checkIn.room_id === roomId && !checkIn.check_out_date)
      ? 'occupied'
      : 'available';
  };

  const getGuestName = (roomId: number): string | null => {
    const checkIn = checkIns.find(ci => ci.room_id === roomId && !ci.check_out_date);
    return checkIn?.guest_name || null;
  };

  const getCheckInDate = (roomId: number): string | null => {
    const checkIn = checkIns.find(ci => ci.room_id === roomId && !ci.check_out_date);
    return checkIn?.check_in_date || null;
  };

  const handleCheckIn = async (roomId: number) => {
    const guest_name = prompt('Enter guest name for this room:');
    if (!guest_name) return;
    
    try {
      const { error } = await supabase
        .from('checkins')
        .insert([{
          room_id: roomId,
          check_in_date: new Date().toISOString(),
          check_out_date: null,
          guest_name
        }]);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error checking in:', error);
      alert('Failed to check in. Please try again.');
    }
  };

  const handleCheckOut = async (roomId: number) => {
    if (!confirm('Are you sure you want to check out this room?')) return;
    
    try {
      const activeCheckIn = checkIns.find(
        checkIn => checkIn.room_id === roomId && !checkIn.check_out_date
      );
      if (!activeCheckIn) return;

      const { error } = await supabase
        .from('checkins')
        .update({ check_out_date: new Date().toISOString() })
        .eq('id', activeCheckIn.id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error checking out:', error);
      alert('Failed to check out. Please try again.');
    }
  };

  const handleMarkAsCleaning = async (roomId: number) => {
    try {
      // Implement your cleaning status logic here
      // This would update the room status in your database
      alert(`Room ${roomId} marked as cleaning`);
      fetchData();
    } catch (error) {
      console.error('Error marking as cleaning:', error);
    }
  };

  const handleMarkAsMaintenance = async (roomId: number) => {
    try {
      // Implement your maintenance status logic here
      // This would update the room status in your database
      alert(`Room ${roomId} marked as under maintenance`);
      fetchData();
    } catch (error) {
      console.error('Error marking as maintenance:', error);
    }
  };

  const openRoomDetails = (room: Room) => {
    setSelectedRoom(room);
    setShowRoomDetails(true);
  };

  const closeRoomDetails = () => {
    setShowRoomDetails(false);
    setSelectedRoom(null);
  };

  useEffect(() => { 
    fetchData();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('room-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'checkins' }, payload => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'Standard': return <Home className="h-5 w-5 text-blue-600" />;
      case 'Twin Bed': return <Users className="h-5 w-5 text-purple-600" />;
      case 'Shega': return <Star className="h-5 w-5 text-yellow-600" />;
      case 'Shega Subroom': return <Star className="h-5 w-5 text-yellow-400" />;
      case 'Jacuzzi': return <Bath className="h-5 w-5 text-teal-600" />;
      case 'Room with Hall': return <Home className="h-5 w-5 text-indigo-600" />;
      default: return <Bed className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRoomColor = (type: string) => {
    switch (type) {
      case 'Standard': return 'bg-blue-100 text-blue-800';
      case 'Twin Bed': return 'bg-purple-100 text-purple-800';
      case 'Shega': return 'bg-yellow-100 text-yellow-800';
      case 'Shega Subroom': return 'bg-yellow-50 text-yellow-700';
      case 'Jacuzzi': return 'bg-teal-100 text-teal-800';
      case 'Room with Hall': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'cleaning': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderFloor = (floor: number) => {
    const floorRooms = staticRooms.filter(room => room.floor === floor);
    
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
            const status = getRoomStatus(room.id);
            const guestName = getGuestName(room.id);
            const checkInDate = getCheckInDate(room.id);
            
            return (
              <div
                key={`${floor}-${room.id}`}
                className={`relative border rounded-xl p-4 transition-all duration-200 shadow-md hover:shadow-lg group ${
                  status === 'available'
                    ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
                    : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
                }`}
                onMouseEnter={() => setHoveredRoom(`${floor}-${room.id}`)}
                onMouseLeave={() => setHoveredRoom(null)}
                onClick={() => openRoomDetails(room)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      {getRoomIcon(room.type)}
                      <h3 className="font-bold text-lg text-gray-800">
                        {room.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${getRoomColor(room.type)}`}>
                        {room.type}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {room.price} SAR
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow ${
                    status === 'available'
                      ? 'bg-green-200 text-green-900'
                      : 'bg-red-200 text-red-900'
                  }`}>
                    {status === 'available' ? 'Available' : 'Occupied'}
                  </span>
                </div>

                {status === 'occupied' && guestName && (
                  <div className="mt-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="truncate max-w-[120px]">{guestName}</span>
                    </div>
                    {checkInDate && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(checkInDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-2 flex justify-between items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      status === 'available' 
                        ? handleCheckIn(room.id) 
                        : handleCheckOut(room.id);
                    }}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors duration-150 ${
                      status === 'available'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                  >
                    {status === 'available' ? 'Check In' : 'Check Out'}
                  </button>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsCleaning(room.id);
                      }}
                      className="p-1 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                      title="Mark as Cleaning"
                    >
                      <Brush className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsMaintenance(room.id);
                      }}
                      className="p-1 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
                      title="Mark as Maintenance"
                    >
                      <Wrench className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Room type specific decorations */}
                {room.type === 'Jacuzzi' && (
                  <div className="absolute bottom-1 right-1 text-teal-400 opacity-20">
                    <Bath className="h-12 w-12" />
                  </div>
                )}
                {room.type.includes('Shega') && (
                  <div className="absolute bottom-1 right-1 text-yellow-300 opacity-20">
                    <Star className="h-12 w-12" />
                  </div>
                )}
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
              <div className="flex items-center gap-3">
                <Hotel className="h-8 w-8 text-white" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Lerelax Hotel</h1>
                  <p className="text-blue-200 mt-1">Room Management Dashboard</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                  <Zap className="h-4 w-4 text-yellow-300" />
                  <span className="text-white text-sm">Real-time Updates</span>
                </div>
                <button
                  onClick={fetchData}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg shadow transition flex items-center gap-2"
                >
                  <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-b">
            <div className="flex overflow-x-auto pb-2 gap-2">
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
            {loading ? (
              <div className="text-center p-8">
                <RefreshCw className="animate-spin h-8 w-8 text-blue-500 mx-auto" />
                <p className="mt-4 text-gray-600">Loading room status...</p>
              </div>
            ) : (
              renderFloor(currentFloor)
            )}
          </div>
        </div>

        {/* Status Legend */}
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-gray-500" />
            Status Legend
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm">Cleaning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-500"></div>
              <span className="text-sm">Maintenance</span>
            </div>
          </div>
        </div>

        {/* Room Type Legend */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Bed className="h-4 w-4 text-gray-500" />
            Room Types
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Standard</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Twin Bed</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">Shega</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-4 w-4 text-teal-600" />
              <span className="text-sm">Jacuzzi</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-indigo-600" />
              <span className="text-sm">Room with Hall</span>
            </div>
          </div>
        </div>
      </div>

      {/* Room Details Modal */}
      {showRoomDetails && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    {getRoomIcon(selectedRoom.type)}
                    Room {selectedRoom.name}
                  </h2>
                  <p className="text-gray-600">{selectedRoom.type}</p>
                </div>
                <button 
                  onClick={closeRoomDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Floor:</span>
                  <span className="font-medium">Floor {selectedRoom.floor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Price:</span>
                  <span className="font-medium">{selectedRoom.price} SAR/night</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(getRoomStatus(selectedRoom.id))}`}>
                    {getRoomStatus(selectedRoom.id) === 'available' ? 'Available' : 'Occupied'}
                  </span>
                </div>

                {getRoomStatus(selectedRoom.id) === 'occupied' && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Current Guest</h4>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      <span>{getGuestName(selectedRoom.id) || 'No guest information'}</span>
                    </div>
                    {getCheckInDate(selectedRoom.id) && (
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Checked in: {new Date(getCheckInDate(selectedRoom.id)!).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => {
                      getRoomStatus(selectedRoom.id) === 'available'
                        ? handleCheckIn(selectedRoom.id)
                        : handleCheckOut(selectedRoom.id);
                      closeRoomDetails();
                    }}
                    className={`flex-1 py-2 rounded-lg font-medium ${
                      getRoomStatus(selectedRoom.id) === 'available'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                  >
                    {getRoomStatus(selectedRoom.id) === 'available' ? 'Check In' : 'Check Out'}
                  </button>
                  <button
                    onClick={() => {
                      handleMarkAsCleaning(selectedRoom.id);
                      closeRoomDetails();
                    }}
                    className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium hover:bg-yellow-200"
                  >
                    Cleaning
                  </button>
                  <button
                    onClick={() => {
                      handleMarkAsMaintenance(selectedRoom.id);
                      closeRoomDetails();
                    }}
                    className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg font-medium hover:bg-orange-200"
                  >
                    Maintenance
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomStatusDashboard;