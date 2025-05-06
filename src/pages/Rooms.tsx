import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import RoomCard from '../components/RoomCard';
import RoomDetail from '../components/RoomDetail';
import { Room, RoomType } from '../types';
import { Search, Filter } from 'lucide-react';

const Rooms: React.FC = () => {
  const { rooms, isLoading } = useApp();
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(rooms);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: '' as RoomType | '',
    minPrice: '',
    maxPrice: '',
    capacity: '',
    searchTerm: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get URL parameters for initial filter values
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkIn = params.get('checkIn');
    const checkOut = params.get('checkOut');
    const adults = params.get('adults');
    
    if (checkIn && checkOut) {
      // In a real app, you would filter rooms based on availability for these dates
      console.log(`Filtering for check-in: ${checkIn}, check-out: ${checkOut}`);
    }
    
    if (adults) {
      setFilters(prev => ({
        ...prev,
        capacity: adults
      }));
    }
  }, []);

  // Apply filters when rooms or filter values change
  useEffect(() => {
    if (isLoading) return;

    let result = [...rooms];

    // Filter by room type
    if (filters.type) {
      result = result.filter((room) => room.type === filters.type);
    }

    // Filter by price range
    if (filters.minPrice) {
      result = result.filter((room) => room.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((room) => room.price <= Number(filters.maxPrice));
    }

    // Filter by capacity
    if (filters.capacity) {
      result = result.filter((room) => room.capacity >= Number(filters.capacity));
    }

    // Filter by search term (name or description)
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(
        (room) =>
          room.name.toLowerCase().includes(term) || room.description.toLowerCase().includes(term)
      );
    }

    setFilteredRooms(result);
  }, [rooms, filters, isLoading]);

  const handleRoomClick = (roomId: string) => {
    setSelectedRoom(roomId);
  };

  const handleCloseDetail = () => {
    setSelectedRoom(null);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      minPrice: '',
      maxPrice: '',
      capacity: '',
      searchTerm: '',
    });
  };

  const selectedRoomData = rooms.find((room) => room.id === selectedRoom);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-blue-900 mb-4">Our Rooms & Suites</h1>
            <p className="text-gray-600">
              Discover our range of luxurious accommodations designed for your ultimate comfort and relaxation.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-grow relative">
                <input
                  type="text"
                  name="searchTerm"
                  value={filters.searchTerm}
                  onChange={handleFilterChange}
                  placeholder="Search rooms..."
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
              <button
                onClick={toggleFilters}
                className="flex items-center justify-center px-4 py-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors duration-200"
              >
                <Filter size={18} className="mr-2" />
                Filters
              </button>
            </div>

            {showFilters && (
              <div className="bg-white p-6 rounded-md shadow-md mb-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="type">
                      Room Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={filters.type}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="standard">Standard</option>
                      <option value="deluxe">Deluxe</option>
                      <option value="suite">Suite</option>
                      <option value="presidential">Presidential</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="minPrice">
                      Min Price
                    </label>
                    <input
                      type="number"
                      id="minPrice"
                      name="minPrice"
                      min="0"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min $"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="maxPrice">
                      Max Price
                    </label>
                    <input
                      type="number"
                      id="maxPrice"
                      name="maxPrice"
                      min="0"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max $"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="capacity">
                      Guests
                    </label>
                    <select
                      id="capacity"
                      name="capacity"
                      value={filters.capacity}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="1">1+ Guest</option>
                      <option value="2">2+ Guests</option>
                      <option value="3">3+ Guests</option>
                      <option value="4">4+ Guests</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Room Listing */}
          {filteredRooms.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No rooms found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters to find available rooms.</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onClick={() => handleRoomClick(room.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedRoom && selectedRoomData && (
        <RoomDetail room={selectedRoomData} onClose={handleCloseDetail} />
      )}
    </Layout>
  );
};

export default Rooms;