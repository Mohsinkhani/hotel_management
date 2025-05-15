import { Room } from '../types';

export const rooms: Room[] = [
  {
    id: 1,
    name: 'Deluxe King Room',
    type: 'deluxe',
    price: 250,
    description: 'Spacious room with a king-sized bed, workspace, and city views. Features a marble bathroom with a walk-in shower and soaking tub.',
    capacity: 2,
    amenities: [
      'King-sized bed',
      'Free Wi-Fi',
      'Mini bar',
      'Flat-screen TV',
      'Air conditioning',
      'Coffee maker',
      'Safe',
      'Work desk',
      'City view'
    ],
    images: [
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg',
      'https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg'
    ],
    available: true
  },
  {
    id: 2,
    name: 'Standard Twin Room',
    type: 'standard',
    price: 180,
    description: 'Comfortable room with two twin beds, perfect for friends or colleagues traveling together.',
    capacity: 2,
    amenities: [
      'Two twin beds',
      'Free Wi-Fi',
      'Flat-screen TV',
      'Air conditioning',
      'Coffee maker',
      'Safe',
      'Work desk'
    ],
    images: [
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
      'https://images.pexels.com/photos/3201763/pexels-photo-3201763.jpeg',
      'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg'
    ],
    available: true
  },
  {
    id: 3,
    name: 'Luxury Suite',
    type: 'suite',
    price: 450,
    description: 'Elegant suite with separate living room, bedroom with king-sized bed, and stunning ocean views.',
    capacity: 3,
    amenities: [
      'King-sized bed',
      'Separate living room',
      'Ocean view',
      'Free Wi-Fi',
      'Mini bar',
      'Flat-screen TVs',
      'Air conditioning',
      'Coffee maker',
      'Safe',
      'Work desk',
      'Premium bath amenities',
      'Bathrobe and slippers'
    ],
    images: [
      'https://images.pexels.com/photos/189333/pexels-photo-189333.jpeg',
      'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg',
      'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg'
    ],
    available: true
  },
  {
    id: 4,
    name: 'Presidential Suite',
    type: 'presidential',
    price: 850,
    description: 'Our most luxurious accommodation featuring two bedrooms, a spacious living area, dining room, and panoramic city views.',
    capacity: 4,
    amenities: [
      'Two king-sized beds',
      'Separate living room',
      'Dining area',
      'Panoramic city view',
      'Free Wi-Fi',
      'Fully stocked mini bar',
      'Multiple flat-screen TVs',
      'Air conditioning',
      'Espresso machine',
      'In-room safe',
      'Executive work desk',
      'Premium bath amenities',
      'Bathrobe and slippers',
      'Butler service'
    ],
    images: [
      'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
      'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg',
      'https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg'
    ],
    available: true
  },
  {
  id: 5,
  name: 'Economy Room',
  type: 'standard',
  price: 120,
  description: 'A budget-friendly room with essential amenities and a comfortable double bed.',
  capacity: 2,
  amenities: [
    'Double bed',
    'Free Wi-Fi',
    'Flat-screen TV',
    'Air conditioning',
    'Work desk'
  ],
  images: [
    'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
    'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg'
  ],
  available: true
},
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