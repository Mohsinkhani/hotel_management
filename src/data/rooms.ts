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
  }
];