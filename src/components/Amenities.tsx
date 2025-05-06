import React from 'react';
import { Wifi, Coffee, UtensilsCrossed, Dumbbell, Sparkles, Car } from 'lucide-react';

const amenities = [
  {
    name: 'Free High-Speed WiFi',
    description: 'Stay connected with complimentary high-speed internet throughout the hotel.',
    icon: <Wifi size={32} />,
  },
  {
    name: 'Gourmet Restaurant',
    description: 'Experience exquisite dining with our award-winning chef and diverse menu options.',
    icon: <UtensilsCrossed size={32} />,
  },
  {
    name: 'Fitness Center',
    description: 'Keep up with your fitness routine in our state-of-the-art gym with modern equipment.',
    icon: <Dumbbell size={32} />,
  },
  {
    name: 'Room Service',
    description: '24/7 room service available for your convenience and comfort.',
    icon: <Coffee size={32} />,
  },
  {
    name: 'Housekeeping',
    description: 'Daily housekeeping to ensure your room remains pristine throughout your stay.',
    icon: <Sparkles size={32} />,
  },
  {
    name: 'Valet Parking',
    description: 'Complimentary valet parking for hotel guests with secure overnight storage.',
    icon: <Car size={32} />,
  },
];

const Amenities: React.FC = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-blue-900 mb-4">Hotel Amenities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enjoy our premium amenities designed to enhance your stay and provide unparalleled comfort and convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((amenity, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="text-blue-700 mb-4">
                {amenity.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{amenity.name}</h3>
              <p className="text-gray-600">{amenity.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/amenities"
            className="inline-block px-6 py-3 border border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white rounded-md transition-colors duration-200"
          >
            View All Amenities
          </a>
        </div>
      </div>
    </div>
  );
};

export default Amenities;