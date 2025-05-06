import React, { useState } from 'react';
import { Calendar, Users } from 'lucide-react';

const Hero: React.FC = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/rooms?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`;
  };

  return (
    <div className="relative h-screen">
      {/* Hero Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg" 
          alt="Luxe Hotel" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Hero Content */}
      <div className="relative h-full z-10 flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 text-center">
          Experience True Luxury
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl text-center">
          Welcome to Luxe Hotel, where elegance meets comfort in the heart of the city.
        </p>
        
        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full mt-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1">
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <Calendar size={18} className="mr-2" />
                Check In
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <Calendar size={18} className="mr-2" />
                Check Out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <Users size={18} className="mr-2" />
                Adults
              </label>
              <select
                value={adults}
                onChange={(e) => setAdults(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-1">
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <Users size={18} className="mr-2" />
                Children
              </label>
              <select
                value={children}
                onChange={(e) => setChildren(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                {[0, 1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-1">
              <label className="block text-gray-700 font-medium mb-2 invisible">
                Search
              </label>
              <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition-colors duration-200 h-[42px]"
              >
                Search Rooms
              </button>
            </div>
          </form>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center animate-bounce">
          <p className="text-sm mb-2">Scroll Down</p>
          <svg
            className="w-6 h-6 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Hero;