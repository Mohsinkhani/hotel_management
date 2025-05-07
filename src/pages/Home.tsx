import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import FeaturedRooms from '../components/FeaturedRooms';
import Amenities from '../components/Amenities';
import Testimonials from '../components/Testimonials';

const Home: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedRooms />
      <section id="amenities">
        <Amenities />
      </section>
       <Testimonials />
    </Layout>
  );
};

export default Home;