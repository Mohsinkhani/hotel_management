import React from 'react';
import Hero from '../components/Hero';
import FeaturedRooms from '../components/FeaturedRooms';
import Amenities from '../components/Amenities';
import Testimonials from '../components/Testimonials';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <FeaturedRooms />
      <section id="amenities">
        <Amenities />
      </section>
       <Testimonials />
   </>
  );
};

export default Home;