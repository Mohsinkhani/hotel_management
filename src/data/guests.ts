import { Guest } from '../types';

export const guests: Guest[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '+1 234 567 8901',
    address: '123 Main St',
    city: 'New York',
    country: 'USA',
    reservations: ['1']
  },
  {
    id: '2',
    firstName: 'Emma',
    lastName: 'Johnson',
    email: 'emma.johnson@example.com',
    phone: '+1 987 654 3210',
    address: '456 Oak Ave',
    city: 'Los Angeles',
    country: 'USA',
    reservations: ['2']
  }
];