import React from 'react';
import { Room } from '../types';
import { Check } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onClick: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={room.images[0]}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {/* {room.type === 'presidential' && (
        {room.type === 'Shega' && (
          <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 m-2 rounded-full text-xs font-bold">
            Premium
          </div>
        )} */}
        {room.type === "suite" as Room["type"] && (
          <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-full text-xs font-bold">
            Suite
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{room.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>
        
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">Key Amenities</h4>
          <div className="flex flex-wrap">
            {room.amenities.slice(0, 3).map((amenity, index) => (
              <div key={index} className="flex items-center mr-4 mb-2">
                <Check size={16} className="text-green-500 mr-1" />
                <span className="text-sm text-gray-700">{amenity}</span>
              </div>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-sm text-blue-600">+{room.amenities.length - 3} more</span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-blue-900">${room.price}</span>
            <span className="text-gray-500 text-sm ml-1">/ night</span>
          </div>
          <button
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition-colors duration-200 shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;