import React, { useState } from 'react';
import { Room } from '../types';
import { Check, X, ArrowLeft, ArrowRight } from 'lucide-react';
import BookingForm from './BookingForm';

interface RoomDetailProps {
  room: Room;
  onClose: () => void;
}

const RoomDetail: React.FC<RoomDetailProps> = ({ room, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === room.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? room.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full h-auto max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{room.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="relative mb-6 h-64 md:h-80 overflow-hidden rounded-lg">
            <img
              src={room.images[currentImageIndex]}
              alt={`${room.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {room.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all duration-200"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all duration-200"
                >
                  <ArrowRight size={20} />
                </button>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                  {room.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="col-span-2">
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="text-gray-600 mb-4">{room.description}</p>
              
              <h3 className="text-xl font-semibold mb-2">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <Check size={16} className="text-green-500 mr-2" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-blue-900">${room.price}</span>
                <span className="text-gray-500 text-sm ml-1">/ night</span>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Room Type:</span>
                  <span className="font-semibold capitalize">{room.type}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-semibold">{room.capacity} {room.capacity === 1 ? 'Person' : 'People'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability:</span>
                  <span className={`font-semibold ${room.available ? 'text-green-600' : 'text-red-600'}`}>
                    {room.available ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
              
              {!showBookingForm && (
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-md transition-colors duration-200 font-medium"
                  disabled={!room.available}
                >
                  {room.available ? 'Book This Room' : 'Not Available'}
                </button>
              )}
            </div>
          </div>

          {showBookingForm && (
            <div className="mt-4 border-t pt-4">
              <h3 className="text-xl font-semibold mb-4">Book Your Stay</h3>
              <BookingForm room={room} onCancel={() => setShowBookingForm(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;