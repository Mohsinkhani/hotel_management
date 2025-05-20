import { Room } from '../types';

export const rooms: Room[] = [
  
{
  id: 6,
  name: 'Family Suite',
  type: 'suite',
  price: 350,
  description: 'Spacious suite ideal for families with two bedrooms and a shared lounge area.',
  capacity: 5,
  amenities: [
    'Two bedrooms',
    'Living area',
    'Free Wi-Fi',
    'Flat-screen TVs',
    'Mini fridge',
    'Coffee maker',
    'Air conditioning',
    'Safe'
  ],
  images: [
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
    'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg'
  ],
  available: true
},
{
  id: 7,
  name: 'Garden View Room',
  type: 'deluxe',
  price: 220,
  description: 'Room with a private balcony overlooking our lush garden, perfect for a relaxing stay.',
  capacity: 2,
  amenities: [
    'Queen-sized bed',
    'Balcony with garden view',
    'Free Wi-Fi',
    'Flat-screen TV',
    'Air conditioning',
    'Coffee maker',
    'Mini bar'
  ],
  images: [
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
    'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg'
  ],
  available: true
},
{
  id: 8,
  name: 'Penthouse Suite',
  type: 'standard',
  price: 1200,
  description: 'Top-floor luxury suite with a private terrace, hot tub, and breathtaking skyline views.',
  capacity: 4,
  amenities: [
    'Private terrace',
    'Hot tub',
    'Two bedrooms',
    'Full kitchen',
    'Dining area',
    'Free Wi-Fi',
    'Luxury toiletries',
    'Flat-screen TVs',
    'Espresso machine',
    'Butler service'
  ],
  images: [
    'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg',
    'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
  ],
  available: true
}

];