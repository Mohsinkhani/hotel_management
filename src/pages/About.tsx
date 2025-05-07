import React from 'react';

const About: React.FC = () => {
  return (
    <section
      id="about"
      className="relative bg-cover bg-center bg-no-repeat py-20 px-4 sm:px-6 lg:px-12"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-700 mb-4">About Luxe Hotel</h2>
          <p className="text-white text-lg">
            Discover elegance, comfort, and world-class hospitality in the heart of the city.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left - Text */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-4">Our Story</h3>
            <p className="text-white mb-4">
              Luxe Hotel was established in 2005 with the mission to redefine luxury and comfort. Nestled in a prime location,
              our hotel blends modern amenities with timeless elegance to offer an unforgettable experience.
            </p>
            <p className="text-white mb-4">
              With over 100 beautifully designed rooms, gourmet dining, a full-service spa, and personalized services, Luxe Hotel
              is your perfect home away from home—whether you're here for business or leisure.
            </p>
            <ul className="list-disc ml-5 text-white">
              <li>120+ Deluxe & Executive Rooms</li>
              <li>Fine Dining Restaurants & Bars</li>
              <li>Conference Halls & Banquet Facilities</li>
              <li>Heated Pool, Gym & Wellness Spa</li>
              <li>24/7 Room Service & Concierge</li>
            </ul>
          </div>

          {/* Right - Hotel Image */}
          <div className="rounded-lg overflow-hidden shadow-lg">
          <img 
          src="https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg" 
          alt="Luxe Hotel" 
          className="w-full h-full object-cover"
        />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
